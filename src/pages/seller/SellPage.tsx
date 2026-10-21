import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from 'lucide-react'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  isSellerLoggedIn,
  loginSeller,
  registerSeller,
} from '../../lib/sellerApi'

const field =
  'mt-1.5 w-full border border-[#d9d9d9] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#cf2028]'

export function SellPage() {
  usePageTitle('Sell on Fusora')
  const navigate = useNavigate()
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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
      navigate('/seller')
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

  return (
    <main className="mx-auto max-w-[920px] px-4 py-10 lg:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <section>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#6a6667] uppercase">
            Marketplace
          </p>
          <h1 className="font-heading mt-2 text-4xl tracking-[0.04em] text-[#070001] uppercase sm:text-5xl">
            Sell on Fusora
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6a6667]">
            Register your shop, upload your own products with photos and prices,
            and start selling to Fusora customers. You keep your brand — we give
            you the storefront.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[#070001]">
            <li className="flex gap-2">
              <Store className="mt-0.5 size-4 shrink-0 text-[#cf2028]" />
              Free seller registration
            </li>
            <li className="flex gap-2">
              <Store className="mt-0.5 size-4 shrink-0 text-[#cf2028]" />
              List sarees, shirts, tees & jeans
            </li>
            <li className="flex gap-2">
              <Store className="mt-0.5 size-4 shrink-0 text-[#cf2028]" />
              Your shop name shows on every product
            </li>
          </ul>
        </section>

        <section className="border border-[#d9d9d9] bg-white p-5 sm:p-6">
          <div className="flex gap-2 border-b border-[#d9d9d9] pb-4">
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
                className={`px-3.5 py-2 text-xs font-semibold tracking-[0.14em] uppercase ${
                  mode === id
                    ? 'bg-[#cf2028] text-white'
                    : 'border border-[#d9d9d9] text-[#6a6667]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === 'register' ? (
            <form onSubmit={onRegister} className="mt-5 space-y-3.5">
              <label className="block text-sm font-semibold">
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
              <label className="block text-sm font-semibold">
                Owner name
                <input
                  className={field}
                  required
                  value={reg.ownerName}
                  onChange={(e) =>
                    setReg((r) => ({ ...r, ownerName: e.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-semibold">
                Email
                <input
                  className={field}
                  type="email"
                  required
                  value={reg.email}
                  onChange={(e) =>
                    setReg((r) => ({ ...r, email: e.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-semibold">
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
              <label className="block text-sm font-semibold">
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
                />
              </label>
              <label className="block text-sm font-semibold">
                Payout UPI ID <span className="font-normal text-[#6a6667]">(jahan payment milega)</span>
                <input
                  className={field}
                  value={reg.payoutUpi}
                  onChange={(e) =>
                    setReg((r) => ({ ...r, payoutUpi: e.target.value }))
                  }
                  placeholder="e.g. yourname@okhdfcbank"
                />
              </label>
              <p className="text-xs leading-5 text-[#6a6667]">
                Fusora marketplace commission is 10%. Payouts are settled to
                this UPI ID after delivery. Products go live after admin
                approval.
              </p>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cf2028]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#cf2028] py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase disabled:opacity-60"
              >
                {busy ? 'Creating…' : 'Create seller account'}
              </button>
            </form>
          ) : (
            <form onSubmit={onLogin} className="mt-5 space-y-3.5">
              <label className="block text-sm font-semibold">
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
              <label className="block text-sm font-semibold">
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
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cf2028]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#cf2028] py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase disabled:opacity-60"
              >
                {busy ? 'Signing in…' : 'Seller login'}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-xs text-[#6a6667]">
            Shopper account?{' '}
            <Link to="/account" className="font-semibold text-[#cf2028]">
              Sign in here
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
