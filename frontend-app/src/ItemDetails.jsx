import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authFetch } from './api';

const ICON_MAP = { CNIC: 'badge', Wallet: 'account_balance_wallet', Phone: 'smartphone', Pet: 'pets', Other: 'more_horiz' };

function TypeTag({ type }) {
  const cap = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  const styles = type === 'lost' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  const dot = type === 'lost' ? 'bg-amber-600' : 'bg-emerald-600';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
      <span className={`w-2 h-2 rounded-full ${dot} ${type === 'lost' ? 'animate-pulse' : ''}`}></span>
      {cap}
    </span>
  );
}

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [contactStatus, setContactStatus] = useState('idle');
  const [similarItems, setSimilarItems] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await authFetch(`/posts/${id}`);
        const iconMap = ICON_MAP;
        setItem({
          id: data._id,
          title: `${data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : ''} - ${data.category}`,
          type: data.type,
          category: data.category,
          categoryIcon: iconMap[data.category] || 'inventory_2',
          status: data.status === 'resolved' ? 'Resolved' : 'Active',
          city: data.city,
          date: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
          description: data.description,
          images: data.photoURL ? [data.photoURL] : [
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.category)}&background=E2E8F0&color=64748B&size=600`
          ],
          reporter: {
            name: 'Community Member',
            avatar: `https://ui-avatars.com/api/?name=User&background=003747&color=fff&size=160`,
            memberSince: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            trustLevel: 'Verified',
            reportsMade: 1,
          },
        });

        // Fetch similar items (same category, excluding current post)
        try {
          const params = new URLSearchParams({ category: data.category, limit: '4' });
          const allPosts = await authFetch(`/posts/?${params.toString()}`);
          const mapped = allPosts
            .filter((p) => p._id !== data._id)
            .slice(0, 3)
            .map((p) => ({
              id: p._id,
              type: p.type,
              title: `${p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : ''} - ${p.category}`,
              location: p.city,
              images: p.photoURL ? [p.photoURL] : [
                `https://ui-avatars.com/api/?name=${encodeURIComponent(p.category)}&background=E2E8F0&color=64748B&size=400`
              ],
            }));
          setSimilarItems(mapped);
        } catch {
          // Non-fatal: similar items section will just be empty
        }
      } catch (err) {
        if (err.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
          <p className="text-sm font-medium">Loading item details…</p>
        </div>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-outline text-6xl mb-4 block">search_off</span>
          <h2 className="text-xl font-bold text-on-surface mb-2">Item not found</h2>
          <p className="text-sm text-on-surface-variant mb-6">This post may have been removed or doesn't exist.</p>
          <Link to="/browse" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isResolved = item.status === 'Resolved';
  const themeColor = item.type === 'found' ? '#10B981' : '#F59E0B';

  const handleContact = () => {
    setContactStatus('sending');
    setTimeout(() => setContactStatus('sent'), 1200);
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
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </nav>
          <button className="material-symbols-outlined text-primary p-2" aria-label="Account">account_circle</button>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-medium">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Gallery + description */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant h-[320px] sm:h-[420px] relative">
                <img src={item.images[activeImage]} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <TypeTag type={item.type} />
                  {isResolved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Resolved
                    </span>
                  )}
                </div>
              </div>
              {item.images.length > 1 && (
                <div className="flex gap-3 mt-3">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Description</h3>
              <p className="text-base text-on-surface leading-relaxed">{item.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-outline-variant">
                <div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[18px]">{item.categoryIcon}</span>
                    <span className="text-xs font-medium">Category</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">{item.category}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="text-xs font-medium">Location</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">{item.city}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[18px]">event</span>
                    <span className="text-xs font-medium">Date {item.type}</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">{item.date}</p>
                </div>
              </div>
            </section>

            <section className="bg-[#fff8e1] border border-amber-200 rounded-2xl p-6 flex gap-4">
              <span className="material-symbols-outlined text-amber-700 text-2xl shrink-0">shield</span>
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1">Safety Guidelines</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Always meet in a public, well-lit place. Verify ownership details before handing over any item. Never share your CNIC, bank details, or home address over chat.
                </p>
              </div>
            </section>
          </div>

          {/* Right: Reporter + actions */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
                {item.type === 'Found' ? 'Found By' : 'Reported By'}
              </h3>
              <div className="flex items-center gap-3 mb-5">
                <img src={item.reporter.avatar} alt={item.reporter.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="text-base font-bold text-on-surface">{item.reporter.name}</p>
                  <p className="text-xs text-on-surface-variant">Member since {item.reporter.memberSince}</p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-surface-container text-primary rounded-full text-xs font-semibold">
                  {item.reporter.reportsMade} Reports
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                  Trust: {item.reporter.trustLevel}
                </span>
              </div>

              {isResolved ? (
                <button type="button" disabled className="w-full h-12 bg-surface-container-high text-on-surface-variant rounded-xl font-semibold cursor-not-allowed">
                  Report Closed
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleContact}
                    disabled={contactStatus !== 'idle'}
                    className="w-full h-12 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                    style={{ backgroundColor: contactStatus === 'sent' ? '#003a26' : themeColor }}
                  >
                    {contactStatus === 'idle' && (
                      <>
                        <span className="material-symbols-outlined">chat</span>
                        {item.type === 'Found' ? 'This Is Mine' : 'I Found This'}
                      </>
                    )}
                    {contactStatus === 'sending' && (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Connecting…
                      </>
                    )}
                    {contactStatus === 'sent' && (
                      <>
                        <span className="material-symbols-outlined">done_all</span>
                        Request Sent
                      </>
                    )}
                  </button>
                  <button type="button" className="w-full h-12 mt-3 border border-outline-variant rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">flag</span>
                    Report Inappropriate
                  </button>
                </>
              )}
            </section>
          </div>
        </div>

        {/* Similar items */}
        {similarItems.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-bold text-on-surface mb-5">Similar Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarItems.map((sim) => (
                <Link
                  key={sim.id}
                  to={`/item/${sim.id}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-40 w-full relative overflow-hidden">
                    <img src={sim.images[0]} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <TypeTag type={sim.type} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-on-surface leading-tight mb-1">{sim.title}</h4>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="text-xs">{sim.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant mt-10">
        <div className="max-w-container-max mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">LostFoundPK</h4>
            <p className="text-xs text-on-surface-variant max-w-xs">
              © 2024 LostFoundPK. Serving Pakistan with integrity. The most reliable platform for reuniting people with their lost belongings.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end items-start">
            <Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">About Us</Link>
            <Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</Link>
            <Link to="/Legal" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
