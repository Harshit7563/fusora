import {
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  Smartphone,
} from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { formatMoney } from '../data'
import { useStore } from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  clearCheckoutDraft,
  readCheckoutDraft,
  saveCheckoutDraft,
  type PaymentMethod,
} from '../lib/checkoutDraft'
import {
  createRazorpayQr,
  fetchRazorpayQrStatus,
  payWithRazorpay,
  type RazorpayQr,
} from '../lib/razorpay'

export function PaymentPage() {
  usePageTitle('Payment')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { placeOrder, cart, isLoggedIn } = useStore()
  const [draft, setDraft] = useState(() => readCheckoutDraft())
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [doneId, setDoneId] = useState<string | null>(null)

  const [paidPaymentId, setPaidPaymentId] = useState<string | null>(null)
  const [rzpQr, setRzpQr] = useState<RazorpayQr | null>(null)
  const [qrElapsed, setQrElapsed] = useState(1)
  const qrDoneRef = useRef(false)

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

  // QR opening timer — counts up from 00:01 while the QR is being prepared
  useEffect(() => {
    if (method !== 'upi' || rzpQr) return
    setQrElapsed(1)
    const timer = window.setInterval(
      () => setQrElapsed((s) => s + 1),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [method, rzpQr])

  const qrTimerLabel = `${String(Math.floor(qrElapsed / 60)).padStart(2, '0')}:${String(qrElapsed % 60).padStart(2, '0')}`

  // Razorpay UPI QR: create one fixed-amount QR per checkout.
  // If QR is not activated yet, retry every 15s so it appears automatically.
  useEffect(() => {
    if (method !== 'upi' || !draft || doneId || rzpQr) return
    let cancelled = false
    const attempt = () => {
      createRazorpayQr({
        amountRupees: draft.total,
        receipt: `fus_${draft.createdAt ?? Date.now()}`,
      })
        .then((qr) => {
          if (!cancelled) setRzpQr(qr)
        })
        .catch(() => {
          // QR not active yet — the opening timer keeps running until it appears
        })
    }
    attempt()
    const retry = window.setInterval(attempt, 15000)
    return () => {
      cancelled = true
      window.clearInterval(retry)
    }
  }, [method, draft, doneId, rzpQr])

  // Poll Razorpay QR status — auto place order once payment is captured
  useEffect(() => {
    if (method !== 'upi' || !rzpQr || !draft || doneId || qrDoneRef.current)
      return
    const timer = window.setInterval(async () => {
      try {
        const status = await fetchRazorpayQrStatus(rzpQr.qr_id)
        if (!status.paid || qrDoneRef.current) return
        qrDoneRef.current = true
        const address = [draft.address, draft.city, draft.state, draft.pincode]
          .filter(Boolean)
          .join(', ')
        const order = placeOrder({
          name: draft.name,
          phone: draft.phone,
          email: draft.email,
          address,
          payment: 'upi',
          paymentId: status.payment_id || undefined,
        })
        if (order) {
          if (status.payment_id) setPaidPaymentId(status.payment_id)
          clearCheckoutDraft()
          setDoneId(order.id)
        } else {
          qrDoneRef.current = false
        }
      } catch {
        // keep polling — transient network errors are expected
      }
    }, 4000)
    return () => window.clearInterval(timer)
  }, [method, rzpQr, draft, doneId, placeOrder])

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-14 text-center">
        <Lock className="mx-auto size-10 text-bb-blue" />
        <h1 className="font-serif mt-4 text-3xl">Sign in to pay</h1>
        <Link
          to="/account?next=/payment"
          className="mt-6 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
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
        <h1 className="font-serif mt-4 text-3xl text-bb-text">
          Payment successful
        </h1>
        <p className="mt-3 text-sm text-bb-muted">
          Order ID <strong className="text-bb-text">{doneId}</strong>
        </p>
        {paidPaymentId && (
          <p className="mt-2 text-xs text-bb-muted">
            Razorpay Payment ID{' '}
            <strong className="text-bb-text tracking-wide">
              {paidPaymentId}
            </strong>{' '}
            · Verified
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={`/orders/${doneId}`}
            className="bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
          >
            Track order
          </Link>
          <Link
            to="/orders"
            className="border border-bb-border px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
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
          className="mt-6 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
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

  // Card / NetBanking go through Razorpay Standard Checkout.
  // Card details are entered only inside Razorpay's secure modal —
  // Fusora never stores card number / CVV on its own systems.

    setPaying(true)
    let razorpayPaymentId: string | undefined

    if (method === 'card' || method === 'netbanking') {
      try {
        const paid = await payWithRazorpay({
          amountRupees: draft.total,
          receipt: `fus_${Date.now()}`,
          name: draft.name,
          email: draft.email,
          phone: draft.phone,
          description: `Fusora order · ${method === 'card' ? 'Card' : 'NetBanking'}`,
          method:
            method === 'card'
              ? { card: true, netbanking: false, upi: false, wallet: false }
              : { card: false, netbanking: true, upi: false, wallet: false },
        })
        setPaidPaymentId(paid.razorpay_payment_id)
        razorpayPaymentId = paid.razorpay_payment_id
      } catch (err) {
        setPaying(false)
        setError(
          err instanceof Error
            ? err.message
            : 'Payment could not be completed. Please try again.',
        )
        return
      }
    }

    const address = [draft.address, draft.city, draft.state, draft.pincode]
      .filter(Boolean)
      .join(', ')

    const order = placeOrder({
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      address,
      payment: method,
      paymentId: razorpayPaymentId,
    })

    setPaying(false)
    if (!order) {
      setError('Could not confirm payment. Please try again.')
      return
    }
    clearCheckoutDraft()
    setDoneId(order.id)
  }

  return (
    <main className="mx-auto max-w-[920px] px-3 py-8 sm:px-4 sm:py-10 lg:px-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-bb-muted uppercase">
        Pay online
      </p>
      <h1 className="font-serif mt-2 text-3xl text-bb-text sm:text-4xl">
        Pay {formatMoney(draft.total)}
      </h1>
      <p className="mt-2 text-sm text-bb-muted">
        Choose UPI QR, debit/credit card, or net banking. Your order is
        confirmed automatically as soon as the UPI QR payment is received.
      </p>

      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={confirmPayment}
          className="order-2 border border-bb-border bg-white p-4 sm:p-6 lg:order-1"
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
                className={`inline-flex shrink-0 items-center gap-2 px-3.5 py-2.5 text-[0.65rem] font-semibold tracking-wide uppercase transition sm:text-xs ${
                  method === id
                    ? 'bg-bb-blue text-white'
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
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bb-border bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                  <span aria-hidden className="text-sm font-black">
                    <span className="text-[#4285F4]">G</span>
                  </span>
                  <span>
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                    <span className="ml-1 text-[#5F6368]">Pay</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bb-border bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                  <span
                    aria-hidden
                    className="grid size-5 place-items-center rounded-full bg-[#5F259F] text-[9px] font-black text-white"
                  >
                    Pe
                  </span>
                  <span className="text-[#5F259F]">PhonePe</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bb-border bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                  <span aria-hidden className="font-black italic">
                    <span className="text-[#002E6E]">pay</span>
                    <span className="text-[#00B9F1]">tm</span>
                  </span>
                  <span className="text-[#002E6E]">Paytm</span>
                </span>
              </div>
              <p className="mt-2 text-[11px] text-bb-muted">
                Scan with Google Pay, PhonePe, Paytm or any UPI app
              </p>
              {rzpQr ? (
                <>
                  <div className="mx-auto mt-4 grid size-[min(240px,70vw)] place-items-center border border-bb-border bg-[#f5f5f5] p-3">
                    <img
                      src={rzpQr.image_url}
                      alt="Razorpay UPI payment QR code"
                      width={220}
                      height={220}
                      className="size-full max-w-[220px] object-contain"
                    />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-bb-text">
                    Razorpay UPI QR · {formatMoney(draft.total)}
                  </p>
                  <p className="mt-1 animate-pulse text-xs font-medium text-green-700">
                    Waiting for payment… Scan with GPay / PhonePe / Paytm —
                    your order will be confirmed automatically once the
                    payment is received.
                  </p>
                </>
              ) : (
                <div className="mx-auto mt-4 max-w-md border border-bb-border bg-bb-cream/60 p-4">
                  <p className="text-sm font-semibold text-bb-text">
                    Razorpay UPI QR is being activated
                  </p>
                  <p className="mt-1 text-xs leading-5 text-bb-muted">
                    Your QR code will appear here automatically once
                    activation is complete. Meanwhile, you can pay by Debit /
                    Credit Card or NetBanking.
                  </p>
                  <p className="mt-3 animate-pulse text-xs font-bold tracking-[0.18em] text-bb-blue uppercase">
                    Opening QR · {qrTimerLabel}
                  </p>
                </div>
              )}
            </div>
          )}

          {method === 'card' && (
            <div className="mt-6 border border-bb-border bg-bb-cream/60 p-4 text-left">
              <p className="text-sm font-semibold text-bb-text">
                Secure card payment via Razorpay
              </p>
              <p className="mt-1 text-xs leading-5 text-bb-muted">
                Click "Pay securely" below — a Razorpay secure window will
                open to enter your card details. Fusora never stores your
                card number or CVV.
              </p>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="mt-6 border border-bb-border bg-bb-cream/60 p-4 text-left">
              <p className="text-sm font-semibold text-bb-text">
                NetBanking via Razorpay
              </p>
              <p className="mt-1 text-xs leading-5 text-bb-muted">
                Click "Pay securely" below — choose your bank in the
                Razorpay secure window and complete the payment on your
                bank page.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-bb-save">
              {error}
            </p>
          )}

          {method === 'upi' ? (
            <p className="mt-6 w-full border border-dashed border-bb-border py-3.5 text-center text-xs font-semibold tracking-[0.16em] text-bb-muted uppercase">
              {rzpQr
                ? 'Scan QR to pay — no button needed'
                : `Opening QR · ${qrTimerLabel}`}
            </p>
          ) : (
            <button
              type="submit"
              disabled={paying}
              className="mt-6 w-full bg-bb-blue py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase disabled:opacity-60"
            >
              {paying
                ? 'Submitting…'
                : `Pay securely · ${formatMoney(draft.total)}`}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-3 w-full text-center text-xs tracking-wide text-bb-muted uppercase hover:text-bb-text"
          >
            Back to checkout
          </button>
        </form>

        <aside className="order-1 h-fit border border-bb-border bg-[#f5f5f5] p-4 sm:p-5 lg:order-2 lg:sticky lg:top-28">
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
