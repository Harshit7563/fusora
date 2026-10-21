/** Razorpay Standard Web Checkout — frontend helpers (no secret here). */

export type RazorpaySuccess = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  method?: Record<string, unknown>
  handler: (resp: RazorpaySuccess) => void
  modal?: { ondismiss?: () => void }
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void
      on: (
        event: 'payment.failed',
        cb: (resp: { error?: { description?: string } }) => void,
      ) => void
    }
  }
}

let scriptPromise: Promise<void> | null = null

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined')
    return Promise.reject(new Error('No window'))
  if (window.Razorpay) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-fusora-razorpay]',
    )
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Razorpay checkout')),
      )
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.fusoraRazorpay = '1'
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('Failed to load Razorpay checkout'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

async function api<T>(path: string, body: unknown): Promise<T> {
  // Prefer .php on production (nginx); Vite plugin accepts both
  let url = path
  if (!/\.php(\?|$)/.test(path)) url = `${path}.php`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as T & {
    ok?: boolean
    message?: string
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Payment request failed (${res.status})`)
  }
  return data
}

export async function createRazorpayOrder(input: {
  amountRupees: number
  receipt: string
}) {
  const amount = Math.round(input.amountRupees * 100)
  if (amount < 100) throw new Error('Minimum amount is ₹1')
  return api<{
    order_id: string
    amount: number
    currency: string
    key_id: string
  }>('/api/razorpay/create-order', {
    amount,
    currency: 'INR',
    receipt: input.receipt,
  })
}

export async function verifyRazorpayPayment(payload: RazorpaySuccess) {
  return api<{ verified: boolean; message: string }>(
    '/api/razorpay/verify-payment',
    payload,
  )
}

export type RazorpayQr = {
  qr_id: string
  image_url: string
  amount: number
  currency: string
  status: string
}

/** Create a single-use, fixed-amount UPI QR for this order. */
export async function createRazorpayQr(input: {
  amountRupees: number
  receipt: string
}): Promise<RazorpayQr> {
  const amount = Math.round(input.amountRupees * 100)
  if (amount < 100) throw new Error('Minimum amount is ₹1')
  return api<RazorpayQr>('/api/razorpay/create-qr', {
    amount,
    receipt: input.receipt,
  })
}

export async function fetchRazorpayQrStatus(qrId: string): Promise<{
  paid: boolean
  payment_id: string | null
  status: string | null
  payments_count: number
}> {
  const url = `/api/razorpay/qr-status.php?qr_id=${encodeURIComponent(qrId)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean
    message?: string
    paid: boolean
    payment_id: string | null
    status: string | null
    payments_count: number
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `QR status failed (${res.status})`)
  }
  return data
}

/**
 * Full flow: create order → open modal → verify signature.
 * Resolves only after the server verifies the signature.
 * Rejects on dismiss / failure with a user-readable message.
 */
export async function payWithRazorpay(input: {
  amountRupees: number
  receipt: string
  name: string
  email: string
  phone: string
  description?: string
  /** Razorpay method hint, e.g. { card: true, netbanking: true, upi: false } */
  method?: Record<string, unknown>
}): Promise<RazorpaySuccess> {
  const order = await createRazorpayOrder(input)
  await loadRazorpayScript()
  if (!window.Razorpay) throw new Error('Razorpay checkout failed to load')

  const verified = await new Promise<RazorpaySuccess>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: 'Fusora',
      description: input.description || 'Fusora order payment',
      order_id: order.order_id,
      prefill: {
        name: input.name,
        email: input.email,
        contact: input.phone,
      },
      theme: { color: '#cf2028' },
      method: input.method,
      handler: (resp) => resolve(resp),
      modal: {
        ondismiss: () =>
          reject(new Error('Payment cancelled. You closed the payment window.')),
      },
    })
    rzp.on('payment.failed', (resp) => {
      reject(
        new Error(
          resp.error?.description ||
            'Payment failed. Please try another method.',
        ),
      )
    })
    rzp.open()
  })

  const result = await verifyRazorpayPayment(verified)
  if (!result.verified) throw new Error('Payment verification failed')
  return verified
}
