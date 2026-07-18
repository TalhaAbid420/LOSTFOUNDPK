import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function MaterialIcon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function getPasswordStrength(password) {
  if (!password) return { label: "", width: "w-0", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak", width: "w-1/4", color: "bg-red-500" },
    { label: "Fair", width: "w-2/4", color: "bg-amber-500" },
    { label: "Good", width: "w-3/4", color: "bg-[#10B981]/70" },
    { label: "Strong", width: "w-full", color: "bg-[#10B981]" },
  ];
  return levels[Math.max(score - 1, 0)];
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (errors.api) setErrors((prev) => ({ ...prev, api: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (!agreed) next.agreed = "Please accept the Terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      // Backend expects: { name, email, password }
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 409 = duplicate email | 422 = validation error from Pydantic
        const msg =
          typeof data.detail === 'string'
            ? data.detail
            : Array.isArray(data.detail)
            ? data.detail.map((d) => d.msg).join(', ')
            : 'Signup failed. Please try again.';
        setErrors({ api: msg });
        return;
      }

      // Account created successfully — redirect to login
      navigate('/login', { state: { registered: true } });
    } catch {
      setErrors({ api: 'Network error — is the backend running?' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface flex">
      {/* Left panel — brand / visual (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B2A3D] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_55%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-sm">
              <MaterialIcon name="account_balance" className="text-white text-xl" />
            </div>
            <span className="text-lg font-bold text-white">LostFoundPK</span>
          </a>

          <div className="max-w-md space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Reuniting Pakistan, one item at a time.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Join a nationwide community helping people recover lost belongings safely and
              quickly.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div>
                <p className="text-2xl font-bold text-white">12,450+</p>
                <p className="text-sm text-white/60">Items Reported</p>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div>
                <p className="text-2xl font-bold text-white">3,892</p>
                <p className="text-sm text-white/60">Reunited</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/50">© 2024 LostFoundPK. Made for Pakistan 🇵🇰</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <a href="#" className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-sm">
              <MaterialIcon name="account_balance" className="text-white text-xl" />
            </div>
            <span className="text-lg font-bold text-on-surface">LostFoundPK</span>
          </a>

          <div className="mb-8">
  <h2 className="text-3xl font-bold text-on-surface tracking-tight">
    Create your account
  </h2>
  <p className="mt-2 text-on-surface-variant">
    Already have an account?{" "}
    <Link to="/login" className="font-semibold text-[#10B981] hover:text-[#0da271]">
      Log in
    </Link>
  </p>
</div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* API / network error banner */}
            {errors.api && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2.5 text-sm font-medium">
                <MaterialIcon name="error" className="text-lg text-red-500" />
                {errors.api}
              </div>
            )}
            {/* Full Name */}

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-on-surface mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <MaterialIcon
                  name="person"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="e.g. Ayesha Khan"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-lowest border text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 transition-colors ${
                    errors.fullName
                      ? "border-red-400 focus:border-red-400"
                      : "border-outline-variant focus:border-[#10B981]"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <MaterialIcon
                  name="mail"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-lowest border text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 transition-colors ${
                    errors.email
                      ? "border-red-400 focus:border-red-400"
                      : "border-outline-variant focus:border-[#10B981]"
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-on-surface mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <MaterialIcon
                  name="lock"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="At least 8 characters"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-lowest border text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 transition-colors ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-outline-variant focus:border-[#10B981]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <MaterialIcon
                    name={showPassword ? "visibility_off" : "visibility"}
                    className="text-[20px]"
                  />
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant">{strength.label}</p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => {
                    setAgreed((prev) => !prev);
                    if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]/40 accent-[#10B981]"
                />
             <span className="text-sm text-on-surface-variant">
  I agree to the{" "}
  <Link to="/TermsOfService" className="font-medium text-[#10B981] hover:text-[#0da271]">
    Terms of Service
  </Link>{" "}
  and{" "}
  <Link to="/Legal" className="font-medium text-[#10B981] hover:text-[#0da271]">
    Privacy Policy
  </Link>
  .
</span>
              </label>
              {errors.agreed && <p className="mt-1.5 text-sm text-red-500">{errors.agreed}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#0da271] active:bg-[#0b8f63] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Account…
                </>
              ) : (
                <>
                  Create Account
                  <MaterialIcon name="arrow_forward" className="text-[20px]" />
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}