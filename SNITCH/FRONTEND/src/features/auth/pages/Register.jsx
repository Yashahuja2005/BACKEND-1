import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth.js'

export default function Register() {
  const { handleRegister } = useAuth()
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    // Client-side validations
    if (!formData.fullname.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }
    if (!formData.contact.trim()) {
      setErrorMessage('Please provide a contact number.')
      return
    }
    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    try {
      setIsLoading(true)
      await handleRegister({
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        password: formData.password,
        isSeller: formData.isSeller,
      })
      setSuccessMessage('Registration successful! Welcome to the SNITCH collective.')
      navigate("/");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to complete registration. Please check your details and try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#e3e2e3] relative flex flex-col justify-between overflow-x-hidden selection:bg-[#f59e0b] selection:text-[#0c0d0e]">
      {/* Ambient Luxury Background Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none custom-aura z-0" aria-hidden="true" />
      <div
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-[#f59e0b]/5 rounded-full blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Minimalist Top Bar Header */}
      <header className="relative z-10 w-full border-b border-[#262a30]/50 bg-[#121314]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-heading text-xl md:text-2xl font-bold tracking-[0.25em] text-[#ffc174] uppercase transition-all duration-200 group-hover:text-[#f59e0b]">
              SNITCH
            </span>
            <span className="text-[10px] tracking-[0.22em] text-[#a08e7a] border border-[#534434]/50 px-2 py-0.5 rounded uppercase">
              Atelier
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#a08e7a] hidden sm:inline">Already registered?</span>
            <Link
              to="/login"
              className="text-[#ffc174] hover:text-[#f59e0b] font-medium transition-colors duration-180 border-b border-[#f59e0b]/40 hover:border-[#f59e0b] pb-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Canvas with Ample Breathing Space */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-16 md:py-24 px-4 sm:px-6">
        <div className="w-full max-w-[540px] mx-auto">
          {/* Elevated Matte Glass Luxury Card */}
          <div className="relative bg-[#141619]/90 backdrop-blur-xl border border-[#262a30] rounded-xl p-8 sm:p-12 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),0_0_30px_0_rgba(245,158,11,0.04)] transition-all duration-300 hover:border-[#f59e0b]/30">
            {/* Subtle Top Gold Accent Rim Reflection */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent" />

            {/* Header Block Inside Card */}
            <div className="text-center mb-8">
              {/* Micro-badge / Atelier Privé Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#ffc174]">
                  Privé Collective
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#f3f4f6] tracking-tight mb-2">
                Create your account
              </h1>
              <p className="text-sm text-[#9ca3af] max-w-sm mx-auto leading-relaxed">
                Join our private collective and explore curated luxury fashion &amp; commerce.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start gap-2.5 animate-fadeIn"
              >
                <span className="material-symbols-outlined text-[18px] text-red-400 mt-0.5">
                  error
                </span>
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div
                role="status"
                className="mb-6 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-2.5 animate-fadeIn"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400 mt-0.5">
                  check_circle
                </span>
                <span className="flex-1">{successMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullname"
                  className="block text-xs font-medium tracking-wide uppercase text-[#d8c3ad]"
                >
                  Full Name
                </label>
                <div className="relative flex items-center rounded-lg bg-[#0d0e0f] border border-[#262a30] transition-all duration-200 amber-focus-glow">
                  <span className="absolute left-3.5 text-[#a08e7a] pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </span>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-[#f3f4f6] placeholder-[#534434] border-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium tracking-wide uppercase text-[#d8c3ad]"
                >
                  Email Address
                </label>
                <div className="relative flex items-center rounded-lg bg-[#0d0e0f] border border-[#262a30] transition-all duration-200 amber-focus-glow">
                  <span className="absolute left-3.5 text-[#a08e7a] pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-[#f3f4f6] placeholder-[#534434] border-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Number Field with +91 indicator */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact"
                  className="block text-xs font-medium tracking-wide uppercase text-[#d8c3ad]"
                >
                  Contact Number
                </label>
                <div className="relative flex items-center rounded-lg bg-[#0d0e0f] border border-[#262a30] transition-all duration-200 amber-focus-glow">
                  <div className="pl-3.5 pr-2.5 flex items-center gap-1.5 text-[#d8c3ad] text-xs border-r border-[#262a30] select-none">
                    <span className="material-symbols-outlined text-[17px] text-[#a08e7a]">call</span>
                    <span className="tracking-wider font-medium">+91</span>
                  </div>
                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className="w-full bg-transparent pl-3 pr-4 py-3 text-sm text-[#f3f4f6] placeholder-[#534434] border-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field with Visibility Toggle & Security Hint */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium tracking-wide uppercase text-[#d8c3ad]"
                  >
                    Password
                  </label>
                  <span className="text-[11px] font-medium tracking-wider text-[#a08e7a]">
                    MIN. 8 CHARS
                  </span>
                </div>
                <div className="relative flex items-center rounded-lg bg-[#0d0e0f] border border-[#262a30] transition-all duration-200 amber-focus-glow">
                  <span className="absolute left-3.5 text-[#a08e7a] pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    className="w-full bg-transparent pl-11 pr-11 py-3 text-sm text-[#f3f4f6] placeholder-[#534434] border-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 p-1 text-[#a08e7a] hover:text-[#ffc174] transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Seller Flag Selection (isSeller Checkbox) */}
              <div className="pt-2">
                <label
                  htmlFor="isSeller"
                  className={`group relative flex items-start gap-3.5 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${formData.isSeller
                    ? 'bg-[#1f2021] border-[#f59e0b]/50 shadow-[0_0_16px_rgba(245,158,11,0.08)]'
                    : 'bg-[#1b1c1d]/60 hover:bg-[#1f2021] border-[#262a30] hover:border-[#f59e0b]/30'
                    }`}
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="isSeller"
                      name="isSeller"
                      type="checkbox"
                      checked={formData.isSeller}
                      onChange={handleChange}
                      className="w-4 h-4 rounded bg-[#0d0e0f] border-[#534434] text-[#f59e0b] accent-[#f59e0b] focus:ring-[#f59e0b]/30 focus:ring-offset-0 cursor-pointer transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[#f3f4f6] group-hover:text-[#ffc174] transition-colors">
                        Register as a Seller
                      </span>
                      <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-[#ffc174] rounded font-semibold">
                        Artisan Partner
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#9ca3af] leading-relaxed">
                      Unlock exclusive atelier storefront access, global marketplace distribution, and privileged artisan analytics.
                    </p>
                  </div>
                </label>
              </div>

              {/* Primary Submit CTA Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold-glow w-full py-3.5 px-6 rounded-lg bg-[#f59e0b] hover:bg-[#eab308] active:bg-[#d97706] text-[#0c0d0e] font-heading font-semibold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(245,158,11,0.25)]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-[#0c0d0e]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Form Footer Subtext & Links */}
            <div className="mt-8 pt-6 border-t border-[#262a30]/60 text-center space-y-3">
              <p className="text-xs text-[#9ca3af]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#ffc174] hover:text-[#f59e0b] font-medium transition-colors ml-1 inline-flex items-center gap-0.5"
                >
                  <span>Sign in</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </p>
              <p className="text-[11px] text-[#a08e7a] leading-relaxed max-w-xs mx-auto">
                By continuing, you agree to SNITCH Terms of Privilege &amp; Privacy Policy.
              </p>
            </div>
          </div>

          {/* Trust Badges & Discreet Assurances */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[#a08e7a] text-xs uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">
                verified_user
              </span>
              <span>End-to-End Encrypted</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#534434]" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">
                workspace_premium
              </span>
              <span>Curated Membership</span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimalist Brand Footer */}
      <footer className="relative z-10 w-full bg-[#0c0d0e] border-t border-[#262a30]/50">
        <div className="w-full px-6 md:px-12 py-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#a08e7a]">
          <span className="font-heading font-medium tracking-[0.25em] text-[#ffc174] uppercase">
            SNITCH
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#prive" className="hover:text-[#f59e0b] transition-colors">Privé Access</a>
            <a href="#services" className="hover:text-[#f59e0b] transition-colors">Client Services</a>
            <a href="#privacy" className="hover:text-[#f59e0b] transition-colors">Legal &amp; Privacy</a>
            <a href="#seller" className="hover:text-[#f59e0b] transition-colors">Seller Portal</a>
          </div>
          <p className="text-[11px] text-[#534434]">
            &copy; 2025 SNITCH ATELIER. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}