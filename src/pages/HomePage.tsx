import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { CategoryStrip } from '../components/CategoryStrip'
import { Hero } from '../components/Hero'
import { TrendingDeals } from '../components/TrendingDeals'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'

export function HomePage() {
  usePageTitle()
  return (
    <main>
      <Hero />

      <section className="bg-fusora-ivory px-3 py-12 sm:px-4 sm:py-16 lg:px-8">
        <div className="mx-auto flex max-w-3xl gap-5">
          <span className="mt-1 hidden h-16 w-px shrink-0 bg-bb-blue/40 sm:block" />
          <div>
            <p className="font-serif text-[1.45rem] leading-snug text-bb-text sm:text-3xl">
              Not everything listed deserves to be owned.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-bb-muted sm:mt-4">
              For discerning shoppers, Fusora brings apparel, travel, jewellery,
              and lifestyle essentials under one curated roof — clear prices,
              honest policies, and delivery you can trust.
            </p>
          </div>
        </div>
      </section>

      <CategoryStrip />
      <TrendingDeals />

      <section className="relative overflow-hidden bg-bb-gray px-3 py-14 text-center sm:px-4 sm:py-20 lg:px-8">
        <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
          Membership
        </p>
        <h2 className="text-display mx-auto mt-3 max-w-xl text-[1.65rem] leading-snug text-bb-text sm:text-4xl">
          Fusora Membership — quieter shopping, better value.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-bb-muted">
          ₹1,095 for 365 days of member benefits across the catalogue.
        </p>
        <Link
          to="/memberships"
          className="mt-8 inline-flex rounded-full bg-bb-blue px-7 py-3 text-xs font-semibold tracking-[0.18em] text-[#f7f3ec] uppercase hover:bg-bb-blue-dark"
        >
          Explore membership
        </Link>
      </section>

      <section className="bg-white px-4 py-14 text-center lg:px-8">
        <p className="text-sm text-bb-muted">
          Looking for something specific?{' '}
          <Link to="/deals" className="font-semibold text-bb-text underline-offset-4 hover:underline">
            Browse the full edit
          </Link>
          {' · '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-bb-text underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </main>
  )
}
