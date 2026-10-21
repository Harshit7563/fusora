import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Store,
  Truck,
  X,
} from 'lucide-react'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  isSellerLoggedIn,
  loginSeller,
  registerSeller,
} from '../../lib/sellerApi'

const field =
  'mt-1.5 w-full rounded-xl border border-[#e7e2dc] bg-[#faf8f4] px-4 py-3 text-sm outline-none transition focus:border-[#cf2028] focus:bg-white'

const perks = [
  {
    Icon: Store,
    head: 'Free Registration',
    sub: 'No joining fee. Create your shop in minutes.',
  },
  {
    Icon: PackageCheck,
    head: 'Quick Approval',
    sub: 'Products go live after a quick admin review.',
  },
  {
    Icon: BadgeIndianRupee,
    head: 'You Keep 90%',
    sub: 'Only 10% commission. Payouts to your UPI.',
  },
  {
    Icon: Truck,
    head: 'Pan-India Reach',
    sub: 'Sell to customers across India from day one.',
  },
]

const steps = [
  ['1', 'Register your shop', 'Fill the form with your shop and payout details.'],
  ['2', 'We verify & onboard', 'Our team contacts you and activates your seller account.'],
  ['3', 'Upload & start selling', 'Add products with photos and prices, and receive orders.'],
] as const

export function SellPage() {
  usePageTitle('Sell on Fusora')
  const navigate = useNavigate()
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [reg, setReg] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    payoutUpi: '',
  })
  const [login, setLogin] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isSellerLoggedIn()) navigate('/seller', { replace: true })
  }, [navigate])

  const onRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await registerSeller(reg)
      setShowSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  const onLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await loginSeller(login)
      navigate('/seller')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const goDashboard = () => {
    setShowSuccess(false)
    navigate('/seller')
  }

  return (
    <main className="bg-[#f8f6ee]">
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:py-14 lg:px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-[0.68rem] font-bold tracking-[0.28em] text-[#cf2028] uppercase">
            Fusora Marketplace
          </p>
          <h1 className="mt-2 font-heading text-5xl tracking-wide text-[#141414] uppercase sm:text-6xl">
            Sell on Fusora
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 bg-[#cf2028]" />
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#6a6667]">
            Register your shop, upload your own products with photos and
            prices, and start selling to customers across India. You keep your
            brand — we give you the storefront.
          </p>
        </div>

        {/* Perks */}
        <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ Icon, head, sub }) => (
            <div
              key={head}
              className="rounded-2xl border border-[#f0e7da] bg-white px-4 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            >
              <span className="grid size-11 place-items-center rounded-full bg-[#cf2028]/10 text-[#cf2028]">
                <Icon className="size-5" strokeWidth={1.9} />
              </span>
              <p className="mt-3 font-heading text-xl tracking-wide text-[#141414] uppercase">
                {head}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#6a6667]">
                {sub}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* How it works */}
          <section className="rounded-3xl bg-[#141414] px-6 py-7 text-white">
            <h2 className="font-heading text-3xl tracking-wide uppercase">
              How it works
            </h2>
            <div className="mt-3 h-1 w-12 bg-[#ffc462]" />
            <ol className="mt-6 space-y-5">
              {steps.map(([n, head, sub]) => (
                <li key={n} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#cf2028] font-heading text-xl text-white">
                    {n}
                  </span>
                  <span>
                    <span className="block text-sm font-bold tracking-wide uppercase">
                      {head}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-white/65">
                      {sub}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-7 flex items-start gap-2 rounded-2xl bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/70">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-[#ffc462]" />
              Our support team is available between 9:00 AM and 6:00 PM for
              seller onboarding and help.
            </p>
          </section>

          {/* Form card */}
          <section className="rounded-3xl border border-[#eee7df] bg-white p-5 shadow-[0_12px_44px_rgba(0,0,0,0.07)] sm:p-7">
            <div className="grid grid-cols-2 gap-1 rounded-full bg-[#f2f0ec] p-1">
              {(
                [
                  ['register', 'Register shop'],
                  ['login', 'Seller login'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMode(id)
                    setError('')
                  }}
                  className={`rounded-full py-2.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase transition ${
                    mode === id
                      ? 'bg-[#141414] text-white shadow'
                      : 'text-[#787878] hover:text-[#141414]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === 'register' ? (
              <form onSubmit={onRegister} className="mt-6 space-y-4">
                <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                  Shop name
                  <input
                    className={field}
                    required
                    value={reg.shopName}
                    onChange={(e) =>
                      setReg((r) => ({ ...r, shopName: e.target.value }))
                    }
                    placeholder="e.g. Meera Silk House"
                  />
                </label>
                <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                  Owner name
                  <input
                    className={field}
                    required
                    value={reg.ownerName}
                    onChange={(e) =>
                      setReg((r) => ({ ...r, ownerName: e.target.value }))
                    }
                    placeholder="Your full name"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                    Email
                    <input
                      className={field}
                      type="email"
                      required
                      value={reg.email}
                      onChange={(e) =>
                        setReg((r) => ({ ...r, email: e.target.value }))
                      }
                      placeholder="you@shop.com"
                    />
                  </label>
                  <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                    Mobile
                    <input
                      className={field}
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={reg.phone}
                      onChange={(e) =>
                        setReg((r) => ({
                          ...r,
                          phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                        }))
                      }
                      placeholder="10-digit mobile"
                    />
                  </label>
                </div>
                <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                  Password
                  <input
                    className={field}
                    type="password"
                    required
                    minLength={6}
                    value={reg.password}
                    onChange={(e) =>
                      setReg((r) => ({ ...r, password: e.target.value }))
                    }
                    placeholder="Minimum 6 characters"
                  />
                </label>
                <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                  Payout UPI ID{' '}
                  <span className="font-semibold text-[#96938b] normal-case">
                    (where you receive payments)
                  </span>
                  <input
                    className={field}
                    value={reg.payoutUpi}
                    onChange={(e) =>
                      setReg((r) => ({ ...r, payoutUpi: e.target.value }))
                    }
                    placeholder="e.g. yourname@okhdfcbank"
                  />
                </label>
                <p className="rounded-xl bg-[#f8f6ee] px-3.5 py-2.5 text-xs leading-5 text-[#6a6667]">
                  Fusora marketplace commission is 10%. Payouts are settled
                  to this UPI ID after delivery. Products go live after admin
                  approval.
                </p>
                {error && (
                  <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-[#cf2028]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-[#cf2028] py-3.5 text-[0.75rem] font-bold tracking-[0.16em] text-white uppercase transition hover:bg-[#141414] disabled:opacity-60"
                >
                  {busy ? 'Creating…' : 'Create seller account'}
                </button>
              </form>
            ) : (
              <form onSubmit={onLogin} className="mt-6 space-y-4">
                <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                  Email or mobile
                  <input
                    className={field}
                    required
                    value={login.email}
                    onChange={(e) =>
                      setLogin((l) => ({ ...l, email: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-[0.7rem] font-bold tracking-[0.12em] text-[#141414] uppercase">
                  Password
                  <input
                    className={field}
                    type="password"
                    required
                    value={login.password}
                    onChange={(e) =>
                      setLogin((l) => ({ ...l, password: e.target.value }))
                    }
                  />
                </label>
                {error && (
                  <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-[#cf2028]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-[#cf2028] py-3.5 text-[0.75rem] font-bold tracking-[0.16em] text-white uppercase transition hover:bg-[#141414] disabled:opacity-60"
                >
                  {busy ? 'Signing in…' : 'Seller login'}
                </button>
              </form>
            )}

            <p className="mt-5 text-center text-xs text-[#6a6667]">
              Shopper account?{' '}
              <Link to="/account" className="font-bold text-[#cf2028]">
                Sign in here
              </Link>
            </p>
          </section>
        </div>
      </div>

      {/* Success popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-[#141414]/60 px-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-3xl bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
            >
              <button
                type="button"
                onClick={goDashboard}
                aria-label="Close"
                className="absolute top-3.5 right-3.5 grid size-8 place-items-center rounded-full text-[#96938b] transition hover:bg-[#f6f2ec] hover:text-[#141414]"
              >
                <X className="size-4" />
              </button>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-50">
                <CheckCircle2 className="size-9 text-green-600" strokeWidth={1.8} />
              </span>
              <h2 className="mt-4 font-heading text-4xl tracking-wide text-[#141414] uppercase">
                Registration successful
              </h2>
              <div className="mx-auto mt-2 h-1 w-12 bg-[#cf2028]" />
              <p className="mt-4 text-sm leading-relaxed text-[#3d3d3d]">
                Thank you for registering your shop
                {reg.shopName ? (
                  <>
                    {' '}
                    <strong>{reg.shopName}</strong>
                  </>
                ) : null}{' '}
                on Fusora. Our representative will contact you between{' '}
                <strong>9:00 AM and 6:00 PM</strong> via phone / email
                communication to verify your details and help you start
                selling.
              </p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#6a6667]">
                <Clock3 className="size-3.5 text-[#cf2028]" />
                Support hours: 9:00 AM – 6:00 PM (Mon–Sat)
              </p>
              <button
                type="button"
                onClick={goDashboard}
                className="mt-6 w-full rounded-full bg-[#cf2028] py-3.5 text-[0.75rem] font-bold tracking-[0.16em] text-white uppercase transition hover:bg-[#141414]"
              >
                Go to seller dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
