import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function MaterialIcon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | sent

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setStatus('submitting');
    // TODO: replace with real API call
    setTimeout(() => setStatus('sent'), 1000);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Brand Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 group justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <MaterialIcon name="account_balance" className="text-white text-2xl" />
          </div>
          <div className="text-left">
            <p className="text-xl font-bold text-primary leading-none">LostFoundPK</p>
            <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase mt-1">Recovery Network</p>
          </div>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest border border-outline-variant py-8 px-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] rounded-3xl sm:px-10">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                <MaterialIcon name="mark_email_read" className="text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-2">Check your inbox</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                If an account exists for <span className="font-semibold text-on-surface">{email}</span>,
                we've sent a link to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
              >
                <MaterialIcon name="arrow_back" className="text-lg" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-on-surface tracking-tight">Reset password</h2>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {error && (
                  <div className="p-3.5 bg-[#ffdad6] text-[#93000a] rounded-xl flex items-center gap-2.5 text-sm font-medium">
                    <MaterialIcon name="error" className="text-lg" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MaterialIcon name="mail" className="text-outline text-lg" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                      placeholder="ali@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 focus:border-[#10B981] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#0da271] active:bg-[#0b8f63] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <MaterialIcon name="arrow_forward" className="text-lg" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm">
                <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">
                  ← Back to Login
                </Link>
              </p>
            </>
          )}
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
          <MaterialIcon name="lock" className="text-primary text-base" />
          <span>Secure reset flow powered by modern encryption.</span>
        </div>
      </div>
    </div>
  );
}
