import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { authFetch } from "./api";

const RECENT_REPORTS = [
  {
    id: 1,
    type: "found",
    title: "CNIC - Muhammad Ali",
    icon: "badge",
    location: "Liberty Market, Lahore",
    date: "2 hours ago",
    action: "Claim Item",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPLQW7NKwCLA576gsRjRXxNwwns2Gr-fKi_J8pC8FKo5PSJjGG8-UJT9-Zi2fOBqWAL5L05TAmzoedTqox-XEb1Iq_2UuvyNSe9VqwefM-yS6eFH4TYfSMtJy6EwTXxWlwkfVEq_yil3n0WtBla_rk1NlpxnQOwfECMm2Cf5jmTG8BJEO3PkW1RyTK__M9_UiycH_1hbQ8CbRAQGCaEe3Ta5JS6sKgNoCiVuoAxJLJxF26y-y-EhFmjg",
    alt: "Pakistani CNIC on a clean desk.",
  },
  {
    id: 2,
    type: "lost",
    title: "Black Leather Wallet",
    icon: "account_balance_wallet",
    location: "Saddar, Karachi",
    date: "Oct 24, 2023",
    action: "I Found This",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFLHbEeM8FW3k67SW3CTW7fvLY69VG6EHshEU5TfpMhIamRMSaRy3lyoEl2hh23-d98waVkVSsOIp_8ktjaB2upBYhGa2r-ezITWCoj7t8vMzj6APbuM5Q9CysCRqaC7b_D1-0407N19eNVmLi2d3_pQr6VfkC0y0XMc2eQLzDMurhJJx7EeF9RehKj9I7klWW14uulJ0lLHl4U29n6-8kIIAutERSGehm4hYexiSj1Llyyzx_hL5DxA",
    alt: "Brown leather wallet on a city sidewalk.",
  },
  {
    id: 3,
    type: "found",
    title: "Car Keys (Toyota)",
    icon: "vpn_key",
    location: "F-6 Markaz, Islamabad",
    date: "Yesterday",
    action: "Claim Item",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEeuhWQmOsq1CZwLMzi1KKTq_VMMctlghXEpXUyY5d1b6jAIOAQWaMNf2dtEFC2bEaeRU4xkSoFfsWlsDWCHYhINo4wXwu83q2YOaIRa2BZ5DeOpwTLE4Lt6K0EzKh6zpEj8OrGNfQOk0nm3EXhleEkIgz5CTLgjNauTJ_TmXlwXgrH7wvxBCOActgTLGIBEyCEqHLq9vaS6u7fXi_sSCIVvsf-X7CIJkRE7AJ42dIHlQubJhGB20fw",
    alt: "Car keys on a clean white surface.",
  },
];

const STATS = [
  { value: "12,450+", label: "Items Reported", icon: "inventory_2", accent: "primary" },
  { value: "3,892", label: "Successfully Reunited", icon: "handshake", accent: "found" },
  { value: "24h", label: "Average Response", icon: "schedule", accent: "primary" },
  { value: "Nationwide", label: "Coverage Across Pakistan", icon: "public", accent: "primary" },
];

const FEATURES = [
  {
    icon: "verified",
    title: "Verified Reports",
    description: "Every listing is reviewed to reduce fraud and keep the community safe.",
  },
  {
    icon: "lock",
    title: "Secure Handover",
    description: "Connect through protected messaging before arranging a safe exchange.",
  },
  {
    icon: "travel_explore",
    title: "City-Wide Reach",
    description: "Search and report items across Lahore, Karachi, Islamabad, and beyond.",
  },
];

const STEPS = [
  {
    step: "01",
    icon: "edit_note",
    title: "Report the Item",
    description: "Upload a photo, location, and description. Choose lost or found in seconds.",
  },
  {
    step: "02",
    icon: "auto_awesome",
    title: "Smart Matching",
    description: "Our system scans reports by category, area, and keywords to surface leads.",
  },
  {
    step: "03",
    icon: "celebration",
    title: "Reunite Safely",
    description: "Message the other party and coordinate a verified, secure recovery.",
  },
];

const TYPE_STYLES = {
  lost: { badge: "bg-lost", label: "Lost" },
  found: { badge: "bg-found", label: "Found" },
};

const ACCENT_TEXT = {
  primary: "text-primary",
  found: "text-found",
};

function MaterialIcon({ name, className = "", filled = false }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="section-eyebrow text-label-md font-semibold uppercase text-primary tracking-widest mb-3">
      {children}
    </p>
  );
}

function ReportCard({ report }) {
  const styles = TYPE_STYLES[report.type];

  return (
    <Link
      to={`/item/${report.id}`}
      className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div className="h-52 overflow-hidden bg-surface-container">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-[1.03] transition-transform duration-500"
          style={{ backgroundImage: `url('${report.image}')` }}
          role="img"
          aria-label={report.alt}
        />
      </div>
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <span
              className={`${styles.badge} inline-block text-white text-caption font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md`}
            >
              {styles.label}
            </span>
            <h4 className="text-lg font-semibold text-on-surface leading-snug truncate">
              {report.title}
            </h4>
          </div>
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
            <MaterialIcon name={report.icon} className="text-primary text-xl" />
          </div>
        </div>
        <div className="space-y-2 text-on-surface-variant">
          <div className="flex items-center gap-2 text-label-md">
            <MaterialIcon name="location_on" className="text-[17px] text-outline" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center gap-2 text-label-md">
            <MaterialIcon name="schedule" className="text-[17px] text-outline" />
            <span>{report.date}</span>
          </div>
        </div>
        <span className="mt-auto w-full py-2.5 rounded-xl border border-outline-variant text-label-md font-medium text-on-surface text-center group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-colors">
          {report.action}
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [headerElevated, setHeaderElevated] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");
  const [recentReports, setRecentReports] = useState(RECENT_REPORTS);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setHeaderElevated(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real posts and merge with demo data to always show 3
  useEffect(() => {
    async function loadRecent() {
      try {
        const posts = await authFetch("/posts/?limit=3");
        if (posts && posts.length > 0) {
          const iconMap = { CNIC: "badge", Wallet: "account_balance_wallet", Phone: "smartphone", Pet: "pets", Other: "more_horiz" };
          const mapped = posts.map((p) => ({
            id: p._id,
            type: p.type,
            title: `${p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : ""} ${p.category}`,
            icon: iconMap[p.category] || "inventory_2",
            location: p.city,
            date: p.date ? new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "",
            action: p.type === "found" ? "Claim Item" : "I Found This",
            image: p.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.category)}&background=E2E8F0&color=64748B&size=400`,
            alt: p.description,
            isReal: true,
          }));
          // Pad with demo reports to always show 3
          const remaining = RECENT_REPORTS.slice(0, Math.max(0, 3 - mapped.length));
          setRecentReports([...mapped, ...remaining]);
        }
      } catch {
        // Keep demo reports on error
      }
    }
    loadRecent();
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    // TODO: hook up actual sign-out logic (clear auth/session) here
  };

  const handleHeroSearch = () => {
    navigate("/browse", { state: { query: heroQuery } });
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full bg-surface-container-lowest/95 backdrop-blur-md transition-all duration-300 ${
          headerElevated
            ? "shadow-[0_1px_0_#E2E8F0,0_4px_24px_rgba(15,23,42,0.06)]"
            : "border-b border-outline-variant"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-gutter max-w-container-max mx-auto">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <MaterialIcon name="account_balance" className="text-on-primary text-xl" />
            </div>
            <div className="text-left">
              <p className="text-base font-bold text-primary leading-none">LostFoundPK</p>
              <p className="text-caption text-on-surface-variant hidden sm:block">Recovery Network</p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 rounded-lg text-label-md font-medium transition-colors text-primary bg-primary/8">Home</Link>
            <Link to="/browse" className="px-4 py-2 rounded-lg text-label-md font-medium transition-colors text-on-surface-variant hover:text-primary hover:bg-surface-container">Browse</Link>
            {/* Top nav path update kiya */}
            <Link to="/report" className="px-4 py-2 rounded-lg text-label-md font-medium transition-colors text-on-surface-variant hover:text-primary hover:bg-surface-container">Report</Link>
            <Link to="/about" className="px-4 py-2 rounded-lg text-label-md font-medium transition-colors text-on-surface-variant hover:text-primary hover:bg-surface-container">About</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-label-md font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-colors shadow-sm"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                <MaterialIcon name="account_circle" className="text-2xl" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] py-2 z-50">
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <MaterialIcon name="person" className="text-lg text-on-surface-variant" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-md text-[#93000a] hover:bg-surface-container-low transition-colors text-left"
                  >
                    <MaterialIcon name="logout" className="text-lg" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="button" className="lg:hidden p-2 rounded-lg hover:bg-surface-container">
            <MaterialIcon name="menu" className="text-primary text-2xl" />
          </button>
        </div>
      </header>

      <main className="pb-20 md:pb-0">
        <section className="hero-mesh relative px-gutter pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
          <div className="max-w-container-max mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-label-md font-medium">
                  <MaterialIcon name="verified_user" className="text-[18px]" />
                  Pakistan&apos;s Trusted Recovery Network
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-primary leading-[1.1] tracking-tight">
                  Reunite with what you&apos;ve{" "}
                  <span className="text-found">lost</span>
                </h1>

                <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Report lost belongings, share found items, and help fellow citizens recover what
                  matters — safely, quickly, and nationwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                  {/* Yahan bhi paths ko /report kiya hai */}
                  <Link 
                    to="/report" 
                    state={{ type: 'Lost' }}
                    className="inline-flex items-center justify-center gap-2.5 bg-lost text-white px-7 py-3.5 rounded-xl text-label-md font-semibold shadow-md hover:bg-[#B45309] active:scale-[0.98] transition-all"
                  >
                    <MaterialIcon name="error" filled className="text-xl" />
                    Report Lost Item
                  </Link>
                  
                  <Link 
                    to="/report" 
                    state={{ type: 'Found' }}
                    className="inline-flex items-center justify-center gap-2.5 bg-found text-white px-7 py-3.5 rounded-xl text-label-md font-semibold shadow-md hover:bg-[#047857] active:scale-[0.98] transition-all"
                  >
                    <MaterialIcon name="check_circle" filled className="text-xl" />
                    Report Found Item
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-2 text-caption text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <MaterialIcon name="shield" className="text-found text-base" />
                    Verified listings
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MaterialIcon name="groups" className="text-primary text-base" />
                    12,000+ community reports
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-found/10 rounded-3xl blur-2xl" />
                <div className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <p className="text-label-md font-semibold text-on-surface mb-4">Search the registry</p>
                  <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <MaterialIcon name="search" className="text-outline ml-2" />
                    <input
                      className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-3 text-body-md placeholder:text-outline"
                      placeholder="Wallet, CNIC, keys, phone..."
                      type="text"
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                    />
                    <button
                      type="button"
                      onClick={handleHeroSearch}
                      className="shrink-0 bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-md font-medium hover:bg-primary-container transition-colors"
                    >
                      Search
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["CNIC", "Wallet", "Phone", "Keys", "Bag"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-surface-container text-caption font-medium text-on-surface-variant hover:bg-primary/8 hover:text-primary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-outline-variant bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-gutter py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 p-4 lg:p-0"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center">
                    <MaterialIcon
                      name={stat.icon}
                      className={`text-xl ${ACCENT_TEXT[stat.accent]}`}
                    />
                  </div>
                  <div>
                    <p className={`text-2xl lg:text-3xl font-bold tracking-tight ${ACCENT_TEXT[stat.accent]}`}>
                      {stat.value}
                    </p>
                    <p className="text-label-md text-on-surface-variant mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-gutter py-16 lg:py-20">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <SectionEyebrow>Why LostFoundPK</SectionEyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
                Built for trust, designed for clarity
              </h2>
              <p className="mt-4 text-body-md text-on-surface-variant">
                A civic-grade platform that makes reporting and recovering lost items straightforward
                for every Pakistani citizen.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:border-primary/25 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                    <MaterialIcon name={feature.icon} className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-on-surface mb-2">{feature.title}</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="px-gutter py-16 lg:py-20 bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <SectionEyebrow>Live Feed</SectionEyebrow>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
                  Recent Reports
                </h2>
                <p className="mt-3 text-body-md text-on-surface-variant max-w-xl">
                  Latest lost and found items posted across Pakistan — updated in real time.
                </p>
              </div>
              <Link
                to="/browse"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto px-5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-label-md font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors"
              >
                View all reports
                <MaterialIcon name="arrow_forward" className="text-lg" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-gutter py-16 lg:py-24">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <SectionEyebrow>How It Works</SectionEyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">
                Three steps to recovery
              </h2>
              <p className="mt-4 text-body-md text-on-surface-variant">
                From report to reunion — a simple, guided process anyone can follow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-outline-variant" />
              {STEPS.map((step) => (
                <div
                  key={step.step}
                  className="relative text-center px-4 py-6 rounded-2xl bg-surface-container-lowest border border-outline-variant"
                >
                  <div className="relative z-10 w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <MaterialIcon name={step.icon} className="text-2xl" />
                  </div>
                  <p className="text-caption font-bold text-primary/60 tracking-widest mb-2">
                    STEP {step.step}
                  </p>
                  <h3 className="text-lg font-semibold text-on-surface mb-2">{step.title}</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-gutter pb-16 lg:pb-24">
          <div className="max-w-container-max mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 lg:px-16 lg:py-16 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-on-primary tracking-tight">
                  Every item has a story. Help write the ending.
                </h2>
                <p className="text-body-lg text-on-primary/80">
                  Join thousands of Pakistanis using LostFoundPK to report, search, and reunite —
                  free and open to everyone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    to="/signup"
                    className="px-8 py-3.5 rounded-xl bg-surface-container-lowest text-primary font-semibold text-label-md hover:bg-white transition-colors shadow-sm"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/browse"
                    className="px-8 py-3.5 rounded-xl border border-on-primary/30 text-on-primary font-semibold text-label-md hover:bg-white/10 transition-colors"
                  >
                    Browse Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2A3D] text-on-primary/70">
        <div className="max-w-container-max mx-auto px-gutter py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <MaterialIcon name="account_balance" className="text-on-primary text-xl" />
              </div>
              <span className="text-lg font-bold text-on-primary">LostFoundPK</span>
            </div>
            <p className="text-body-md leading-relaxed max-w-sm text-on-primary/60">
              Serving Pakistan with integrity. Leveraging technology to bring honesty and relief back
              to communities nationwide.
            </p>
          </div>

          <div>
            <h5 className="text-label-md font-semibold text-on-primary mb-4">Company</h5>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-label-md text-on-primary/60 hover:text-on-primary transition-colors">About Us</Link>
              {["Safety Guidelines", "Contact Support"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-label-md text-on-primary/60 hover:text-on-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h5 className="text-label-md font-semibold text-on-primary mb-4">Legal</h5>
            <nav className="flex flex-col gap-3">
              {["Privacy Policy", "Terms of Service"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-label-md text-on-primary/60 hover:text-on-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-container-max mx-auto px-gutter py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-caption text-on-primary/50">
            <p>© 2024 LostFoundPK. All rights reserved.</p>
            <p>Made for Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>

      {/* Mobile nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant px-2 py-2 safe-area-pb">
        <div className="flex justify-around items-center">
          {[
            { icon: "home", label: "Home", active: true, path: "/" },
            { icon: "search", label: "Search", active: false, path: "/browse" },
            { icon: "add_circle", label: "Report", active: false, path: "/report" }, // Yahan bhi path theek kiya hai
            { icon: "person", label: "Profile", active: false, path: "/dashboard" },
          ].map((item) => (
            <Link key={item.label} to={item.path} className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${ item.active ? "text-primary bg-primary/8" : "text-on-surface-variant hover:text-primary" }`}>
              <MaterialIcon name={item.icon} className="text-xl" />
              <span className="text-caption font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}