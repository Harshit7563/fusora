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
    q: 'How does store pickup work?',
    a: 'Order online at fusora.shop, pick a Fusora hub, and collect in as little as 1 hour when inventory is available.',
  },
  {
    q: 'How do I verify my email?',
    a: 'On Create account or Sign in, enter your email and tap Send OTP. We email a one-time code via EmailJS. Enter the OTP to verify, then continue.',
  },
  {
    q: 'How do returns work?',
    a: 'See our Return & Refund Policy. Most unused items can be returned within the stated window with invoice. Questions? Write to shopsupportfusora@gmail.com.',
  },
]

export function SupportPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold">Support & Services</h1>
      <p className="mt-2 text-bb-muted">
        We’re here for setup help, repairs, and order questions on{' '}
        <span className="font-semibold text-bb-text">{SITE_DOMAIN}</span> —
        operated by {COMPANY_NAME}.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-bb-blue/20 bg-bb-blue/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bb-blue text-white">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="font-bold text-bb-text">Email support</p>
            <p className="text-sm text-bb-muted">
              We usually reply within 24 hours.
            </p>
          </div>
        </div>
        <a
          href={SUPPORT_MAILTO}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-bb-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-bb-blue-dark"
        >
          <MessageCircle className="size-4" />
          {SUPPORT_EMAIL}
        </a>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: 'Order status',
            to: '/cart',
            body: 'Track or update your cart & pickup',
          },
          {
            title: 'Find a store',
            to: '/stores',
            body: 'Hours, inventory, and directions',
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
