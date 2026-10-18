import { Link } from 'react-router-dom'
import {
  COMPANY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { FusoraLogo } from './FusoraLogo'

const cols = [
  {
    title: 'Quick Shop',
    links: [
      { label: 'Bestsellers', to: '/deals' },
      { label: 'New Arrivals', to: '/deals' },
      { label: 'Sarees', to: '/category/women/sarees' },
      { label: 'Men', to: '/category/men' },
      { label: 'Women', to: '/category/women' },
      { label: 'Sale', to: '/deals' },
    ],
  },
  {
    title: 'Helpful Links',
    links: [
      { label: 'My orders', to: '/orders' },
      { label: 'Track order', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Account', to: '/account' },
      { label: 'Contact us', to: '/support' },
      { label: 'About us', to: '/about' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Privacy Policy', to: '/policies/privacy-policy' },
      { label: 'Terms & Conditions', to: '/policies/terms-and-conditions' },
      { label: 'Shipping & Delivery', to: '/policies/shipping-policy' },
      { label: 'Return & Refund', to: '/policies/return-refund-policy' },
      { label: 'Disclaimer', to: '/policies/disclaimer' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bbb-red-band border-t border-[#600b02]">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-4 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <FusoraLogo compact onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              Sarees, apparel & jewellery from {COMPANY_NAME}.
            </p>
            <a
              href={SUPPORT_MAILTO}
              className="mt-3 inline-block text-sm font-semibold text-[#ffc462] hover:text-white"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-heading text-lg tracking-[0.08em] text-[#ffc462]">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/75 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-4">
          <p className="text-[0.7rem] text-white/50">
            © {new Date().getFullYear()} {COMPANY_NAME}. Fusora (
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
