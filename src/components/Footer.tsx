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
    title: 'Shop',
    links: [
      { label: 'Sarees', to: '/category/women/sarees' },
      { label: 'Women', to: '/category/women' },
      { label: 'Men', to: '/category/men' },
      { label: 'Jeans', to: '/category/men/jeans' },
      { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
      { label: 'Sale', to: '/deals' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'My orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Account', to: '/account' },
      { label: 'Support', to: '/support' },
    ],
  },
  {
    title: 'Policies',
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
    <footer className="border-t border-[#e8e1d8] bg-[#faf7f2] text-[#1c1c1c]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <FusoraLogo compact />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6b6560]">
              Handpicked sarees, apparel & jewellery from {COMPANY_NAME}.
            </p>
            <a
              href={SUPPORT_MAILTO}
              className="mt-3 inline-block text-sm text-[#6d1f2c] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold tracking-[0.1em] text-[#1c1c1c] uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-[#6b6560] transition hover:text-[#6d1f2c]"
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
      <div className="border-t border-[#e8e1d8] bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p className="text-[0.7rem] text-[#6b6560]">
            © {new Date().getFullYear()} {COMPANY_NAME}. Fusora (
            <a href={SITE_URL} className="hover:text-[#6d1f2c]">
              {SITE_DOMAIN}
            </a>
            ).
          </p>
        </div>
      </div>
    </footer>
  )
}
