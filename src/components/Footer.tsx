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
      { label: 'Shipping', to: '/policies/shipping-policy' },
      { label: 'Returns', to: '/policies/return-refund-policy' },
      { label: 'Terms', to: '/policies/terms-and-conditions' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-[#eee] bg-[#111] text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="brightness-0 invert">
              <FusoraLogo compact />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Sarees, apparel & jewellery from {COMPANY_NAME}.
            </p>
            <a
              href={SUPPORT_MAILTO}
              className="mt-3 inline-block text-sm font-semibold text-white hover:text-[#e30613]"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[0.72rem] font-extrabold tracking-[0.12em] uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/65 transition hover:text-white"
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
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
