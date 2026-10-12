import type { CartItem } from '../data'

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking'

export type CheckoutDraft = {
  name: string
  phone: string
  email: string
  address: string
  pincode: string
  city: string
  state: string
  payment: Exclude<PaymentMethod, 'cod'>
  total: number
  items: CartItem[]
  createdAt: number
}

const KEY = 'fusora-checkout-draft'

export function saveCheckoutDraft(draft: CheckoutDraft) {
  sessionStorage.setItem(KEY, JSON.stringify(draft))
}

export function readCheckoutDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CheckoutDraft
    if (!parsed?.payment || !Array.isArray(parsed.items)) return null
    // expire after 2 hours
    if (Date.now() - (parsed.createdAt || 0) > 2 * 60 * 60 * 1000) {
      clearCheckoutDraft()
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearCheckoutDraft() {
  sessionStorage.removeItem(KEY)
}

export function buildUpiPayUrl(opts: {
  pa: string
  pn: string
  am: number
  tr: string
}): string {
  const params = new URLSearchParams({
    pa: opts.pa,
    pn: opts.pn,
    am: opts.am.toFixed(2),
    cu: 'INR',
    tn: `Fusora order ${opts.tr}`,
    tr: opts.tr,
  })
  return `upi://pay?${params.toString()}`
}

export function upiQrImageUrl(upiLink: string, size = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiLink)}`
}
