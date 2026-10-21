import {
  CheckCircle2,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Truck,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'
import { FusoraLogo } from '../components/FusoraLogo'
import { GoogleSignInButton } from '../components/GoogleSignInButton'
import {
  ORDER_STATUS_LABEL,
  useStore,
} from '../context/StoreContext'
import { formatMoney } from '../data'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  clearEmailOtpSession,
  isEmailOtpVerified,
  sendEmailOtp,
  verifyEmailOtp,
} from '../lib/emailAuth'

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
          className="inline-flex items-center gap-2 border border-bb-border px-4 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase"
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
  const { registerAccount, signInWithEmail, isLoggedIn } = useStore()

  usePageTitle(mode === 'register' ? 'Create account' : 'Sign in')

  const [done, setDone] = useState<string | null>(null)
  const [otpState, setOtpState] = useState<OtpState>(emptyOtp)

  const [form, setForm] = useState({
    name: '',
    email: '',
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
    const result = await sendEmailOtp(form.email, form.name || 'Customer')
    if (!result.ok) {
      setOtpState((s) => ({
        ...s,
        busy: 'idle',
        sent: false,
        sessionId: null,
        message: result.message,
        error: true,
      }))
      return
    }
    setOtpState({
      sessionId: 'email',
      sent: true,
      verified: false,
      otp: '',
      busy: 'idle',
      message: result.message,
      error: false,
    })
  }

  const verifyOtp = () => {
    setDone(null)
    setOtpState((s) => ({ ...s, busy: 'verify', message: null, error: false }))
    const result = verifyEmailOtp(form.email, otpState.otp)
    if (!result.ok) {
      setOtpState((s) => ({
        ...s,
        busy: 'idle',
        verified: false,
        message: result.message,
        error: true,
      }))
      return
    }
    setOtpState((s) => ({
      ...s,
      busy: 'idle',
      verified: true,
      message: result.message,
      error: false,
    }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!otpState.verified && !isEmailOtpVerified(form.email)) {
      setDone('Please verify your email with OTP first.')
      return
    }

    if (mode === 'register') {
      if (!form.terms) {
        setDone('Please accept Terms & Privacy to continue.')
        return
      }
      const result = registerAccount({
        name: form.name,
        email: form.email,
      })
      if (!result.ok) {
        setDone(result.message)
        return
      }
      clearEmailOtpSession()
      goAfterAuth()
      return
    }

    const result = signInWithEmail(form.email)
    if (!result.ok) {
      setDone(result.message)
      return
    }
    clearEmailOtpSession()
    goAfterAuth()
  }

  const field =
    'mt-1.5 w-full border border-[#ececec] bg-white px-3.5 py-3 text-sm font-normal text-[#272727] outline-none transition focus:border-[#323232] disabled:bg-[#f5f5f5]'

  const isErrorBanner = (msg: string) =>
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
    msg.includes('Client ID') ||
    msg.includes('EmailJS') ||
    msg.includes('configured')

  return (
    <main className="min-h-[calc(100svh-8rem)] bg-white">
      <div className="mx-auto flex w-full max-w-[440px] flex-col px-4 py-8 sm:px-6 sm:py-16">
        <div className="mb-6 flex justify-center sm:mb-8">
          <FusoraLogo centered compact />
        </div>

        <div className="mb-6 flex items-center justify-center gap-6 border-b border-[#ececec] sm:mb-8">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`pb-3 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition sm:text-[0.72rem] sm:tracking-[0.16em] ${
              mode === 'signin'
                ? 'border-b-2 border-[#323232] text-[#272727]'
                : 'text-[#787878] hover:text-[#272727]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`pb-3 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition sm:text-[0.72rem] sm:tracking-[0.16em] ${
              mode === 'register'
                ? 'border-b-2 border-[#323232] text-[#272727]'
                : 'text-[#787878] hover:text-[#272727]'
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-center text-[1.4rem] font-medium tracking-wide text-[#272727] sm:text-[1.65rem]">
          {mode === 'signin' ? 'Login' : 'Create account'}
        </h1>
        <p className="mt-2 text-center text-sm text-[#787878]">
          {mode === 'signin'
            ? 'If you are already registered, please log in with email OTP.'
            : 'Create your account with email OTP verification.'}
        </p>

        <div className="mt-8">
          <GoogleSignInButton
            onSuccess={goAfterAuth}
            onError={(message) => setDone(message)}
          />
        </div>

        <div className="mt-6 flex items-center gap-3 text-[0.65rem] tracking-[0.14em] text-[#787878] uppercase">
          <span className="h-px flex-1 bg-[#ececec]" />
          or email OTP
          <span className="h-px flex-1 bg-[#ececec]" />
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {mode === 'register' && (
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] text-[#272727] uppercase">
              Full name
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className={field}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}

          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] text-[#272727] uppercase">
            Email
            <div className="mt-1.5 flex gap-2">
              <input
                type="email"
                required
                disabled={otpState.verified}
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }))
                  setOtpState(emptyOtp)
                }}
                className={`${field} mt-0 min-w-0 flex-1`}
                placeholder="shopsupportfusora@gmail.com"
                autoComplete="email"
              />
              {!otpState.verified && (
                <button
                  type="button"
                  onClick={() => void sendOtp()}
                  disabled={otpState.busy !== 'idle' || !form.email.trim()}
                  className="shrink-0 bg-[#323232] px-4 text-[0.65rem] font-semibold tracking-[0.12em] text-white uppercase disabled:opacity-60"
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
                <span className="inline-flex items-center gap-1 border border-[#ececec] bg-[#f5f5f5] px-3 text-[0.65rem] font-semibold tracking-wide text-[#272727] uppercase">
                  <CheckCircle2 className="size-3.5 text-green-700" />
                  Verified
                </span>
              )}
            </div>
          </label>

          {otpState.sent && !otpState.verified && (
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] text-[#272727] uppercase">
              Email OTP
              <div className="mt-1.5 flex gap-2">
                <input
                  required
                  value={otpState.otp}
                  onChange={(e) =>
                    setOtpState((s) => ({
                      ...s,
                      otp: e.target.value.replace(/\D/g, '').slice(0, 6),
                    }))
                  }
                  className={`${field} mt-0 min-w-0 flex-1`}
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={
                    otpState.busy !== 'idle' || otpState.otp.length < 4
                  }
                  className="shrink-0 border border-[#323232] bg-white px-4 text-[0.65rem] font-semibold tracking-[0.12em] text-[#323232] uppercase disabled:opacity-60"
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
              className={`border px-3 py-2 text-sm ${
                otpState.error
                  ? 'border-red-200 bg-red-50 text-bb-save'
                  : 'border-[#ececec] bg-[#f5f5f5] text-[#272727]'
              }`}
            >
              {otpState.message}
            </p>
          )}

          {mode === 'register' && (
            <label className="flex items-start gap-2 text-sm text-[#787878]">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) =>
                  setForm((f) => ({ ...f, terms: e.target.checked }))
                }
                className="mt-0.5 size-4 border-[#ececec] accent-[#323232]"
              />
              <span>
                I agree to Fusora{' '}
                <Link
                  to="/policies/terms-and-conditions"
                  className="text-[#272727] underline underline-offset-2"
                >
                  Terms
                </Link>{' '}
                &{' '}
                <Link
                  to="/policies/privacy-policy"
                  className="text-[#272727] underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
          )}

          {done && (
            <p
              className={`border px-3 py-2 text-sm ${
                isErrorBanner(done)
                  ? 'border-red-200 bg-red-50 text-bb-save'
                  : 'border-[#ececec] bg-[#f5f5f5] text-[#272727]'
              }`}
            >
              {done}
            </p>
          )}

          <button
            type="submit"
            disabled={!otpState.verified}
            className="w-full bg-[#323232] py-3.5 text-[0.72rem] font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#1f1f1f] disabled:opacity-60"
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#787878]">
          {mode === 'signin' ? (
            <>
              New customer?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-medium text-[#272727] underline underline-offset-4"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-medium text-[#272727] underline underline-offset-4"
              >
                Login
              </button>
            </>
          )}
        </p>

        <p className="mt-6 text-center text-xs text-[#787878]">
          Need help?{' '}
          <a href={SUPPORT_MAILTO} className="text-[#272727] underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  )
}
