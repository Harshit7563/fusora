import { CheckCircle2, MapPin } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatMoney } from '../data'
import { useStore } from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'

export function CheckoutPage() {
  usePageTitle('Checkout')
  const navigate = useNavigate()
  const {
    cart,
    locationLabel,
    store,
    clearCart,
    openLocationModal,
  } = useStore()
  const [done, setDone] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    payment: 'cod' as 'cod' | 'upi',
  })

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return
    const phone = form.phone.replace(/\D/g, '')
    if (phone.length < 10) {
      setDone('Enter a valid 10-digit mobile number.')
      return
    }
    const orderId = `FUS${Date.now().toString().slice(-8)}`
    clearCart()
    setDone(orderId)
  }

  if (done && done.startsWith('FUS')) {
    return (
      <main className="mx-auto max-w-[640px] px-4 py-16 text-center lg:px-6">
        <CheckCircle2 className="mx-auto size-12 text-green-700" />
        <h1 className="font-serif mt-4 text-3xl text-bb-text">Order placed</h1>
        <p className="mt-3 text-sm text-bb-muted">
          Order ID <strong className="text-bb-text">{done}</strong>
        </p>
        <p className="mt-2 text-sm text-bb-muted">
          We’ll confirm on WhatsApp/SMS shortly. Questions?{' '}
          <a href={SUPPORT_MAILTO} className="underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/deals"
            className="rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            Continue shopping
          </Link>
          <Link
            to="/support"
            className="rounded-full border border-bb-border px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
          >
            Support
          </Link>
        </div>
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-[640px] px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Cart is empty</h1>
        <Link
          to="/deals"
          className="mt-6 inline-flex rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
        >
          Shop deals
        </Link>
      </main>
    )
  }

  const field =
    'mt-1.5 w-full rounded-xl border border-bb-border bg-white px-3.5 py-3 text-sm outline-none focus:border-bb-blue'

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-10 lg:px-6">
      <h1 className="font-serif text-4xl text-bb-text">Checkout</h1>
      <p className="mt-2 text-sm text-bb-muted">
        Complete your order for hub pickup or delivery.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-semibold">
            Full name
            <input
              required
              className={field}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-semibold">
            Mobile
            <input
              required
              type="tel"
              inputMode="numeric"
              className={field}
              placeholder="10-digit mobile"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input
              required
              type="email"
              className={field}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-semibold">
            Address / landmark
            <textarea
              required
              rows={3}
              className={field}
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
            />
          </label>

          <button
            type="button"
            onClick={openLocationModal}
            className="flex w-full items-start gap-2 rounded-xl border border-bb-border px-3 py-3 text-left text-sm"
          >
            <MapPin className="mt-0.5 size-4 text-bb-blue" />
            <span>
              <span className="font-semibold">Fulfill near {locationLabel}</span>
              <span className="mt-0.5 block text-xs text-bb-muted">
                {store?.name ?? 'Choose hub'} · Change
              </span>
            </span>
          </button>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">Payment</legend>
            {(
              [
                ['cod', 'Cash on delivery / hub pay'],
                ['upi', 'UPI (pay on confirmation)'],
              ] as const
            ).map(([id, label]) => (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-bb-border px-3 py-3 text-sm"
              >
                <input
                  type="radio"
                  name="pay"
                  checked={form.payment === id}
                  onChange={() => setForm((f) => ({ ...f, payment: id }))}
                  className="accent-bb-blue"
                />
                {label}
              </label>
            ))}
          </fieldset>

          {done && !done.startsWith('FUS') && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-bb-save">
              {done}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-bb-blue py-3.5 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            Place order · {formatMoney(total)}
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="w-full text-center text-xs tracking-wide text-bb-muted uppercase hover:text-bb-text"
          >
            Back to cart
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-bb-border bg-white p-5">
          <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {cart.map((item) => (
              <li key={item.id} className="flex gap-3 text-sm">
                <img
                  src={item.image}
                  alt=""
                  className="size-14 rounded-lg object-cover bg-bb-gray"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-medium">{item.name}</p>
                  <p className="mt-1 text-bb-muted">
                    Qty {item.qty} · {formatMoney(item.price * item.qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-bb-border pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  )
}
