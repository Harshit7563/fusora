import { Link } from 'react-router-dom'
import {
  COMPANY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { policies } from '../policies'
import { FusoraLogo } from './FusoraLogo'

const cols = [
  {
    title: 'Shop',
    links: [
      { label: 'Sarees', to: '/category/apparel-accessories/sarees' },
      { label: 'Jeans', to: '/category/apparel-accessories/jeans' },
      { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
      { label: 'Luggage', to: '/category/luggage-bags-cases' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping', to: '/policies/shipping-policy' },
      { label: 'Returns & refunds', to: '/policies/return-refund-policy' },
      { label: 'Support', to: '/support' },
      { label: 'My orders', to: '/orders' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/about' },
      { label: 'Memberships', to: '/memberships' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'All policies', to: '/policies' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-bb-border bg-white text-bb-text">
      <div className="mx-auto max-w-[1400px] px-4 py-14 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <FusoraLogo centered compact />
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bb-muted">
            Designer wear for every occasion — chosen with care, never crowded.
          </p>
          <a
            href={SUPPORT_MAILTO}
            className="mt-4 text-[0.7rem] tracking-[0.14em] text-bb-muted uppercase transition hover:text-bb-text"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {cols.map((col) => (
            <div key={col.title} className="text-center sm:text-left">
              <h3 className="mb-4 text-[0.7rem] font-semibold tracking-[0.18em] text-bb-text uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-bb-muted transition hover:text-bb-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-bb-border bg-[#fae3ca]/45">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-5 text-xs text-bb-muted lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 lg:justify-start">
            {policies.slice(0, 6).map((p) => (
              <Link
                key={p.slug}
                to={`/policies/${p.slug}`}
                className="hover:text-bb-text"
              >
                {p.title}
              </Link>
            ))}
          </div>
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME}. Brand Fusora (
            <a href={SITE_URL} className="hover:text-bb-text">
              {SITE_DOMAIN}
            </a>
            ).
          </p>
        </div>
      </div>
    </footer>
  )
}
