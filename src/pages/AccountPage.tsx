import {
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SITE_DOMAIN, SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'
import { FusoraLogo } from '../components/FusoraLogo'
import { GoogleSignInButton } from '../components/GoogleSignInButton'
import {
  ORDER_STATUS_LABEL,
  useStore,
} from '../context/StoreContext'
import { formatMoney } from '../data'
import { usePageTitle } from '../hooks/usePageTitle'

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

function AccountDashboard() {
  usePageTitle('My account')
  const navigate = useNavigate()
  const {
    user,
    signOut,
    orders,
    locationLabel,
    openLocationModal,
    wishlist,
    cartCount,
  } = useStore()

  const mine = orders.filter(
    (o) =>
      user && o.userEmail.toLowerCase() === user.email.toLowerCase(),
  )
  const latest = mine[0]

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-8 sm:py-10 lg:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.28em] text-bb-muted uppercase">
            My account
          </p>
          <h1 className="font-serif mt-2 text-3xl text-bb-text sm:text-4xl">
            Hello, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-2 text-sm text-bb-muted">
            {user?.email}
            {user?.phone ? ` · ${user.phone}` : ''}
            {user?.provider === 'google' ? ' · Google' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut()
            navigate('/account', { replace: true })
          }}
          className="inline-flex items-center gap-2 rounded-full border border-bb-border px-4 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            to: '/orders',
            icon: Package,
            title: 'My orders',
            body: mine.length
              ? `${mine.length} order${mine.length === 1 ? '' : 's'}`
              : 'Track purchases',
          },
          {
            to: latest ? `/orders/${latest.id}` : '/orders',
            icon: Truck,
            title: 'Track order',
            body: latest
              ? `${latest.id} · ${ORDER_STATUS_LABEL[latest.status]}`
              : 'Enter order ID',
          },
          {
            to: '/wishlist',
            icon: Heart,
            title: 'Wishlist',
            body: `${wishlist.size} saved`,
          },
          {
            to: '/cart',
            icon: Package,
            title: 'Cart',
            body: cartCount ? `${cartCount} items` : 'Empty bag',
          },
        ].map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="rounded-2xl border border-bb-border bg-white p-4 transition hover:border-bb-blue"
          >
            <card.icon className="size-5 text-bb-blue" />
            <p className="mt-3 text-sm font-semibold text-bb-text">
              {card.title}
            </p>
            <p className="mt-1 text-xs text-bb-muted">{card.body}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-bb-border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
            Recent orders
          </h2>
          <Link
            to="/orders"
            className="text-xs font-semibold tracking-[0.14em] text-bb-link uppercase hover:underline"
          >
            View all
          </Link>
        </div>
        {mine.length === 0 ? (
          <p className="mt-4 text-sm text-bb-muted">
            No orders yet.{' '}
            <Link to="/deals" className="font-semibold text-bb-text underline">
              Browse the shop
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {mine.slice(0, 3).map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex items-center gap-3 rounded-xl border border-bb-border px-3 py-3 hover:border-bb-blue"
                >
                  <img
                    src={order.items[0]?.image}
                    alt=""
                    className="size-12 rounded-lg object-cover bg-bb-gray"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{order.id}</p>
                    <p className="text-xs text-bb-muted">
                      {ORDER_STATUS_LABEL[order.status]} ·{' '}
                      {formatMoney(order.total)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={openLocationModal}
          className="flex items-start gap-3 rounded-2xl border border-bb-border bg-white p-5 text-left"
        >
          <MapPin className="mt-0.5 size-5 text-bb-blue" />
          <span>
            <span className="block text-sm font-semibold">Pickup location</span>
            <span className="mt-1 block text-sm text-bb-muted">
              {locationLabel} · Change
            </span>
          </span>
        </button>
        <Link
          to="/memberships"
          className="rounded-2xl border border-bb-border bg-white p-5"
        >
          <p className="text-sm font-semibold">Fusora Membership</p>
          <p className="mt-1 text-sm text-bb-muted">
            ₹1,095 / year · member benefits
          </p>
        </Link>
      </section>

      <p className="mt-8 text-center text-xs text-bb-muted">
        Need help?{' '}
        <a href={SUPPORT_MAILTO} className="underline">
          {SUPPORT_EMAIL}
        </a>
      </p>
    </main>
  )
}

export function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode: Mode = location.pathname === '/register' ? 'register' : 'signin'
  const search = new URLSearchParams(location.search)
  const nextRaw = search.get('next')
  const nextPath =
    nextRaw && nextRaw.startsWith('/') && !nextRaw.startsWith('//')
      ? nextRaw
      : '/account'
  const {
    locationLabel,
    openLocationModal,
    registerAccount,
    signIn,
    isLoggedIn,
  } = useStore()

  usePageTitle(mode === 'register' ? 'Create account' : 'Sign in')

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

  useEffect(() => {
    if (!isLoggedIn) return
    if (location.pathname === '/register') {
      navigate(nextPath, { replace: true })
      return
    }
    if (location.pathname === '/account' && nextRaw && nextPath !== '/account') {
      navigate(nextPath, { replace: true })
    }
  }, [
    isLoggedIn,
    location.pathname,
    navigate,
    nextPath,
    nextRaw,
  ])

  if (isLoggedIn && location.pathname === '/account' && !nextRaw) {
    return <AccountDashboard />
  }

  if (isLoggedIn && location.pathname === '/account' && nextPath === '/account') {
    return <AccountDashboard />
  }

  if (isLoggedIn) {
    return (
      <main className="mx-auto max-w-[420px] px-4 py-20 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-bb-blue" />
        <p className="mt-3 text-sm text-bb-muted">Taking you in…</p>
      </main>
    )
  }

  const setMode = (next: Mode) => {
    setDone(null)
    setOtpState(emptyOtp)
    const q = search.toString() ? `?${search.toString()}` : ''
    navigate(next === 'register' ? `/register${q}` : `/account${q}`)
  }

  const goAfterAuth = () => {
    navigate(nextPath, { replace: true })
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
      goAfterAuth()
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
    goAfterAuth()
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
    msg.includes('already exists') ||
    msg.includes('Google') ||
    msg.includes('Client ID')

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
                : 'Verify your mobile with OTP, then join fusora.shop.'}
            </p>

            <div className="mt-6">
              <GoogleSignInButton
                onSuccess={goAfterAuth}
                onError={(message) => setDone(message)}
              />
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs tracking-wide text-bb-muted uppercase">
              <span className="h-px flex-1 bg-bb-border" />
              or use email
              <span className="h-px flex-1 bg-bb-border" />
            </div>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
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
                          disabled={
                            otpState.busy !== 'idle' || !form.phone.trim()
                          }
                          className="shrink-0 rounded-xl bg-bb-blue px-3.5 text-sm font-bold whitespace-nowrap text-white hover:bg-bb-blue-dark disabled:opacity-60"
                        >
                          {otpState.busy === 'send' ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : otpState.sent ? (
                            'Resend'
                          ) : (
                            'Send OTP'
                          )}
                        </button>
                      )}
                      {otpState.verified && (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-green-50 px-3 text-xs font-semibold text-green-700">
                          <CheckCircle2 className="size-3.5" />
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
                          required
                          value={otpState.otp}
                          onChange={(e) =>
                            setOtpState((s) => ({
                              ...s,
                              otp: e.target.value
                                .replace(/\D/g, '')
                                .slice(0, 6),
                            }))
                          }
                          className={field}
                          placeholder="4–6 digit OTP"
                          inputMode="numeric"
                        />
                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={
                            otpState.busy !== 'idle' ||
                            otpState.otp.length < 4
                          }
                          className="shrink-0 rounded-xl border border-bb-blue bg-white px-3.5 text-sm font-bold whitespace-nowrap text-bb-blue hover:bg-bb-blue/5 disabled:opacity-60"
                        >
                          {otpState.busy === 'verify' ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                    </label>
                  )}

                  {otpState.message && (
                    <p
                      className={`rounded-xl px-3 py-2 text-sm ${
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
                    className={`${field} pr-10 pl-10`}
                    placeholder="At least 6 characters"
                    autoComplete={
                      mode === 'signin' ? 'current-password' : 'new-password'
                    }
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-bb-muted"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label="Toggle password"
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
                      className={`${field} pr-10 pl-10`}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-bb-muted"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label="Toggle confirm password"
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

              {mode === 'signin' && (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2 text-bb-muted">
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
                  <a
                    href={SUPPORT_MAILTO}
                    className="font-semibold text-bb-link hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {mode === 'register' && (
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
                  className={`rounded-xl px-3 py-2 text-sm ${
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

            <div className="mt-6 flex items-center gap-3 text-xs tracking-wide text-bb-muted uppercase">
              <span className="h-px flex-1 bg-bb-border" />
              or
              <span className="h-px flex-1 bg-bb-border" />
            </div>

            <button
              type="button"
              onClick={() =>
                setMode(mode === 'signin' ? 'register' : 'signin')
              }
              className="mt-4 w-full rounded-full border border-bb-border bg-white py-3 text-sm font-bold text-bb-text hover:bg-bb-gray"
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
                <MapPin className="size-4 text-bb-blue" />
                Preferred store: {locationLabel}
              </button>
              <Link to="/memberships" className="block text-bb-muted">
                Explore Fusora Membership — ₹1,095/year
              </Link>
              <a href={SUPPORT_MAILTO} className="block text-bb-muted">
                Need help? Contact {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
