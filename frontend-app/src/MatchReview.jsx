import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authFetch } from './api';


function MaterialIcon({ name, className = '', filled = false }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}


function ComparisonCard({ post, accentIcon, accentLabel, accentColor, highlight }) {
  const badgeStyles =
    post.type === 'Lost' ? 'bg-amber-600/10 text-amber-700 border-amber-600/20' : 'bg-emerald-600/10 text-emerald-700 border-emerald-600/20';

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <MaterialIcon name={accentIcon} className={accentColor} />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{accentLabel}</h2>
      </div>
      <div
        className={`bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col ${
          highlight
            ? 'border-2 border-primary shadow-md ring-4 ring-primary/10'
            : 'border border-outline-variant shadow-sm'
        }`}
      >
        <div className="h-64 bg-surface-container relative overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${badgeStyles}`}>
              {post.type.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-on-surface mb-1">{post.title}</h3>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <MaterialIcon name="category" className="text-[16px]" />
              <span className="text-sm">{post.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-outline-variant/60">
            {post.fields.map((field) => (
              <div key={field.label}>
                <p className="text-xs text-on-surface-variant/80 uppercase tracking-wide">{field.label}</p>
                <p className="text-sm text-on-surface font-medium">{field.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-on-surface-variant/80 uppercase tracking-wide mb-1">
              {post.finder ? 'Description Snippet' : 'Description'}
            </p>
            <p className="text-sm text-on-surface-variant italic leading-relaxed">"{post.description}"</p>
          </div>

          {post.finder && (
            <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/60">
              <img src={post.finder.avatar} alt={post.finder.name} className="w-9 h-9 rounded-full" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{post.finder.name}</p>
                <p className="text-xs text-on-surface-variant">Trust Level: {post.finder.trustLevel}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function MatchReview() {
  const { id } = useParams(); // Our post's ID
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchRecord, setMatchRecord] = useState(null); // The match document
  const [yourPost, setYourPost] = useState(null);
  const [matchPost, setMatchPost] = useState(null);
  const [status, setStatus] = useState('reviewing'); // reviewing | confirming | confirmed | rejectConfirm | rejected

  const mapPost = (post) => {
    return {
      type: post.type === 'lost' ? 'Lost' : 'Found',
      title: `${post.type === 'lost' ? 'Lost' : 'Found'} ${post.category}`,
      category: post.category,
      image: post.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.category)}&background=E2E8F0&color=64748B&size=600`,
      fields: [
        { label: 'Location', value: post.city },
        { label: `Date ${post.type === 'lost' ? 'Lost' : 'Found'}`, value: post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '' },
      ],
      description: post.description,
    };
  };

  useEffect(() => {
    async function loadMatchDetails() {
      setLoading(true);
      setError('');
      try {
        // Fetch matches associated with this post
        const matchesList = await authFetch(`/matches/${id}`);
        if (!Array.isArray(matchesList) || matchesList.length === 0) {
          setError('No potential matches found for this post yet.');
          return;
        }

        // Find the first pending match, or fallback to the first match
        const activeMatch = matchesList.find((m) => m.status === 'pending') || matchesList[0];
        setMatchRecord(activeMatch);

        // Fetch details of both posts in the match
        const [lostDetails, foundDetails] = await Promise.all([
          authFetch(`/posts/${activeMatch.lostPostId}`),
          authFetch(`/posts/${activeMatch.foundPostId}`),
        ]);

        // Decide which post is "yours" and which is the "matched" post
        if (id === activeMatch.lostPostId) {
          setYourPost(mapPost(lostDetails));
          setMatchPost({
            ...mapPost(foundDetails),
            finder: {
              name: 'Community Member',
              avatar: `https://ui-avatars.com/api/?name=User&background=10B981&color=fff&size=120`,
              trustLevel: 'High',
            },
          });
        } else {
          setYourPost(mapPost(foundDetails));
          setMatchPost({
            ...mapPost(lostDetails),
            finder: {
              name: 'Community Member',
              avatar: `https://ui-avatars.com/api/?name=User&background=10B981&color=fff&size=120`,
              trustLevel: 'High',
            },
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load match details.');
      } finally {
        setLoading(false);
      }
    }

    loadMatchDetails();
  }, [id]);

  const handleConfirm = async () => {
    if (!matchRecord) return;
    setStatus('confirming');
    try {
      await authFetch(`/matches/${matchRecord.id}/confirm`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'confirmed' }),
      });
      setStatus('confirmed');
    } catch (err) {
      alert(err.message || 'Failed to confirm the match.');
      setStatus('reviewing');
    }
  };

  const handleReject = () => setStatus('rejectConfirm');
  const cancelReject = () => setStatus('reviewing');

  const finalizeReject = async () => {
    if (!matchRecord) return;
    try {
      await authFetch(`/matches/${matchRecord.id}/confirm`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'dismissed' }),
      });
      setStatus('rejected');
    } catch (err) {
      alert(err.message || 'Failed to dismiss the match.');
      setStatus('reviewing');
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col">
        <MatchHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
            <p className="text-sm font-medium">Loading match details…</p>
          </div>
        </main>
        <MatchFooter />
      </div>
    );
  }

  if (error || !yourPost || !matchPost) {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col">
        <MatchHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-outline text-4xl">search_off</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">No active matches</h2>
            <p className="text-sm text-on-surface-variant mb-8">{error || 'There are no match details to review.'}</p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
        <MatchFooter />
      </div>
    );
  }

  if (status === 'confirmed') {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col">
        <MatchHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <MaterialIcon name="celebration" className="text-4xl" filled />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Match Confirmed!</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Great news — {matchPost.finder?.name || 'the finder'} has been notified. A secure
              conversation has been opened so you can safely arrange the handover.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-outline-variant text-on-surface rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <MatchFooter />
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col">
        <MatchHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6">
              <MaterialIcon name="delete_sweep" className="text-4xl text-on-surface-variant" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Match Rejected</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              No problem — we'll keep monitoring new found reports and let you know if a better match
              for your item shows up.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
        <MatchFooter />
      </div>
    );
  }

  const similarityScore = matchRecord ? Math.round(matchRecord.score * 100) : 0;
  const similarityNote = similarityScore > 70
    ? 'High probability match based on category, description similarity and city proximity.'
    : 'Moderate match based on matching category and description keyword overlaps.';

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col pb-24 md:pb-0">
      <MatchHeader />

      <main className="flex-grow w-full max-w-container-max mx-auto px-4 sm:px-8 py-8">
        {/* Screen header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">Verify Possible Match</h1>
          <p className="text-on-surface-variant max-w-2xl">
            We've identified a potential match for the item you reported. Please review the details
            carefully to confirm if this belongs to you.
          </p>
        </div>

        {/* Similarity indicator */}
        <div className="mb-8 flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-xl border border-outline-variant relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-1 opacity-80"
            style={{ width: '100%', background: 'linear-gradient(90deg, #1F4E5F 0%, #2D6A4F 100%)' }}
          />
          <div className="flex items-center gap-3 mb-2">
            <MaterialIcon name="analytics" className="text-emerald-700 text-2xl" filled />
            <span className="text-xl md:text-2xl font-bold text-emerald-800">{similarityScore}% Description Similarity</span>
          </div>
          <p className="text-sm text-on-surface-variant text-center">{similarityNote}</p>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ComparisonCard
            post={yourPost}
            accentIcon="person_pin"
            accentLabel="Your Reported Post"
            accentColor="text-primary"
          />
          <ComparisonCard
            post={matchPost}
            accentIcon="check_circle"
            accentLabel="Possible Match (Found Post)"
            accentColor="text-emerald-700"
            highlight
          />
        </div>


        {/* Actions */}
        {status === 'rejectConfirm' ? (
          <div className="mt-10 max-w-lg mx-auto p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl text-center">
            <MaterialIcon name="help" className="text-3xl text-on-surface-variant mb-3" />
            <h3 className="text-lg font-semibold text-on-surface mb-2">Are you sure this isn't a match?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              This will dismiss the notification. We'll keep looking for other matches for your item.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={finalizeReject}
                className="px-6 py-3 bg-[#93000a] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Yes, Not a Match
              </button>
              <button
                type="button"
                onClick={cancelReject}
                className="px-6 py-3 border border-outline-variant text-on-surface rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 py-8 border-t border-outline-variant">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={status === 'confirming'}
              className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'confirming' ? (
                <>
                  <MaterialIcon name="sync" className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <MaterialIcon name="verified" filled />
                  Confirm This Is My Item
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={status === 'confirming'}
              className="w-full md:w-auto px-10 py-4 border border-outline text-on-surface-variant rounded-xl font-medium hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MaterialIcon name="close" />
              Not a Match
            </button>
          </div>
        )}

        {/* Safety disclaimer */}
        <div className="mt-8 p-4 bg-surface-container-low rounded-xl flex gap-3 items-start">
          <MaterialIcon name="info" className="text-on-surface-variant" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <strong>Safety Reminder:</strong> When arranging a return, always meet in a public place.
            If you confirm this match, the finder will be notified and you will be able to message
            them securely through our platform.
          </p>
        </div>
      </main>

      <MatchFooter />

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant px-2 py-2">
        <div className="flex justify-around items-center">
          {[
            { icon: 'home', label: 'Home', path: '/' },
            { icon: 'search', label: 'Search', path: '/browse' },
            { icon: 'add_circle', label: 'Report', path: '/report' },
            { icon: 'person', label: 'Profile', path: '/dashboard' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-primary transition-colors"
            >
              <MaterialIcon name={item.icon} className="text-xl" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function MatchHeader() {
  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 max-w-container-max mx-auto h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <MaterialIcon name="account_balance" className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold text-primary">LostFoundPK</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Home</Link>
          <Link to="/browse" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Search</Link>
          <Link to="/dashboard" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Matches</Link>
        </nav>
        <Link to="/dashboard" className="material-symbols-outlined text-primary p-2" aria-label="Account">account_circle</Link>
      </div>
    </header>
  );
}

function MatchFooter() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="max-w-container-max mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-bold text-primary mb-2">LostFoundPK</h4>
          <p className="text-xs text-on-surface-variant max-w-xs">
            © 2024 LostFoundPK. Serving Pakistan with integrity.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end items-start">
          <Link to="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">About Us</Link>
          <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</a>
          <Link to="/Legal" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
          <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
