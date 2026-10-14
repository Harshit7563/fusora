import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import {
  COMPANY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { FusoraLogo } from '../components/FusoraLogo'

export function AboutPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-14 lg:px-8">
      <FusoraLogo />
      <p className="mt-10 text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
        Our story
      </p>
      <h1 className="text-display mt-3 text-4xl text-bb-text sm:text-5xl">
        Chosen for how you live.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-bb-muted">
        Fusora is the shopping brand of{' '}
        <span className="font-semibold text-bb-text">{COMPANY_NAME}</span>,
        at{' '}
        <a
          href={SITE_URL}
          className="font-semibold text-bb-text underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {SITE_DOMAIN}
        </a>
        . We curate electronics, apparel, travel, and lifestyle essentials —
        with clear pricing, honest policies, and delivery across India.
      </p>

      <div className="mt-8 border border-bb-border bg-white p-6">
        <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-bb-muted uppercase">
          Contact
        </p>
        <a
          href={SUPPORT_MAILTO}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-bb-text hover:underline"
        >
          <Mail className="size-4" />
          {SUPPORT_EMAIL}
        </a>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/deals"
          className="bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
        >
          Shop the edit
        </Link>
        <Link
          to="/support"
          className="border border-bb-border px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
        >
          Reach us
        </Link>
      </div>
    </main>
  )
}
