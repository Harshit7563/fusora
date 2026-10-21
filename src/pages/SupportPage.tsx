import { Link } from 'react-router-dom'
import { Mail, MessageCircle } from 'lucide-react'
import {
  COMPANY_NAME,
  GRIEVANCE_EMAIL,
  GRIEVANCE_OFFICER,
  POLICY_EFFECTIVE_DATE,
  SITE_DOMAIN,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { policies } from '../policies'

const faqs = [
  {
    q: 'How long will my order take to arrive?',
    a: 'Orders are dispatched from our Maharashtra fulfilment centre and typically arrive within 1–7 days depending on your pincode. You will receive tracking details by email and SMS as soon as your order ships, and you can follow it any time from Order status.',
  },
  {
    q: 'How do I verify my email?',
    a: 'On Create account or Sign in, enter your email and tap Send OTP. We email you a one-time code — enter it to verify and continue. No password to remember, nothing to reset.',
  },
  {
    q: 'How do returns and refunds work?',
    a: 'Eligible items can be returned within 7 days of delivery: email us your Order ID at shopsupportfusora@gmail.com and keep the item unused with tags intact. Once the returned item reaches us and passes quality check (QC), we initiate your refund within 5–10 business days; your bank or payment account is then credited within a further 3–7 business days.',
  },
  {
    q: 'How can I pay?',
    a: 'Pay securely online with UPI, cards or net banking via Razorpay. Cash on Delivery (COD) is available on orders of ₹2,000 and above.',
  },
  {
    q: 'Need help with a size or fabric?',
    a: 'Every product page lists its fabric, colour and what is included. Still unsure? Email us the product name and your usual size at shopsupportfusora@gmail.com and we will help you choose.',
  },
]

export function SupportPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold">Support & Services</h1>
      <p className="mt-2 text-bb-muted">
        Questions about an order, a size, a delivery or a return? We&rsquo;re
        here to help on{' '}
        <span className="font-semibold text-bb-text">{SITE_DOMAIN}</span> —
        operated by {COMPANY_NAME}.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-bb-blue/20 bg-bb-blue/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center bg-bb-blue text-white">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="font-bold text-bb-text">Email support</p>
            <p className="text-sm text-bb-muted">
              Mon–Sat, 9 AM – 6 PM · we usually reply within 24 hours.
            </p>
          </div>
        </div>
        <a
          href={SUPPORT_MAILTO}
          className="inline-flex items-center justify-center gap-2 bg-bb-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-bb-blue-dark"
        >
          <MessageCircle className="size-4" />
          {SUPPORT_EMAIL}
        </a>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: 'Order status',
            to: '/orders',
            body: 'Track your orders & delivery status',
          },
          {
            title: 'Delivery & returns',
            to: '/policies/returns-refunds',
            body: '7-day returns on eligible items',
          },
          {
            title: 'Account help',
            to: '/account',
            body: 'Sign in or create an account',
          },
          {
            title: 'Legal policies',
            to: '/policies',
            body: 'Terms, privacy, shipping & more',
          },
        ].map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="rounded-2xl border border-bb-border p-5 transition hover:border-bb-blue"
          >
            <h2 className="font-bold text-bb-text">{card.title}</h2>
            <p className="mt-1 text-sm text-bb-muted">{card.body}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Company policies</h2>
      <p className="mt-1 text-sm text-bb-muted">
        Effective {POLICY_EFFECTIVE_DATE} · {COMPANY_NAME}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {policies.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/policies/${p.slug}`}
              className="block rounded-xl border border-bb-border px-4 py-3 text-sm font-semibold text-bb-link hover:border-bb-blue"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-bb-border bg-bb-gray/50 p-5 text-sm">
        <p className="font-bold text-bb-text">Grievance Officer</p>
        <p className="mt-1 text-bb-muted">
          {GRIEVANCE_OFFICER} ·{' '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-bb-link">
            {GRIEVANCE_EMAIL}
          </a>
        </p>
      </div>

      <h2 className="mt-12 text-xl font-bold">FAQs</h2>
      <ul className="mt-4 space-y-4">
        {faqs.map((f) => (
          <li key={f.q} className="rounded-xl bg-bb-gray p-4">
            <p className="font-semibold">{f.q}</p>
            <p className="mt-1 text-sm text-bb-muted">{f.a}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
