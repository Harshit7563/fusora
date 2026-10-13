import {
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  Smartphone,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { formatMoney } from '../data'
import { UPI_PAYEE_NAME, UPI_VPA } from '../brand'
import { useStore } from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  buildUpiPayUrl,
  clearCheckoutDraft,
  readCheckoutDraft,
  saveCheckoutDraft,
  upiQrImageUrl,
  type PaymentMethod,
} from '../lib/checkoutDraft'

const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Yes Bank',
] as const

export function PaymentPage() {
  usePageTitle('Payment')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { placeOrder, cart, isLoggedIn } = useStore()
  const [draft, setDraft] = useState(() => readCheckoutDraft())
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [doneId, setDoneId] = useState<string | null>(null)

  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })
  const [bank, setBank] = useState('')

  const methodParam = (params.get('method') || draft?.payment || 'upi') as
    | 'upi'
    | 'card'
    | 'netbanking'
  const method: Exclude<PaymentMethod, 'cod'> =
    methodParam === 'card' || methodParam === 'netbanking' || methodParam === 'upi'
      ? methodParam
      : 'upi'

  useEffect(() => {
    const d = readCheckoutDraft()
    setDraft(d)
    if (!d) {
      navigate('/checkout', { replace: true })
    }
  }, [navigate])

  const txnRef = useMemo(
    () => `FUS${String(draft?.createdAt ?? Date.now()).slice(-10)}`,
    [draft?.createdAt],
  )

  const upiLink = useMemo(() => {
    if (!draft) return ''
    return buildUpiPayUrl({
      pa: UPI_VPA,
      pn: UPI_PAYEE_NAME,
      am: draft.total,
      tr: txnRef,
    })
  }, [draft, txnRef])

  const qrUrl = useMemo(
    () => (upiLink ? upiQrImageUrl(upiLink) : ''),
    [upiLink],
  )

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-14 text-center">
        <Lock className="mx-auto size-10 text-bb-blue" />
        <h1 className="font-serif mt-4 text-3xl">Sign in to pay</h1>
        <Link
          to="/account?next=/payment"
          className="mt-6 inline-flex rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
        >
          Sign in
        </Link>
      </main>
    )
  }

  if (doneId) {
    return (
      <main className="mx-auto max-w-[640px] px-4 py-16 text-center lg:px-6">
        <CheckCircle2 className="mx-auto size-12 text-green-700" />
        <h1 className="font-serif mt-4 text-3xl text-bb-text">Payment successful</h1>
        <p className="mt-3 text-sm text-bb-muted">
          Order ID <strong className="text-bb-text">{doneId}</strong>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={`/orders/${doneId}`}
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
        </div>
      </main>
    )
  }

  if (!draft) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-16 text-center">
        <p className="text-sm text-bb-muted">No pending payment. Return to checkout.</p>
        <Link
          to="/checkout"
          className="mt-6 inline-flex rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
        >
          Checkout
        </Link>
      </main>
    )
  }

  const confirmPayment = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (cart.length === 0) {
      setError('Your cart is empty. Please checkout again.')
      return
    }

    if (method === 'card') {
      const digits = card.number.replace(/\D/g, '')
      if (digits.length < 15 || digits.length > 16) {
        setError('Enter a valid 15–16 digit card number.')
        return
      }
      if (!card.name.trim()) {
        setError('Enter the name on the card.')
        return
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim())) {
        setError('Enter expiry as MM/YY.')
        return
      }
      if (!/^\d{3,4}$/.test(card.cvv.trim())) {
        setError('Enter a valid CVV.')
        return
      }
    }

    if (method === 'netbanking' && !bank) {
      setError('Select your bank to continue.')
      return
    }

    setPaying(true)
    // Simulated gateway confirm — order is placed only after this step
    await new Promise((r) => setTimeout(r, 900))

    const address = [draft.address, draft.city, draft.state, draft.pincode]
      .filter(Boolean)
      .join(', ')

    const order = placeOrder({
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      address,
      payment: method,
    })

    setPaying(false)
    if (!order) {
      setError('Could not confirm payment. Please try again.')
      return
    }
    clearCheckoutDraft()
    setDoneId(order.id)
  }

  const field =
    'mt-1.5 w-full rounded-xl border border-bb-border bg-white px-3.5 py-3 text-sm outline-none focus:border-bb-blue'

  return (
    <main className="mx-auto max-w-[920px] px-3 py-8 sm:px-4 sm:py-10 lg:px-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-bb-muted uppercase">
        Pay online
      </p>
      <h1 className="font-serif mt-2 text-3xl text-bb-text sm:text-4xl">
        Pay {formatMoney(draft.total)}
      </h1>
      <p className="mt-2 text-sm text-bb-muted">
        Choose UPI QR, debit/credit card, or net banking. Order is placed only
        after payment confirmation.
      </p>

      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={confirmPayment}
          className="order-2 rounded-2xl border border-bb-border bg-white p-4 sm:p-6 lg:order-1"
        >
          <div className="-mx-1 flex gap-2 overflow-x-auto border-b border-bb-border px-1 pb-4">
            {(
              [
                ['upi', 'UPI QR', Smartphone],
                ['card', 'Debit / Credit', CreditCard],
                ['netbanking', 'Net banking', Building2],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  const current = readCheckoutDraft()
                  if (current) {
                    saveCheckoutDraft({ ...current, payment: id })
                    setDraft({ ...current, payment: id })
                  }
                  navigate(`/payment?method=${id}`, { replace: true })
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2.5 text-[0.65rem] font-semibold tracking-wide uppercase transition sm:text-xs ${
                  method === id
                    ? 'bg-bb-blue text-[#f7f3ec]'
                    : 'border border-bb-border text-bb-muted hover:text-bb-text'
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          {method === 'upi' && (
            <div className="mt-6 text-center">
              <div className="mx-auto inline-flex items-center gap-2 text-sm font-semibold text-bb-text">
                <QrCode className="size-4 text-bb-blue" />
                Scan UPI QR
              </div>
              <div className="mx-auto mt-4 grid size-[min(240px,70vw)] place-items-center rounded-2xl border border-bb-border bg-[#faf8f4] p-3">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="UPI payment QR code"
                    width={220}
                    height={220}
                    className="size-full max-w-[220px] object-contain"
                  />
                ) : null}
              </div>
              <p className="mt-4 text-sm text-bb-muted">
                Pay to{' '}
                <span className="font-semibold text-bb-text">{UPI_VPA}</span>
              </p>
              <p className="mt-1 text-xs text-bb-muted">
                Amount {formatMoney(draft.total)} · Ref {txnRef}
              </p>
              <a
                href={upiLink}
                className="mt-4 inline-flex text-xs font-semibold tracking-[0.14em] text-bb-blue uppercase underline-offset-2 hover:underline"
              >
                Open in UPI app
              </a>
            </div>
          )}

          {method === 'card' && (
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold">
                Card number
                <input
                  className={field}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={card.number}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, number: e.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-semibold">
                Name on card
                <input
                  className={field}
                  autoComplete="cc-name"
                  value={card.name}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">
                  Expiry (MM/YY)
                  <input
                    className={field}
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, expiry: e.target.value }))
                    }
                  />
                </label>
                <label className="block text-sm font-semibold">
                  CVV
                  <input
                    className={field}
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, cvv: e.target.value }))
                    }
                  />
                </label>
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold">Select bank</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {BANKS.map((b) => (
                  <label
                    key={b}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                      bank === b
                        ? 'border-bb-blue bg-bb-blue/5'
                        : 'border-bb-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bank"
                      checked={bank === b}
                      onChange={() => setBank(b)}
                      className="accent-bb-blue"
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-bb-save">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={paying}
            className="mt-6 w-full rounded-full bg-bb-blue py-3.5 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase disabled:opacity-60"
          >
            {paying
              ? 'Confirming…'
              : method === 'upi'
                ? `I've paid · ${formatMoney(draft.total)}`
                : `Pay now · ${formatMoney(draft.total)}`}
          </button>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-3 w-full text-center text-xs tracking-wide text-bb-muted uppercase hover:text-bb-text"
          >
            Back to checkout
          </button>
        </form>

        <aside className="order-1 h-fit rounded-2xl border border-bb-border bg-white p-4 sm:p-5 lg:order-2 lg:sticky lg:top-28">
          <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {draft.items.map((item) => (
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
            <span>{formatMoney(draft.total)}</span>
          </div>
          <p className="mt-3 text-xs text-bb-muted">
            Deliver to {draft.pincode}
            {draft.city ? ` · ${draft.city}` : ''}
          </p>
        </aside>
      </div>
    </main>
  )
}
