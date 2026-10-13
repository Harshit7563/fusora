import {
  Check,
  Gift,
  Headphones,
  Package,
  Percent,
  Shield,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE_DOMAIN, SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'
import { FusoraLogo } from '../components/FusoraLogo'

const PRICE = 1095
const DAYS = 365

const perks = [
  {
    icon: Truck,
    title: 'Free express delivery',
    body: 'Unlimited free express shipping on eligible orders for a full year.',
  },
  {
    icon: Percent,
    title: 'Member-only deals',
    body: 'Early access to Top Deals and exclusive member markdowns.',
  },
  {
    icon: Package,
    title: 'Priority store pickup',
    body: 'Skip the line — your order jumps the hub queue when stock is ready.',
  },
  {
    icon: Headphones,
    title: 'Priority support',
    body: 'Faster replies from shopsupportfusora@gmail.com and specialist chat.',
  },
  {
    icon: Shield,
    title: 'Extended returns',
    body: 'Enjoy 30-day returns on most items instead of the standard 15.',
  },
  {
    icon: Gift,
    title: 'Birthday & festival offers',
    body: 'Surprise vouchers and seasonal member rewards throughout the year.',
  },
]

const faqs = [
  {
    q: 'How long does membership last?',
    a: `Fusora Membership is valid for ${DAYS} days (1 full year) from the day you activate.`,
  },
  {
    q: 'Can I cancel?',
    a: 'Contact shopsupportfusora@gmail.com within 7 days of purchase for a full refund if you haven’t used member benefits.',
  },
  {
    q: 'Is it linked to my account?',
    a: 'Yes — once you join, benefits apply to your fusora.shop account at every hub and online order.',
  },
]

export function MembershipsPage() {
  const [joined, setJoined] = useState(false)
  const perDay = (PRICE / DAYS).toFixed(2)

  return (
    <main className="bg-bb-gray/40">
      {/* Hero */}
      <section className="relative overflow-hidden bg-bb-blue text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,242,0,0.22),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-6 lg:py-16">
          <div>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="size-3.5 text-bb-yellow" />
              My Fusora Memberships
            </p>
            <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              One year of better shopping on{' '}
              <span className="text-bb-yellow">{SITE_DOMAIN}</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-white/80 sm:text-lg">
              Unlock free express delivery, member deals, and priority pickup —
              all for a simple yearly plan.
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-4">
              <div>
                <p className="text-sm text-white/70">Membership · {DAYS} days</p>
                <p className="font-display text-5xl font-extrabold tracking-tight">
                  ₹{PRICE.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-sm text-white/65">
                  Just ₹{perDay}/day · billed once a year
                </p>
              </div>
            </div>
          </div>

          {/* Pricing card */}
          <div className="rounded-2xl bg-white p-6 text-bb-text shadow-xl sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <FusoraLogo />
              <span className="rounded-full bg-bb-yellow px-3 py-1 text-xs font-bold">
                Best value
              </span>
            </div>
            <h2 className="text-xl font-bold">Fusora Membership</h2>
            <p className="mt-1 text-sm text-bb-muted">
              Full access for {DAYS} days
            </p>
            <p className="mt-5 text-4xl font-extrabold tracking-tight">
              ₹{PRICE.toLocaleString('en-IN')}
              <span className="text-base font-semibold text-bb-muted">
                {' '}
                / year
              </span>
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                'Free express delivery',
                'Member-only deals',
                'Priority hub pickup',
                '30-day extended returns',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setJoined(true)}
              className="mt-6 w-full rounded-full bg-bb-yellow py-3.5 text-sm font-bold text-bb-text hover:brightness-95"
            >
              {joined ? 'Membership added ✓' : 'Join for ₹1,095 / year'}
            </button>
            {joined && (
              <p className="mt-3 text-center text-xs text-bb-muted">
                Demo join — checkout coming soon. Questions?{' '}
                <a href={SUPPORT_MAILTO} className="text-bb-link hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            )}
            <p className="mt-3 text-center text-[11px] text-bb-muted">
              Auto-renew optional. Cancel anytime before renewal.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 lg:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              What’s included
            </h2>
            <p className="mt-1 text-sm text-bb-muted">
              Everything you need for a smoother year of shopping
            </p>
          </div>
          <span className="hidden items-center gap-1 rounded-full bg-bb-blue/10 px-3 py-1 text-xs font-bold text-bb-blue sm:inline-flex">
            <Zap className="size-3.5" />
            ₹{PRICE} · {DAYS} days
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-bb-border bg-white p-5 shadow-sm"
            >
              <span className="grid size-10 place-items-center rounded-full bg-bb-blue/10 text-bb-blue">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-3 font-bold text-bb-text">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-bb-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Compare strip */}
      <section className="mx-auto max-w-[1400px] px-4 pb-12 lg:px-6">
        <div className="overflow-hidden rounded-2xl border border-bb-border bg-white">
          <div className="border-b border-bb-border bg-bb-gray/60 px-5 py-4">
            <h2 className="text-lg font-bold">Member vs Guest</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-bb-border">
                  <th className="px-5 py-3 font-semibold">Benefit</th>
                  <th className="px-5 py-3 font-semibold text-bb-blue">
                    Member
                  </th>
                  <th className="px-5 py-3 font-semibold text-bb-muted">Guest</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Express delivery', 'Free', 'Paid'],
                  ['Member-only deals', 'Yes', 'No'],
                  ['Return window', '30 days', '15 days'],
                  ['Support priority', 'Priority', 'Standard'],
                  ['Hub pickup queue', 'Priority', 'Standard'],
                ].map(([benefit, member, guest], i) => (
                  <tr
                    key={benefit}
                    className={i % 2 === 0 ? 'bg-bb-gray/40' : ''}
                  >
                    <td className="px-5 py-3 font-medium">{benefit}</td>
                    <td className="px-5 py-3 font-semibold text-bb-blue">
                      {member}
                    </td>
                    <td className="px-5 py-3 text-bb-muted">{guest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">FAQs</h2>
            <ul className="mt-4 space-y-3">
              {faqs.map((f) => (
                <li
                  key={f.q}
                  className="rounded-xl border border-bb-border bg-white p-4"
                >
                  <p className="font-semibold">{f.q}</p>
                  <p className="mt-1 text-sm text-bb-muted">{f.a}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-bb-blue p-8 text-white">
            <h2 className="text-2xl font-bold">Ready to join?</h2>
            <p className="mt-2 text-white/80">
              ₹{PRICE.toLocaleString('en-IN')} for {DAYS} days of Fusora
              Membership — less than a coffee a week.
            </p>
            <button
              type="button"
              onClick={() => {
                setJoined(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="mt-6 rounded-full bg-bb-yellow px-6 py-3 text-sm font-bold text-bb-text hover:brightness-95"
            >
              Get Membership — ₹1,095
            </button>
            <Link
              to="/support"
              className="mt-4 text-sm font-semibold text-white/90 underline-offset-2 hover:underline"
            >
              Talk to support first
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
