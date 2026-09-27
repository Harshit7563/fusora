import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SITE_DOMAIN, SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'
import { FusoraLogo } from '../components/FusoraLogo'
import { useStore } from '../context/StoreContext'

type Mode = 'signin' | 'register'

type OtpState = {
  sessionId: string | null
  sent: boolean
  verified: boolean
  otp: string
  busy: 'idle' | 'send' | 'verify'
  message: string | null
  error: boolean
}

const emptyOtp: OtpState = {
  sessionId: null,
  sent: false,
  verified: false,
  otp: '',
  busy: 'idle',
  message: null,
  error: false,
}

export function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode: Mode = location.pathname === '/register' ? 'register' : 'signin'
  const search = new URLSearchParams(location.search)
  const nextPath = search.get('next') || '/deals'
  const {
    locationLabel,
    openLocationModal,
    registerAccount,
    signIn,
    signOut,
    user,
    isLoggedIn,
  } = useStore()

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [otpState, setOtpState] = useState<OtpState>(emptyOtp)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    remember: true,
    terms: false,
  })

  const setMode = (next: Mode) => {
    setDone(null)
    setOtpState(emptyOtp)
    const q = search.toString() ? `?${search.toString()}` : ''
    navigate(next === 'register' ? `/register${q}` : `/account${q}`)
  }

  const goAfterAuth = () => {
    const target =
      nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/deals'
    navigate(target, { replace: true })
  }

  const sendOtp = async () => {
    setDone(null)
    setOtpState((s) => ({
      ...s,
      busy: 'send',
      message: null,
      error: false,
      verified: false,
    }))
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        sessionId?: string
        message?: string
      }
      if (!res.ok || !data.ok || !data.sessionId) {
        setOtpState((s) => ({
          ...s,
          busy: 'idle',
          sent: false,
          sessionId: null,
          message: data.message || 'Could not send OTP',
          error: true,
        }))
        return
      }
      setOtpState({
        sessionId: data.sessionId,
        sent: true,
        verified: false,
        otp: '',
        busy: 'idle',
        message: data.message || 'OTP sent',
        error: false,
      })
    } catch {
      setOtpState((s) => ({
        ...s,
        busy: 'idle',
        message: 'Network error while sending OTP',
        error: true,
      }))
    }
  }

  const verifyOtp = async () => {
    setDone(null)
    setOtpState((s) => ({ ...s, busy: 'verify', message: null, error: false }))
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          otp: otpState.otp,
          sessionId: otpState.sessionId,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string }
      if (!res.ok || !data.ok) {
        setOtpState((s) => ({
          ...s,
          busy: 'idle',
          verified: false,
          message: data.message || 'OTP verification failed',
          error: true,
        }))
        return
      }
      setOtpState((s) => ({
        ...s,
        busy: 'idle',
        verified: true,
        message: data.message || 'Mobile verified',
        error: false,
      }))
    } catch {
      setOtpState((s) => ({
        ...s,
        busy: 'idle',
        message: 'Network error while verifying OTP',
        error: true,
      }))
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'register') {
      if (!otpState.verified) {
        setDone('Please verify your mobile number with OTP first.')
        return
      }
      if (form.password !== form.confirm) {
        setDone('Passwords do not match.')
        return
      }
      if (!form.terms) {
        setDone('Please accept Terms & Privacy to continue.')
        return
      }
      const result = registerAccount({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      if (!result.ok) {
        setDone(result.message)
        return
      }
      setDone(
        `Welcome to Fusora, ${form.name.split(' ')[0] || 'member'}! Account created.`,
      )
      window.setTimeout(goAfterAuth, 600)
      return
    }
    const result = signIn({
      email: form.email,
      password: form.password,
    })
    if (!result.ok) {
      setDone(result.message)
      return
    }
    setDone(`Signed in as ${form.email || 'member'}. Welcome back!`)
    window.setTimeout(goAfterAuth, 600)
  }

  const field =
    'mt-1.5 w-full rounded-xl border border-bb-border bg-white px-3.5 py-3 text-sm font-normal outline-none transition focus:border-bb-blue focus:ring-2 focus:ring-bb-blue/20'

  const isErrorBanner = (msg: string) =>
    msg.includes('match') ||
    msg.includes('accept') ||
    msg.includes('verify') ||
    msg.includes('OTP') ||
    msg.includes('failed') ||
    msg.includes('error') ||
    msg.includes('Could not') ||
    msg.includes('Incorrect') ||
    msg.includes('No account') ||
    msg.includes('already exists')

  return (
    <main className="min-h-[calc(100svh-8rem)] bg-bb-gray/50">
      <div className="mx-auto grid max-w-[1100px] lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-bb-blue px-10 py-14 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,242,0,0.2),transparent_55%)]" />
          <div className="relative">
            <FusoraLogo onDark />
            <h1 className="mt-10 max-w-sm text-3xl font-bold tracking-tight xl:text-4xl">
              {mode === 'signin'
                ? 'Welcome back to Fusora'
                : 'Create your Fusora account'}
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Track orders, save wishlists, unlock member deals, and get priority
              pickup at your local hub — all on {SITE_DOMAIN}.
            </p>
          </div>
          <ul className="relative mt-10 space-y-3 text-sm text-white/85">
            {[
              'Order tracking & easy returns',
              'Wishlist across devices',
              'Fusora Membership benefits',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-bb-yellow" />
                {item}
              </li>
            ))}
          </ul>
          <p className="relative mt-12 text-xs text-white/55">
            Need help?{' '}
            <a href={SUPPORT_MAILTO} className="underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>

        <section className="flex items-center px-4 py-10 sm:px-8 lg:py-14">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="mb-6 lg:hidden">
              <FusoraLogo />
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-full bg-bb-gray p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`rounded-full py-2.5 text-sm font-bold transition ${
                  mode === 'signin'
                    ? 'bg-white text-bb-blue shadow-sm'
                    : 'text-bb-muted hover:text-bb-text'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-full py-2.5 text-sm font-bold transition ${
                  mode === 'register'
                    ? 'bg-white text-bb-blue shadow-sm'
                    : 'text-bb-muted hover:text-bb-text'
                }`}
              >
                Create account
              </button>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-bb-text">
              {mode === 'signin' ? 'Sign in' : 'Create an account'}
            </h2>
            <p className="mt-1 text-sm text-bb-muted">
              {mode === 'signin'
                ? 'Enter your details to continue shopping.'
                : 'Verify mobile via Zone Digital OTP, then join fusora.shop.'}
            </p>

            {isLoggedIn && user && (
              <div className="mt-5 rounded-2xl border border-bb-border bg-fusora-ivory px-4 py-4">
                <p className="text-sm font-semibold text-bb-text">
                  Signed in as {user.name}
                </p>
                <p className="mt-1 text-xs text-bb-muted">
                  {user.email} · {user.phone}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={nextPath.startsWith('/') ? nextPath : '/checkout'}
                    className="rounded-full bg-bb-blue px-4 py-2 text-[0.65rem] font-semibold tracking-[0.14em] text-[#f7f3ec] uppercase"
                  >
                    Continue
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      setDone(null)
                    }}
                    className="rounded-full border border-bb-border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.14em] uppercase"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              {mode === 'register' && (
                <label className="block text-sm font-semibold text-bb-text">
                  Full name
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bb-muted" />
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className={`${field} pl-10`}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                </label>
              )}

              <label className="block text-sm font-semibold text-bb-text">
                Email
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bb-muted" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className={`${field} pl-10`}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              {mode === 'register' && (
                <div className="space-y-3">
                  <p className="rounded-xl border border-bb-border bg-fusora-ivory px-3 py-2 text-[0.7rem] tracking-wide text-bb-muted uppercase">
                    Mobile OTP · Zone Digital SMS
                  </p>
                  <label className="block text-sm font-semibold text-bb-text">
                    Mobile number
                    <div className="mt-1.5 flex gap-2">
                      <div className="relative min-w-0 flex-1">
                        <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bb-muted" />
                        <input
                          type="tel"
                          required
                          disabled={otpState.verified}
                          value={form.phone}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, phone: e.target.value }))
                            setOtpState(emptyOtp)
                          }}
                          className={`${field} mt-0 pl-10 disabled:bg-bb-gray/60`}
                          placeholder="10-digit mobile"
                          autoComplete="tel"
                          inputMode="numeric"
                        />
                      </div>
                      {!otpState.verified && (
                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={otpState.busy !== 'idle' || !form.phone.trim()}
                          className="shrink-0 rounded-xl bg-bb-blue px-3.5 text-sm font-bold whitespace-nowrap text-white hover:bg-bb-blue-dark disabled:opacity-60"
                        >
                          {otpState.busy === 'send' ? (
                            <Loader2 className="mx-auto size-4 animate-spin" />
                          ) : otpState.sent ? (
                            'Resend'
                          ) : (
                            'Send OTP'
                          )}
                        </button>
                      )}
                      {otpState.verified && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-green-50 px-3 text-xs font-bold text-green-700">
                          <CheckCircle2 className="size-4" />
                          Verified
                        </span>
                      )}
                    </div>
                  </label>

                  {otpState.sent && !otpState.verified && (
                    <label className="block text-sm font-semibold text-bb-text">
                      Enter OTP
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpState.otp}
                          onChange={(e) =>
                            setOtpState((s) => ({
                              ...s,
                              otp: e.target.value.replace(/\D/g, '').slice(0, 6),
                            }))
                          }
                          className={`${field} mt-0 tracking-[0.35em]`}
                          placeholder="••••"
                          autoComplete="one-time-code"
                        />
                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={
                            otpState.busy !== 'idle' || otpState.otp.length < 4
                          }
                          className="shrink-0 rounded-xl border border-bb-blue bg-white px-3.5 text-sm font-bold whitespace-nowrap text-bb-blue hover:bg-bb-blue/5 disabled:opacity-60"
                        >
                          {otpState.busy === 'verify' ? (
                            <Loader2 className="mx-auto size-4 animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                    </label>
                  )}

                  {otpState.message && (
                    <p
                      className={`rounded-xl px-3 py-2 text-xs font-medium ${
                        otpState.error
                          ? 'bg-red-50 text-bb-save'
                          : 'bg-green-50 text-green-800'
                      }`}
                    >
                      {otpState.message}
                    </p>
                  )}
                </div>
              )}

              <label className="block text-sm font-semibold text-bb-text">
                Password
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bb-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    className={`${field} pr-11 pl-10`}
                    placeholder="••••••••"
                    autoComplete={
                      mode === 'signin' ? 'current-password' : 'new-password'
                    }
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-bb-muted hover:text-bb-text"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </label>

              {mode === 'register' && (
                <label className="block text-sm font-semibold text-bb-text">
                  Confirm password
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bb-muted" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.confirm}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, confirm: e.target.value }))
                      }
                      className={`${field} pr-11 pl-10`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-bb-muted hover:text-bb-text"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={
                        showConfirm ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </label>
              )}

              {mode === 'signin' ? (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 font-medium text-bb-text">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, remember: e.target.checked }))
                      }
                      className="size-4 rounded border-bb-border accent-bb-blue"
                    />
                    Keep me signed in
                  </label>
                  <button
                    type="button"
                    className="font-semibold text-bb-link hover:underline"
                    onClick={() =>
                      setDone(
                        `Password reset link will be sent to ${SUPPORT_EMAIL}`,
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <label className="flex items-start gap-2 text-sm text-bb-muted">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, terms: e.target.checked }))
                    }
                    className="mt-0.5 size-4 rounded border-bb-border accent-bb-blue"
                  />
                  <span>
                    I agree to Fusora{' '}
                    <Link
                      to="/policies/terms-and-conditions"
                      className="font-semibold text-bb-link"
                    >
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link
                      to="/policies/privacy-policy"
                      className="font-semibold text-bb-link"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              )}

              {done && (
                <p
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isErrorBanner(done)
                      ? 'bg-red-50 text-bb-save'
                      : 'bg-green-50 text-green-800'
                  }`}
                >
                  {done}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-bb-blue py-3.5 text-sm font-bold text-white hover:bg-bb-blue-dark"
              >
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-bb-muted">
              <span className="h-px flex-1 bg-bb-border" />
              or
              <span className="h-px flex-1 bg-bb-border" />
            </div>

            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="w-full rounded-full border border-bb-border bg-white py-3 text-sm font-bold text-bb-text hover:bg-bb-gray"
            >
              {mode === 'signin'
                ? 'New here? Create an account'
                : 'Already have an account? Sign in'}
            </button>

            <div className="mt-6 space-y-3 rounded-2xl border border-bb-border bg-white p-4 text-sm">
              <button
                type="button"
                onClick={openLocationModal}
                className="flex w-full items-center gap-2 text-left"
              >
                <MapPin className="size-4 shrink-0 text-bb-blue" />
                <span>
                  Preferred store:{' '}
                  <span className="font-semibold text-bb-link">
                    {locationLabel}
                  </span>
                </span>
              </button>
              <Link
                to="/memberships"
                className="block font-semibold text-bb-link hover:underline"
              >
                Explore Fusora Membership — ₹1,095/year
              </Link>
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="block text-bb-muted hover:text-bb-link"
              >
                Need help? Contact {SUPPORT_EMAIL}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
