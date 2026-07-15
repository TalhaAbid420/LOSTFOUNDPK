import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ITEMS = [
  {
    id: 1,
    title: 'Black Leather Wallet',
    type: 'Lost',
    category: 'Wallets',
    categoryIcon: 'wallet',
    city: 'Karachi',
    location: 'DHA Phase 6, Karachi',
    date: 'Oct 24, 2023',
    daysAgo: 260,
    description: "Black leather bifold wallet with a 'Levis' logo. Contains a CNIC and a few debit cards.",
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
  },
  {
    id: 5,
    title: 'iPhone 13 - Midnight Blue',
    type: 'Found',
    category: 'Electronics',
    categoryIcon: 'phone_iphone',
    city: 'Lahore',
    location: 'Liberty Market, Lahore',
    date: 'Yesterday',
    daysAgo: 1,
    description: 'Found in a rickshaw near Liberty Market. Phone is locked with a passcode.',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80',
  },
  {
    id: 4,
    title: 'Golden Retriever Puppy',
    type: 'Lost',
    category: 'Pets',
    categoryIcon: 'pets',
    city: 'Islamabad',
    location: 'Sector F-7, Islamabad',
    date: 'Oct 24, 2023',
    daysAgo: 260,
    description: "Lost in Sector F-7 area. Responds to the name 'Max'. Has a blue collar.",
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
  },
  {
    id: 2,
    title: 'House Keys - Keychain',
    type: 'Found',
    category: 'Keys',
    categoryIcon: 'vpn_key',
    city: 'Karachi',
    location: 'Dolmen Mall, Clifton',
    date: 'Yesterday',
    daysAgo: 1,
    description: 'Set of three silver house keys on a colorful woven keychain, found near the main entrance.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&q=80',
  },
  {
    id: 6,
    title: 'Honda City Car Keys',
    type: 'Lost',
    category: 'Keys',
    categoryIcon: 'vpn_key',
    city: 'Rawalpindi',
    location: 'Saddar, Rawalpindi',
    date: '3 days ago',
    daysAgo: 3,
    description: 'Bunch of 3 keys with a Honda remote. Lost near the Saddar market area.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
  },
  {
    id: 7,
    title: 'CNIC - Muhammad Ali',
    type: 'Found',
    category: 'Documents',
    categoryIcon: 'badge',
    city: 'Lahore',
    location: 'Liberty Market, Lahore',
    date: '2 hours ago',
    daysAgo: 0,
    description: 'Pakistani CNIC card found near Liberty Market, handed to the information counter.',
    image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&q=80',
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: 'apps' },
  { id: 'Electronics', label: 'Electronics', icon: 'phone_iphone' },
  { id: 'Documents', label: 'Documents', icon: 'description' },
  { id: 'Wallets', label: 'Wallets', icon: 'wallet' },
  { id: 'Keys', label: 'Keys', icon: 'vpn_key' },
  { id: 'Pets', label: 'Pets', icon: 'pets' },
];

const CITIES = ['All Cities', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta'];
const DATE_RANGES = [
  { id: 'all', label: 'All Time', maxDays: Infinity },
  { id: 'today', label: 'Today', maxDays: 0 },
  { id: '7days', label: 'Last 7 Days', maxDays: 7 },
  { id: '30days', label: 'Last 30 Days', maxDays: 30 },
];

function TypeBadge({ type }) {
  const styles = type === 'Lost' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  const dot = type === 'Lost' ? 'bg-amber-600' : 'bg-emerald-600';
  return (
    <div className={`absolute top-3 left-3 px-3 py-1 ${styles} rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {type.toUpperCase()}
    </div>
  );
}

function ItemCard({ item }) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative h-48">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        <TypeBadge type={item.type} />
        <div className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-lg shadow-sm border border-outline-variant">
          <span className="material-symbols-outlined text-primary text-[20px]">{item.categoryIcon}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-[18px] font-semibold text-on-surface line-clamp-1 mb-1">{item.title}</h3>
        <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{item.description}</p>
        <div className="mt-auto pt-3 border-t border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-1 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {item.city}
          </div>
          <div className="text-on-surface-variant text-xs">{item.date}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Browse() {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.query || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [city, setCity] = useState('All Cities');
  const [dateRange, setDateRange] = useState('all');
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const activeDateRange = DATE_RANGES.find((d) => d.id === dateRange);

  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchesQuery =
        query.trim() === '' ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesCity = city === 'All Cities' || item.city === city;
      const matchesDate = item.daysAgo <= activeDateRange.maxDays;
      return matchesQuery && matchesCategory && matchesCity && matchesDate;
    });
  }, [query, activeCategory, city, dateRange, activeDateRange]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 max-w-container-max mx-auto h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-xl">account_balance</span>
            </div>
            <span className="text-xl font-bold text-primary">LostFoundPK</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Home</Link>
            <Link to="/browse" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Browse</Link>
            <Link to="/report" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Report</Link>
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </nav>
          <button className="material-symbols-outlined text-on-surface-variant p-2" aria-label="Account">account_circle</button>
        </div>
      </header>

      <main className="max-w-container-max mx-auto w-full px-4 sm:px-8 py-6">
        {/* Search hero */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-2">Find what you've lost</h2>
          <p className="text-base text-on-surface-variant mb-4">Searching across Pakistan for community-reported items.</p>
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined text-outline absolute left-4 top-1/2 -translate-y-1/2">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Black leather wallet or Honda bike keys"
              className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="sticky top-16 z-40 bg-surface/95 backdrop-blur-md py-4 -mx-4 sm:-mx-8 px-4 sm:px-8 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {/* City filter */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => { setCityMenuOpen((o) => !o); setDateMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-full text-sm font-medium hover:border-primary whitespace-nowrap transition-colors"
              >
                <span>City: {city}</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {cityMenuOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 z-50">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCity(c); setCityMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${
                        city === c ? 'text-primary font-semibold' : 'text-on-surface'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date filter */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => { setDateMenuOpen((o) => !o); setCityMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-full text-sm font-medium hover:border-primary whitespace-nowrap transition-colors"
              >
                <span>Date: {activeDateRange.label}</span>
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </button>
              {dateMenuOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 z-50">
                  {DATE_RANGES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => { setDateRange(d.id); setDateMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${
                        dateRange === d.id ? 'text-primary font-semibold' : 'text-on-surface'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-outline-variant mx-1 shrink-0"></div>

            {/* Category chips */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {visibleItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-outline-variant rounded-2xl mb-8">
            <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
            <h3 className="text-lg font-semibold text-on-surface mb-1">No items match your search</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              Try adjusting your filters or search term to see more results.
            </p>
          </div>
        )}

        {/* Pagination / Load more */}
        {filteredItems.length > 0 && (
          <div className="flex flex-col items-center gap-4 py-8 border-t border-outline-variant">
            <p className="text-sm text-on-surface-variant">
              Showing {visibleItems.length} of {filteredItems.length} reported items
            </p>
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 6)}
                className="px-8 py-3 bg-surface-container-lowest border border-outline text-primary text-sm font-semibold rounded-lg hover:bg-surface-container transition-colors active:scale-95"
              >
                Load More Items
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="max-w-container-max mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">LostFoundPK</h4>
            <p className="text-xs text-on-surface-variant max-w-xs">
              © 2024 LostFoundPK. Serving Pakistan with integrity. Helping citizens reconnect with their lost belongings through community power.
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
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant px-2 py-2">
        <div className="flex justify-around items-center">
          {[
            { icon: 'home', label: 'Home', path: '/' },
            { icon: 'search', label: 'Search', path: '/browse', active: true },
            { icon: 'add_circle', label: 'Report', path: '/report' },
            { icon: 'person', label: 'Profile', path: '/dashboard' },
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
