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
  { label: 'Sarees', to: '/category/apparel-accessories/sarees' },
  { label: 'Banarasi sarees', to: '/category/apparel-accessories/sarees/banarasi-sarees' },
  { label: 'Jeans', to: '/category/apparel-accessories/jeans' },
  { label: 'Apparel', to: '/category/apparel-accessories' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'Luggage', to: '/category/luggage-bags-cases' },
  { label: 'New in', to: '/deals' },
]

const furtherLinks = [
  { label: 'About us', to: '/about' },
  { label: 'Memberships', to: '/memberships' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Terms and Conditions', to: '/policies/terms-and-conditions' },
  { label: 'Privacy Policy', to: '/policies/privacy-policy' },
  { label: 'Contact us', to: '/support' },
]

const serviceLinks = [
  { label: 'Return & Refund Policy', to: '/policies/return-refund-policy' },
  { label: 'Shipping Policy', to: '/policies/shipping-policy' },
  { label: 'Cancellation Policy', to: '/policies/cancellation-policy' },
  { label: 'Track your order', to: '/orders' },
  { label: 'Support', to: '/support' },
  { label: 'All policies', to: '/policies' },
]

const bottomLinks = [
  { label: 'Terms and Conditions', to: '/policies/terms-and-conditions' },
  { label: 'Privacy Policy', to: '/policies/privacy-policy' },
  { label: 'Disclaimer', to: '/policies/disclaimer' },
  { label: 'Return & Refund Policy', to: '/policies/return-refund-policy' },
  { label: 'Shipping Policy', to: '/policies/shipping-policy' },
  { label: 'Cancellation Policy', to: '/policies/cancellation-policy' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#ececec] bg-white text-[#272727]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#272727] uppercase">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#787878] transition hover:text-[#272727]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#272727] uppercase">
              Further info
            </h3>
            <ul className="space-y-2.5">
              {furtherLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#787878] transition hover:text-[#272727]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#272727] uppercase">
              Customer service
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#787878] transition hover:text-[#272727]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#272727] uppercase">
              Contact us
            </h3>
            <ul className="space-y-2.5 text-[0.875rem] text-[#787878]">
              <li>
                <a
                  href={SUPPORT_MAILTO}
                  className="transition hover:text-[#272727]"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <Link to="/support" className="transition hover:text-[#272727]">
                  Help & support
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-[#272727]">
                  My orders
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <FusoraLogo compact className="opacity-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ececec] bg-[#fae3ca]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.7rem] text-[#505050]">
            {bottomLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-[#272727]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[0.7rem] text-[#505050]">
            © {new Date().getFullYear()} {COMPANY_NAME}. Brand Fusora (
            <a href={SITE_URL} className="hover:text-[#272727]">
              {SITE_DOMAIN}
            </a>
            ).
          </p>
        </div>
      </div>
    </footer>
  )
}
