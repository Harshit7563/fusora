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
    title: 'Orders',
    links: [
      { label: 'Shipping', to: '/policies/shipping-policy' },
      { label: 'Returns & refunds', to: '/policies/return-refund-policy' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Cart', to: '/cart' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Terms', to: '/policies/terms-and-conditions' },
      { label: 'Privacy', to: '/policies/privacy-policy' },
      { label: 'Disclaimer', to: '/policies/disclaimer' },
      {
        label: 'Grievance',
        to: '/policies/grievance-redressal-policy',
      },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/about' },
      { label: 'Memberships', to: '/memberships' },
      { label: 'Support', to: '/support' },
      { label: 'All policies', to: '/policies' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-bb-border bg-bb-blue text-[#fbf7f2]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <FusoraLogo onDark />
          <p className="mt-6 max-w-lg font-serif text-2xl leading-snug text-[#f3e8d8] italic sm:text-3xl">
            Designer wear for every occasion — chosen, never crowded.
          </p>
          <a
            href={SUPPORT_MAILTO}
            className="mt-6 text-[0.68rem] tracking-[0.2em] text-[#f3e8d8]/85 uppercase transition hover:text-white"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[0.65rem] font-semibold tracking-[0.22em] text-fusora-gold uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#fbf7f2]/85 transition hover:text-white"
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

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-6 text-xs text-[#f3e8d8]/75 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 lg:justify-start">
            {policies.map((p) => (
              <Link
                key={p.slug}
                to={`/policies/${p.slug}`}
                className="hover:text-white"
              >
                {p.title}
              </Link>
            ))}
          </div>
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME}. Brand Fusora (
            <a href={SITE_URL} className="hover:text-white">
              {SITE_DOMAIN}
            </a>
            ).
          </p>
        </div>
      </div>
    </footer>
  )
}
