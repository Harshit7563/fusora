import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  COMPANY_NAME,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { FusoraLogo } from './FusoraLogo'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  )
}

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
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
  }

  return (
    <footer className="border-t border-[#ececec] bg-white text-[#272727]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.55fr_0.85fr] lg:gap-14">
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

          <div className="border-t border-[#ececec] pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <h3 className="mb-4 text-[0.72rem] font-semibold tracking-[0.16em] text-[#272727] uppercase">
              Stay connected
            </h3>
            <div className="mb-8 flex items-center gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center border border-[#ececec] text-[#272727] transition hover:bg-[#f5f5f5]"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center border border-[#ececec] text-[#272727] transition hover:bg-[#f5f5f5]"
              >
                <FacebookIcon className="size-4" />
              </a>
            </div>

            <h3 className="mb-2 text-[0.72rem] font-semibold tracking-[0.16em] text-[#272727] uppercase">
              Join for curated launches
            </h3>
            <p className="mb-4 text-sm text-[#787878]">
              New edits, drops and festive picks — in your inbox.
            </p>
            {done ? (
              <p className="text-sm text-[#272727]">Thanks — you’re on the list.</p>
            ) : (
              <form onSubmit={onSubscribe} className="flex border border-[#ececec]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-white px-3 py-3 text-sm outline-none placeholder:text-[#787878]"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#323232] px-4 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                >
                  Subscribe
                </button>
              </form>
            )}
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
