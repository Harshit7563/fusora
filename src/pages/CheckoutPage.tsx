import { CheckCircle2, Lock } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatMoney } from '../data'
import { COD_MIN_TOTAL, SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'
import { useStore } from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { saveCheckoutDraft } from '../lib/checkoutDraft'
import {
  isValidPincodeFormat,
  validatePincode,
} from '../lib/pincode'

type CheckoutPayChoice = 'online' | 'cod'

export function CheckoutPage() {
  usePageTitle('Checkout')
  const navigate = useNavigate()
  const {
    cart,
    user,
    isLoggedIn,
    placeOrder,
  } = useStore()
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pinHint, setPinHint] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    payment: 'online' as CheckoutPayChoice,
  })

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart],
  )
  const codAllowed = total >= COD_MIN_TOTAL

  useEffect(() => {
    if (!user) return
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      email: f.email || user.email,
      phone: f.phone || user.phone,
    }))
  }, [user])

  useEffect(() => {
    if (!codAllowed && form.payment === 'cod') {
      setForm((f) => ({ ...f, payment: 'online' }))
    }
  }, [codAllowed, form.payment])

  const lookupPincode = async (raw: string) => {
    const pin = raw.trim()
    if (!pin) {
      setPinHint('')
      return
    }
    if (!isValidPincodeFormat(pin)) {
      setPinHint('Enter a valid 6-digit Indian pincode.')
      return
    }
    setPinHint('Checking pincode…')
    const result = await validatePincode(pin)
    if (!result.ok) {
      setPinHint(result.message)
      return
    }
    setForm((f) => ({
      ...f,
      pincode: result.pincode,
      city: result.city || f.city,
      state: result.state || f.state,
    }))
    setPinHint(
      result.city || result.state
        ? `Serviceable · ${[result.area, result.city, result.state].filter(Boolean).join(', ')}`
        : 'Pincode format OK',
    )
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isLoggedIn || !user) {
      navigate('/account?next=/checkout')
      return
    }
    if (cart.length === 0) return

    const phone = form.phone.replace(/\D/g, '')
    if (phone.length < 10) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    if (!isValidPincodeFormat(form.pincode)) {
      setError('Enter a valid 6-digit Indian pincode.')
      return
    }

    setSubmitting(true)
    const pinResult = await validatePincode(form.pincode)
    if (!pinResult.ok) {
      setSubmitting(false)
      setError(pinResult.message)
      setPinHint(pinResult.message)
      return
    }

    const city = pinResult.city || form.city
    const state = pinResult.state || form.state
    const fullAddress = [form.address.trim(), city, state, pinResult.pincode]
      .filter(Boolean)
      .join(', ')

    if (form.payment === 'cod') {
      if (!codAllowed) {
        setSubmitting(false)
        setError(`Cash on delivery is available only for orders of ₹${COD_MIN_TOTAL.toLocaleString('en-IN')} or more.`)
        return
      }
      const order = placeOrder({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: fullAddress,
        payment: 'cod',
      })
      setSubmitting(false)
      if (!order) {
        setError('Could not place order. Please try again.')
        return
      }
      setDone(order.id)
      return
    }

    // Pay online: do NOT place order yet — open custom payment page
    saveCheckoutDraft({
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      address: form.address.trim(),
      pincode: pinResult.pincode,
      city,
      state,
      payment: 'upi',
      total,
      items: cart.map((i) => ({ ...i })),
      createdAt: Date.now(),
    })
    setSubmitting(false)
    navigate('/payment?method=upi')
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
            to={`/orders/${done}`}
            className="rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            Track order
          </Link>
          <Link
            to="/orders"
            className="rounded-full border border-bb-border px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
          >
            My orders
          </Link>
          <Link
            to="/deals"
            className="rounded-full border border-bb-border px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
          >
            Continue shopping
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

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-14 text-center sm:py-16">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#efe8dc] text-bb-blue">
          <Lock className="size-6" />
        </span>
        <h1 className="font-serif mt-5 text-3xl text-bb-text">Sign in to order</h1>
        <p className="mt-3 text-sm leading-relaxed text-bb-muted">
          Login required before checkout — so we can confirm your order on
          WhatsApp/SMS and keep your bag safe.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/account?next=/checkout"
            className="rounded-full bg-bb-blue px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            Sign in
          </Link>
          <Link
            to="/register?next=/checkout"
            className="rounded-full border border-bb-border px-6 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase"
          >
            Create account
          </Link>
          <Link
            to="/cart"
            className="text-xs tracking-wide text-bb-muted uppercase hover:text-bb-text"
          >
            Back to cart
          </Link>
        </div>
        <p className="mt-6 text-xs text-bb-muted">
          {cart.length} item{cart.length === 1 ? '' : 's'} · {formatMoney(total)}{' '}
          waiting in your bag
        </p>
      </main>
    )
  }

  const field =
    'mt-1.5 w-full rounded-xl border border-bb-border bg-white px-3.5 py-3 text-sm outline-none focus:border-bb-blue'

  const payOptions: {
    id: CheckoutPayChoice
    label: string
    hint?: string
    disabled?: boolean
  }[] = [
    {
      id: 'online',
      label: 'Pay Online',
      hint: 'UPI QR · Debit / Credit · Net banking',
    },
    {
      id: 'cod',
      label: 'Cash on delivery',
      hint: codAllowed
        ? 'Pay when your order arrives'
        : `Available on orders ₹${COD_MIN_TOTAL.toLocaleString('en-IN')}+`,
      disabled: !codAllowed,
    },
  ]

  return (
    <main className="mx-auto max-w-[1000px] px-3 py-8 sm:px-4 sm:py-10 lg:px-6">
      <h1 className="font-serif text-3xl text-bb-text sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-bb-muted">
        Signed in as {user?.name || user?.email} · Enter address and choose how
        you want to pay.
      </p>

      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="order-2 space-y-4 lg:order-1" onSubmit={onSubmit}>
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
            Pincode
            <input
              required
              inputMode="numeric"
              maxLength={6}
              pattern="[1-9][0-9]{5}"
              className={field}
              placeholder="6-digit PIN first"
              value={form.pincode}
              onChange={(e) => {
                const pincode = e.target.value.replace(/\D/g, '').slice(0, 6)
                setForm((f) =>
                  pincode.length < 6
                    ? { ...f, pincode, city: '', state: '' }
                    : { ...f, pincode },
                )
                if (pincode.length < 6) setPinHint('')
                else void lookupPincode(pincode)
              }}
              onBlur={() => void lookupPincode(form.pincode)}
            />
          </label>
          {pinHint && (
            <p
              className={`-mt-2 text-xs ${
                pinHint.includes('not') || pinHint.includes('valid')
                  ? 'text-bb-save'
                  : 'text-bb-muted'
              }`}
            >
              {pinHint}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              City
              <input
                required
                className={field}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="Fills after pincode"
              />
            </label>
            <label className="block text-sm font-semibold">
              State
              <input
                required
                className={field}
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="Fills after pincode"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Address / landmark
            <textarea
              required
              rows={3}
              className={field}
              placeholder="House no., street, landmark"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">Payment</legend>
            {payOptions.map(({ id, label, hint, disabled }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                  disabled
                    ? 'cursor-not-allowed border-bb-border/60 opacity-55'
                    : 'border-bb-border'
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  disabled={disabled}
                  checked={form.payment === id}
                  onChange={() => setForm((f) => ({ ...f, payment: id }))}
                  className="accent-bb-blue"
                />
                <span>
                  {label}
                  {hint && (
                    <span className="mt-0.5 block text-xs text-bb-muted">{hint}</span>
                  )}
                </span>
              </label>
            ))}
          </fieldset>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-bb-save">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-bb-blue py-3.5 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase disabled:opacity-60"
          >
            {submitting
              ? 'Please wait…'
              : form.payment === 'cod'
                ? `Place order · ${formatMoney(total)}`
                : `Pay online · ${formatMoney(total)}`}
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="w-full text-center text-xs tracking-wide text-bb-muted uppercase hover:text-bb-text"
          >
            Back to cart
          </button>
        </form>

        <aside className="order-1 h-fit rounded-2xl border border-bb-border bg-white p-4 sm:p-5 lg:order-2 lg:sticky lg:top-28">
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
                    {item.selectedSize ? `Size ${item.selectedSize} · ` : ''}
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
          {!codAllowed && (
            <p className="mt-3 text-xs text-bb-muted">
              COD unlocks at ₹{COD_MIN_TOTAL.toLocaleString('en-IN')}+. Use Pay
              Online (UPI / card / net banking) below that.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}
