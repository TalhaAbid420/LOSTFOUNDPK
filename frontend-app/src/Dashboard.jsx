import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authFetch, getUser, removeAuth } from './api';

// -------------------------------------------------------------------------
// Sub-components (TypeBadge, ActiveReportCard, ResolvedReportCard) are
// kept exactly as they were visually — only data is now real.
// -------------------------------------------------------------------------

function TypeBadge({ type }) {
  const cap = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  const styles =
    type === 'lost'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-emerald-100 text-emerald-800';
  const dot = type === 'lost' ? 'bg-amber-600' : 'bg-emerald-600';
  return (
    <div className={`absolute top-3 left-3 px-3 py-1 ${styles} rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm`}>
      <span className={`w-2 h-2 ${dot} rounded-full animate-pulse`}></span>
      {cap}
    </div>
  );
}

function ActiveReportCard({ report, onDelete, onResolve, resolvingId }) {
  const isResolving = resolvingId === report.id;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="h-48 w-full relative overflow-hidden">
        <img
          src={report.image}
          alt={report.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <TypeBadge type={report.type} />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => onDelete(report.id)}
            className="bg-white/90 p-2 rounded-lg text-on-surface-variant hover:text-[#93000a] hover:bg-white transition-colors shadow-sm"
            aria-label="Delete report"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        {report.hasMatch && (
          <Link
            to={`/match/${report.id}`}
            className="flex items-center gap-2 mb-3 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors animate-pulse"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Possible match found — Review now
          </Link>
        )}
        <div className="flex justify-between items-start mb-1 gap-2">
          <Link to={`/item/${report.id}`} className="font-semibold text-[18px] text-on-surface leading-tight hover:text-primary transition-colors">
            {report.category} — {report.city}
          </Link>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant mb-1">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="text-xs">{report.city}</span>
        </div>
        <div className="text-xs text-on-surface-variant mb-4">{report.date}</div>
        <div className="mt-auto pt-4 border-t border-outline-variant">
          <button
            type="button"
            disabled={isResolving}
            onClick={() => onResolve(report.id)}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {isResolving ? 'Marking as Resolved…' : 'Mark as Resolved'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResolvedReportCard({ report }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden flex flex-col opacity-80">
      <div className="h-48 w-full relative overflow-hidden">
        <img src={report.image} alt={report.category} className="w-full h-full object-cover grayscale-[0.3]" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-on-surface flex items-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Resolved
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h4 className="font-semibold text-[18px] text-on-surface leading-tight line-through opacity-60 mb-1">
          {report.category} — {report.city}
        </h4>
        <div className="flex items-center gap-1 text-on-surface-variant mb-4">
          <span className="material-symbols-outlined text-[16px]">event_available</span>
          <span className="text-xs">Resolved on {report.date}</span>
        </div>
        <div className="mt-auto pt-4 border-t border-outline-variant">
          <button type="button" disabled className="w-full py-2.5 bg-surface-container-high text-on-surface-variant rounded-lg text-sm font-medium cursor-not-allowed">
            Report Closed
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Main Dashboard component
// -------------------------------------------------------------------------

const ICON_MAP = { CNIC: 'badge', Wallet: 'account_balance_wallet', Phone: 'smartphone', Pet: 'pets', Other: 'more_horiz' };

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();  // { id, name, email } from localStorage

  const [activeReports, setActiveReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Map a backend PostResponse to a card-friendly shape
  const toCard = async (post) => {
    const base = {
      id: post._id,
      type: post.type,
      category: post.category,
      city: post.city,
      date: post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      image: post.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.category)}&background=E2E8F0&color=64748B&size=400`,
      hasMatch: false,
    };

    // Check if this post has any matches
    try {
      const matches = await authFetch(`/matches/${post._id}`);
      base.hasMatch = Array.isArray(matches) && matches.length > 0;
    } catch {
      // non-fatal — match badge just won't show
    }

    return base;
  };

  useEffect(() => {
    if (!user) {
      // Not logged in → redirect to login
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
      return;
    }

    async function loadPosts() {
      setLoading(true);
      setApiError('');
      try {
        const allPosts = await authFetch('/posts/?limit=200');

        // Filter posts belonging to the current user
        const myPosts = allPosts.filter((p) => String(p.userId) === String(user.id));

        // Resolve match badges concurrently
        const cards = await Promise.all(myPosts.map(toCard));

        setActiveReports(cards.filter((c) => {
          const raw = myPosts.find((p) => p._id === c.id);
          return raw && raw.status !== 'resolved';
        }));

        setResolvedReports(cards.filter((c) => {
          const raw = myPosts.find((p) => p._id === c.id);
          return raw && raw.status === 'resolved';
        }));
      } catch (err) {
        setApiError(err.message || 'Failed to load your reports.');
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await authFetch(`/posts/${id}/resolve`, { method: 'PATCH' });
      const report = activeReports.find((r) => r.id === id);
      if (report) {
        setActiveReports((prev) => prev.filter((r) => r.id !== id));
        setResolvedReports((prev) => [{ ...report, hasMatch: false }, ...prev]);
      }
    } catch (err) {
      alert(err.message || 'Could not resolve the post.');
    } finally {
      setResolvingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report permanently?')) return;
    try {
      await authFetch(`/posts/${id}`, { method: 'DELETE' });
      setActiveReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete the post.');
    }
  };

  const handleLogout = () => {
    removeAuth();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This will permanently remove all your reports, matches, and profile data. This cannot be undone.')) return;
    try {
      await authFetch('/auth/me', { method: 'DELETE' });
      removeAuth();
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Could not delete account.');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-surface/95 backdrop-blur-md sticky top-0 border-b border-outline-variant z-40">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 max-w-container-max mx-auto h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-xl">account_balance</span>
            </div>
            <span className="text-xl font-bold text-primary">LostFoundPK</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Home</Link>
            <Link to="/browse" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Browse</Link>
            <Link to="/report" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Report</Link>
            <Link to="/about" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-4 sm:px-8 py-8">
        {/* Profile summary */}
        <section className="mb-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
            <div className="relative shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=003747&color=fff&size=160&font-size=0.38`}
                alt={user?.name || 'User'}
                className="w-24 h-24 rounded-full border-4 border-surface-container-high object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-on-surface">{user?.name || 'Your Account'}</h2>
              <p className="text-sm text-on-surface-variant mt-1">{user?.email || ''}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <Link to="/report" className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New Report
                </Link>
                <Link to="/browse" className="px-5 py-2 border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Browse Posts
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-5 py-2 border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium">
            <span className="material-symbols-outlined">error</span>
            {apiError}
          </div>
        )}

        {/* Active reports */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-on-surface">My Active Reports</h3>
            <span className="text-sm text-on-surface-variant">{activeReports.length} active</span>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-surface-container-high" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface-container-high rounded w-2/3" />
                    <div className="h-3 bg-surface-container-high rounded w-full" />
                    <div className="h-8 bg-surface-container-high rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeReports.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-outline-variant rounded-2xl">
              <span className="material-symbols-outlined text-outline text-4xl mb-3 block">inbox</span>
              <p className="text-on-surface-variant text-sm">You have no active reports.</p>
              <Link to="/report" className="mt-4 inline-block px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90">
                Create your first report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeReports.map((report) => (
                <ActiveReportCard
                  key={report.id}
                  report={report}
                  onDelete={handleDelete}
                  onResolve={handleResolve}
                  resolvingId={resolvingId}
                />
              ))}
            </div>
          )}
        </section>

        {/* Resolved reports */}
        {resolvedReports.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-on-surface">Resolved Reports</h3>
              <span className="text-sm text-on-surface-variant">{resolvedReports.length} resolved</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resolvedReports.map((report) => (
                <ResolvedReportCard key={report.id} report={report} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
