import { Link } from 'react-router-dom'
import {
  COMPANY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { FusoraLogo } from './FusoraLogo'

const shopLinks = [
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Women', to: '/category/women' },
  { label: 'Men', to: '/category/men' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'New in', to: '/deals' },
  { label: 'Sale', to: '/deals' },
]

const helpLinks = [
  { label: 'My orders', to: '/orders' },
  { label: 'Track order', to: '/orders' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Sign in', to: '/account' },
  { label: 'Contact support', to: '/support' },
]

const policyLinks = [
  { label: 'Privacy Policy', to: '/policies/privacy-policy' },
  { label: 'Shipping & Delivery', to: '/policies/shipping-policy' },
  { label: 'Return & Refund', to: '/policies/return-refund-policy' },
  { label: 'Terms & Conditions', to: '/policies/terms-and-conditions' },
  { label: 'Disclaimer', to: '/policies/disclaimer' },
  { label: 'All policies', to: '/policies' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#e8e0d8] bg-white text-[#1a1a1a]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div>
            <FusoraLogo compact />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#776865]">
              Designer sarees, apparel & jewellery from {COMPANY_NAME}. Chosen
              pieces for everyday elegance and festive moments.
            </p>
            <a
              href={SUPPORT_MAILTO}
              className="mt-4 inline-block text-sm text-[#5c2a2a] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#5c2a2a] uppercase">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#776865] transition hover:text-[#5c2a2a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#5c2a2a] uppercase">
              Help
            </h3>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#776865] transition hover:text-[#5c2a2a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#5c2a2a] uppercase">
              Policies
            </h3>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#776865] transition hover:text-[#5c2a2a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e8e0d8] bg-[#f7f5f3]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-[0.7rem] text-[#776865]">
            © {new Date().getFullYear()} {COMPANY_NAME}. Brand Fusora (
            <a href={SITE_URL} className="hover:text-[#5c2a2a]">
              {SITE_DOMAIN}
            </a>
            ).
          </p>
          <p className="text-[0.7rem] text-[#776865]">
            Inspired by occasion-wear elegance — made for you.
          </p>
        </div>
      </div>
    </footer>
  )
}
