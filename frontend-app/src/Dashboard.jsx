import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CURRENT_USER = {
  name: 'Ahmed Raza',
  city: 'Karachi, PK',
  memberSince: 'January 2024',
  avatar: 'https://ui-avatars.com/api/?name=Ahmed+Raza&background=003747&color=fff&size=160&font-size=0.38',
  reportsMade: 12,
  itemsRecovered: 5,
  verified: true,
};

const ACTIVE_REPORTS = [
  {
    id: 'r1',
    itemId: 1,
    title: 'Black Leather Wallet',
    type: 'Lost',
    location: 'DHA Phase 6, Karachi',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    hasMatch: true,
  },
  {
    id: 'r2',
    itemId: 2,
    title: 'House Keys - Keychain',
    type: 'Found',
    location: 'Dolmen Mall, Clifton',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&q=80',
  },
];

const RESOLVED_REPORTS = [
  {
    id: 'r3',
    itemId: 3,
    title: 'Blue Sports Backpack',
    resolvedOn: 'Feb 12, 2024',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  },
];

const STATS = [
  { icon: 'visibility', value: '1.2k', label: 'Total Post Views', highlight: true },
  { icon: 'forum', value: '8', label: 'Active Conversations' },
  { icon: 'shield', value: 'High', label: 'Trust Level · 5 successful returns' },
];

function TypeBadge({ type }) {
  const styles =
    type === 'Lost'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-emerald-100 text-emerald-800';
  const dot = type === 'Lost' ? 'bg-amber-600' : 'bg-emerald-600';
  return (
    <div className={`absolute top-3 left-3 px-3 py-1 ${styles} rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm`}>
      <span className={`w-2 h-2 ${dot} rounded-full animate-pulse`}></span>
      {type}
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
          alt={report.title}
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
            to="/match/default"
            className="flex items-center gap-2 mb-3 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors animate-pulse"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Possible match found — Review now
          </Link>
        )}
        <div className="flex justify-between items-start mb-1 gap-2">
          <Link to={`/item/${report.itemId}`} className="font-semibold text-[18px] text-on-surface leading-tight hover:text-primary transition-colors">
            {report.title}
          </Link>
          <button type="button" className="text-on-surface-variant hover:text-primary shrink-0" aria-label="Edit report">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant mb-4">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="text-xs">{report.location}</span>
        </div>
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
        <img src={report.image} alt={report.title} className="w-full h-full object-cover grayscale-[0.3]" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-on-surface flex items-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Resolved
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h4 className="font-semibold text-[18px] text-on-surface leading-tight line-through opacity-60 mb-1">
          {report.title}
        </h4>
        <div className="flex items-center gap-1 text-on-surface-variant mb-4">
          <span className="material-symbols-outlined text-[16px]">event_available</span>
          <span className="text-xs">Resolved on {report.resolvedOn}</span>
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

export default function Dashboard() {
  const [activeReports, setActiveReports] = useState(ACTIVE_REPORTS);
  const [resolvedReports, setResolvedReports] = useState(RESOLVED_REPORTS);
  const [resolvingId, setResolvingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleResolve = (id) => {
    setResolvingId(id);
    setTimeout(() => {
      const report = activeReports.find((r) => r.id === id);
      if (report) {
        setActiveReports((prev) => prev.filter((r) => r.id !== id));
        setResolvedReports((prev) => [
          { ...report, resolvedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          ...prev,
        ]);
      }
      setResolvingId(null);
    }, 900);
  };

  const handleDelete = (id) => {
    setActiveReports((prev) => prev.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
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
            <Link to="/About" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>

          </nav>
          <button className="material-symbols-outlined text-primary p-2" aria-label="Account">account_circle</button>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-4 sm:px-8 py-8">
        {/* Profile summary */}
        <section className="mb-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
            <div className="relative shrink-0">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-24 h-24 rounded-full border-4 border-surface-container-high object-cover"
              />
              {CURRENT_USER.verified && (
                <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              )}
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-on-surface">{CURRENT_USER.name}</h2>
              <p className="text-sm text-on-surface-variant mb-3">
                Member since {CURRENT_USER.memberSince} • {CURRENT_USER.city}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-surface-container text-primary rounded-full text-xs font-semibold">
                  {CURRENT_USER.reportsMade} Reports Made
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                  {CURRENT_USER.itemsRecovered} Items Recovered
                </span>
              </div>
            </div>
            <button
              type="button"
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </button>
          </div>
        </section>

        {/* Active reports header */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-bold text-on-surface">Your Active Reports</h3>
            <p className="text-sm text-on-surface-variant">Manage and track your reported items.</p>
          </div>
          <button type="button" className="hidden md:flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
            View History
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeReports.map((report) => (
            <ActiveReportCard
              key={report.id}
              report={report}
              onResolve={handleResolve}
              onDelete={handleDelete}
              resolvingId={resolvingId}
            />
          ))}

          {resolvedReports.map((report) => (
            <ResolvedReportCard key={report.id} report={report} />
          ))}

          <Link
            to="/report"
            className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors group min-h-[280px]"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">add</span>
            </div>
            <div>
              <h4 className="text-[18px] font-semibold text-on-surface">Report New Item</h4>
              <p className="text-sm text-on-surface-variant max-w-[200px]">Lost or found something? Start a new report here.</p>
            </div>
          </Link>
        </div>

        {/* Quick stats */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 flex items-center gap-4 ${
                stat.highlight
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-lowest border border-outline-variant text-on-surface'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                stat.highlight ? 'bg-white/20' : 'bg-surface-container text-primary'
              }`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div>
                <div className="text-2xl font-bold leading-none mb-1">{stat.value}</div>
                <div className={`text-xs ${stat.highlight ? 'opacity-80' : 'text-on-surface-variant'}`}>{stat.label}</div>
              </div>
            </div>
          ))}
        </section>
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

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant px-2 py-2 safe-area-pb">
        <div className="flex justify-around items-center">
          {[
            { icon: 'home', label: 'Home', path: '/' },
            { icon: 'search', label: 'Search', path: '/browse' },
            { icon: 'add_circle', label: 'Report', path: '/report' },
            { icon: 'person', label: 'Dashboard', path: '/dashboard', active: true },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${
                item.active ? 'text-primary bg-primary/8' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
