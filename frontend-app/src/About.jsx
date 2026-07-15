import React from 'react';
import { Link } from 'react-router-dom';

function MaterialIcon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const STATS = [
  { value: '12,450+', label: 'Items Reported', icon: 'inventory_2' },
  { value: '3,892', label: 'Successfully Reunited', icon: 'handshake' },
  { value: '24h', label: 'Average Response Time', icon: 'schedule' },
  { value: 'Nationwide', label: 'Coverage Across Pakistan', icon: 'public' },
];

const VALUES = [
  {
    icon: 'verified_user',
    title: 'Trust & Verification',
    description:
      'Every report is reviewed by our community moderation process to reduce fraud and keep listings genuine and reliable.',
  },
  {
    icon: 'lock',
    title: 'Privacy First',
    description:
      'We only ask for what is necessary to make a match. Personal details stay protected until both parties agree to connect.',
  },
  {
    icon: 'diversity_3',
    title: 'Community Powered',
    description:
      'LostFoundPK works because ordinary Pakistanis choose to help each other — every share, tip, and report matters.',
  },
  {
    icon: 'bolt',
    title: 'Fast & Accessible',
    description:
      'Report an item in under two minutes from any device, in any city — no fees, no paperwork, no hassle.',
  },
];

const STORY_STEPS = [
  {
    year: '2023',
    title: 'The Idea',
    description:
      'Born from a simple frustration — losing a wallet in Karachi with no reliable way to find it. We asked: what if there was one trusted place for the whole country?',
  },
  {
    year: '2023',
    title: 'First 1,000 Reports',
    description:
      'We launched quietly in three cities. Within weeks, word of mouth carried LostFoundPK to campuses, offices, and family group chats nationwide.',
  },
  {
    year: '2024',
    title: 'Going Nationwide',
    description:
      'Coverage expanded to every major city in Pakistan, with dedicated categories for documents, electronics, pets, and more.',
  },
  {
    year: 'Today',
    title: 'Thousands Reunited',
    description:
      'From CNICs to family pets, we have helped thousands of Pakistanis get back what matters most — and we are just getting started.',
  },
];

const TEAM = [
  { name: 'Hadeeba Javed', role: 'Founder & Lead Developer', avatar: 'https://ui-avatars.com/api/?name=Hadeeba+Javed&background=003747&color=fff&size=200' },
  { name: 'Talha Abid', role: 'Backend & Infrastructure', avatar: 'https://ui-avatars.com/api/?name=Talha+Abid&background=10B981&color=fff&size=200' },
  { name: 'Sundas Bibi', role: 'Community & Trust', avatar: 'https://ui-avatars.com/api/?name=Sundas+Bibi&background=F59E0B&color=fff&size=200' },
  { name: 'Arfa Amreen', role: 'Product Design', avatar: 'https://ui-avatars.com/api/?name=Arfa+Amreen&background=8B5CF6&color=fff&size=200' },
];

const FAQS = [
  {
    q: 'Is LostFoundPK free to use?',
    a: 'Yes, completely. Reporting a lost or found item, searching the registry, and messaging other users is free for everyone.',
  },
  {
    q: 'How do you verify reports are genuine?',
    a: 'Reports go through basic moderation checks, and users build a trust score over time based on their history of honest, successful returns.',
  },
  {
    q: 'What should I do if I found something valuable?',
    a: "Post a 'Found' report with a clear description and photo, then meet the claimant in a safe, public place. Never share sensitive personal details over chat.",
  },
  {
    q: 'Which cities does LostFoundPK cover?',
    a: 'We cover all major cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, and Quetta, with more areas added regularly.',
  },
];

export default function About() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
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
            <Link to="/report" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Report</Link>
            <Link to="/about" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">About</Link>
          </nav>
          <Link to="/dashboard" className="material-symbols-outlined text-on-surface-variant p-2" aria-label="Account">account_circle</Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero */}
        <section className="px-4 sm:px-8 pt-16 pb-14 lg:pt-24 lg:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,55,71,0.06),transparent_55%)]" />
          <div className="max-w-container-max mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-6">
              <MaterialIcon name="favorite" className="text-[18px]" />
              Our Story
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.1] tracking-tight mb-6">
              Built by Pakistanis,<br />for Pakistanis
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              LostFoundPK is a civic-tech platform on a simple mission — to reunite people with the
              belongings, documents, and pets they've lost, using the power of community.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-outline-variant bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-4 sm:px-8 py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center">
                    <MaterialIcon name={stat.icon} className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">{stat.value}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="px-4 sm:px-8 py-16 lg:py-20">
          <div className="max-w-container-max mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight mb-5">
                Nobody should lose hope over a lost item.
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                Every year, thousands of Pakistanis lose CNICs, wallets, phones, and even pets — often
                with no clear way to get them back. LostFoundPK exists to close that gap, connecting
                people who've lost something with people who've found it, safely and quickly.
              </p>
              <p className="text-base text-on-surface-variant leading-relaxed">
                We believe recovery shouldn't depend on luck. It should depend on a community that
                looks out for one another — and the right tools to make that easy.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-5">
                {[
                  { icon: 'edit_note', text: 'Report a lost or found item in under 2 minutes' },
                  { icon: 'auto_awesome', text: 'Smart matching by category, city, and keywords' },
                  { icon: 'chat', text: 'Message safely through the platform, no numbers shared' },
                  { icon: 'celebration', text: 'Coordinate a safe, verified handover' },
                ].map((row) => (
                  <div key={row.text} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                      <MaterialIcon name={row.icon} className="text-xl" />
                    </div>
                    <p className="text-sm font-medium text-on-surface">{row.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 sm:px-8 py-16 lg:py-20 bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">What We Stand For</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">Our core values</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:border-primary/25 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                    <MaterialIcon name={value.icon} className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-on-surface mb-2">{value.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-4 sm:px-8 py-16 lg:py-20">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">Our Journey</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">From idea to nationwide network</h2>
            </div>
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-outline-variant" />
              <div className="space-y-10">
                {STORY_STEPS.map((step) => (
                  <div key={step.title} className="relative pl-14">
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {step.year.slice(0, 2)}
                    </div>
                    <p className="text-xs font-bold text-primary/60 tracking-widest mb-1">{step.year.toUpperCase()}</p>
                    <h3 className="text-lg font-semibold text-on-surface mb-1.5">{step.title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-4 sm:px-8 py-16 lg:py-20 bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">The People Behind It</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">Meet the team</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {TEAM.map((member) => (
                <div key={member.name} className="text-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-surface-container-lowest shadow-sm"
                  />
                  <h4 className="text-base font-semibold text-on-surface">{member.name}</h4>
                  <p className="text-sm text-on-surface-variant">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-8 py-16 lg:py-20">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">Questions</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary tracking-tight">Frequently asked questions</h2>
            </div>
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
              {FAQS.map((faq) => (
                <div key={faq.q} className="p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest">
                  <h4 className="text-sm font-semibold text-on-surface mb-2 flex items-start gap-2">
                    <MaterialIcon name="help" className="text-primary text-[20px] shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-8 pb-16 lg:pb-24">
          <div className="max-w-container-max mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 lg:px-16 lg:py-16 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Ready to be part of the network?
                </h2>
                <p className="text-lg text-white/80">
                  Whether you've lost something or found something — your next step could reunite
                  someone with what matters most.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    to="/report"
                    className="px-8 py-3.5 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-surface-container-lowest transition-colors shadow-sm"
                  >
                    Report an Item
                  </Link>
                  <Link
                    to="/browse"
                    className="px-8 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
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
      <footer className="bg-[#0B2A3D] text-white/70">
        <div className="max-w-container-max mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <MaterialIcon name="account_balance" className="text-white text-xl" />
              </div>
              <span className="text-lg font-bold text-white">LostFoundPK</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-white/60">
              Serving Pakistan with integrity. Leveraging technology to bring honesty and relief back
              to communities nationwide.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-white mb-4">Company</h5>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-white/60 hover:text-white transition-colors">About Us</Link>
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Safety Guidelines</a>
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact Support</a>
            </nav>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-white mb-4">Legal</h5>
            <nav className="flex flex-col gap-3">
              <Link to="/Legal" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/TermsOfService" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-container-max mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
            <p>© 2024 LostFoundPK. All rights reserved.</p>
            <p>Made for Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>

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
