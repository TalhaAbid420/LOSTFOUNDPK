import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function MaterialIcon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const LAST_UPDATED = 'July 1, 2024';

export default function Legal({ title, content }) {
  const contentRef = useRef(null);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  const isPrivacy = title.toLowerCase().includes('privacy');

  // Auto-build a table of contents from the h3 headings inside `content`
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll('h3');
    const list = [];
    headings.forEach((heading, idx) => {
      const id = `section-${idx}`;
      heading.id = id;
      list.push({ id, text: heading.textContent });
    });
    setSections(list);
    if (list.length) setActiveSection(list[0].id);
  }, [content]);

  useEffect(() => {
    if (!sections.length) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = sections[0].id;
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollPos) current = s.id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans flex flex-col">
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
            <Link to="/about" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </nav>
          <Link to="/dashboard" className="material-symbols-outlined text-on-surface-variant p-2" aria-label="Account">account_circle</Link>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-4 sm:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <MaterialIcon name="chevron_right" className="text-[16px]" />
          <span className="text-on-surface font-medium">{title}</span>
        </div>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-8 border-b border-outline-variant">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isPrivacy ? 'bg-emerald-50 text-emerald-700' : 'bg-primary/8 text-primary'}`}>
              <MaterialIcon name={isPrivacy ? 'shield' : 'gavel'} className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">{title}</h1>
              <p className="text-sm text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                <MaterialIcon name="update" className="text-[16px]" />
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-sm font-medium text-on-surface-variant hover:border-primary hover:text-primary transition-colors self-start shrink-0"
          >
            <MaterialIcon name="print" className="text-[18px]" />
            Print / Save PDF
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          {sections.length > 0 && (
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3 px-2">
                  On this page
                </p>
                <nav className="space-y-1 border-l-2 border-outline-variant">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left pl-4 pr-3 py-2 text-sm border-l-2 -ml-[2px] transition-colors ${
                        activeSection === section.id
                          ? 'border-primary text-primary font-semibold'
                          : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'
                      }`}
                    >
                      {section.text}
                    </button>
                  ))}
                </nav>

                <div className="mt-8 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <MaterialIcon name="support_agent" className="text-[20px]" />
                    <p className="text-sm font-semibold">Need help?</p>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                    Have questions about this policy? Our support team is happy to walk you through it.
                  </p>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">
                    Contact Support →
                  </a>
                </div>
              </div>
            </aside>
          )}

          {/* Content */}
          <div className={sections.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4 max-w-3xl'}>
            <div className="mb-8 p-5 rounded-xl bg-primary/5 border border-primary/15 flex gap-3">
              <MaterialIcon name="info" className="text-primary text-xl shrink-0" />
              <p className="text-sm text-on-surface leading-relaxed">
                This {isPrivacy ? 'policy explains how LostFoundPK collects, uses, and protects your information' : 'page explains the rules for using LostFoundPK'}.
                By using our platform, you agree to the terms outlined below.
              </p>
            </div>

            <div
              ref={contentRef}
              className="text-on-surface-variant leading-relaxed
                [&_h3]:text-on-surface [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:pt-1
                [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:scroll-mt-24
                [&_p]:mb-4 [&_p]:text-base"
            >
              {content}
            </div>

            <div className="mt-12 pt-8 border-t border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-on-surface-variant">
                Questions about this {isPrivacy ? 'policy' : 'agreement'}? We're here to help.
              </p>
              <div className="flex gap-3 shrink-0">
                <Link
                  to={isPrivacy ? '/TermsOfService' : '/Legal'}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-medium text-on-surface hover:border-primary hover:text-primary transition-colors"
                >
                  {isPrivacy ? 'View Terms of Service' : 'View Privacy Policy'}
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
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
            <Link to="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">About Us</Link>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</a>
            <Link to="/Legal" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/TermsOfService" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
