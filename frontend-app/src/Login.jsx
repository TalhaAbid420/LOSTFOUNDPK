import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Icons ke liye MaterialIcon component
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

export default function Login() {
  const navigate = useNavigate(); // Page change karne ke liye
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dummy Login Function
  const handleLogin = (e) => {
    e.preventDefault(); // Page ko reload hone se roke ga
    setError('');

    // Agar dono fields mein kuch likha hai, toh login success
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    // TODO: replace with real API call
    setTimeout(() => {
      setSubmitting(false);
      navigate('/'); // Yahan tum '/' ki jagah '/report' bhi likh sakti ho agar direct report page par jana hai
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 group justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <MaterialIcon name="account_balance" className="text-on-primary text-2xl" />
          </div>
          <div className="text-left">
            <p className="text-xl font-bold text-primary leading-none">LostFoundPK</p>
            <p className="text-caption text-on-surface-variant font-medium tracking-wide uppercase mt-1">Recovery Network</p>
          </div>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest border border-outline-variant py-8 px-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] rounded-3xl sm:px-10">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Welcome back</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Sign in to your account to manage your reports.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3.5 bg-[#ffdad6] text-[#93000a] rounded-xl flex items-center gap-2.5 text-sm font-medium">
                <MaterialIcon name="error" className="text-lg" />
                {error}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-label-md font-semibold text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MaterialIcon name="mail" className="text-outline text-lg" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 bg-surface border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="ali@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-label-md font-semibold text-on-surface mb-2">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MaterialIcon name="lock" className="text-outline text-lg" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 bg-surface border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary/20 border-outline-variant rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-label-md text-on-surface-variant">
                  Remember me
                </label>
              </div>

              <div className="text-label-md">
                <Link to="/forgot-password" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-label-md font-semibold text-white bg-[#10B981] hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <MaterialIcon name="login" className="text-lg" />
                  </>
                )}
              </button>
            </div>
            
            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-label-md text-on-surface-variant">
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
            
          </form>
        </div>
        
        {/* Trust Badge */}
        <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-caption text-on-surface-variant">
          <MaterialIcon name="lock" className="text-primary text-base" />
          <span>Secure login powered by modern encryption.</span>
        </div>
      </div>
    </div>
  );
}