import { Link } from 'react-router-dom'
import { IndianRupee, RotateCcw } from 'lucide-react'

import {
  COMPANY_CIN,
  COMPANY_GSTIN,
  COMPANY_NAME,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { FusoraLogo } from './FusoraLogo'

const cols = [
  {
    title: 'Need Help',
    links: [
      { label: 'Contact Us', to: '/support' },
      { label: 'Track Order', to: '/orders' },
      { label: 'Returns & Refunds', to: '/policies/return-refund-policy' },
      { label: 'FAQs', to: '/support' },
      { label: 'My Account', to: '/account' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Sell on Fusora', to: '/sell' },
      { label: 'Memberships', to: '/memberships' },
      { label: 'Our Stores', to: '/stores' },
      { label: 'Shop All', to: '/deals' },
    ],
  },
  {
    title: 'More Info',
    links: [
      { label: 'Terms & Conditions', to: '/policies/terms-and-conditions' },
      { label: 'Privacy Policy', to: '/policies/privacy-policy' },
      { label: 'Shipping & Delivery', to: '/policies/shipping-policy' },
      { label: 'Cancellation Policy', to: '/policies/cancellation-policy' },
      {
        label: 'Grievance Redressal',
        to: '/policies/grievance-redressal-policy',
      },
      { label: 'Disclaimer', to: '/policies/disclaimer' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Sarees', to: '/category/women/sarees' },
      { label: 'Women', to: '/category/women' },
      { label: 'Men', to: '/category/men' },
      { label: 'Dresses', to: '/category/women/dresses' },
      { label: 'Artificial Jewellery', to: '/category/jewelry-eyewear-watches' },
      { label: 'Sale', to: '/deals' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#f3f3f3] text-[#262626]">
      {/* Brand band */}
      <div className="bg-[#cf2028] px-4 py-3.5 text-center">
        <p className="font-heading text-2xl tracking-[0.08em] text-white uppercase sm:text-4xl">
          Proudly Homegrown Indian Brand
        </p>
      </div>
      <p className="px-4 pt-8 text-center text-3xl font-light text-[#262626] sm:text-5xl">
        Delivering Smiles <span className="font-bold">Across India</span>
      </p>

      <div className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {cols.map((col, i) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold tracking-[0.08em] text-[#cf2028] uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link
                      to={l.to}
                      className="text-[0.83rem] font-medium text-[#3d3d3d] transition hover:text-[#cf2028]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {i === 0 && (
                <ul className="mt-5 space-y-2.5 text-[0.83rem] font-medium text-[#3d3d3d]">
                  <li className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full border border-[#bdbdbd]">
                      <IndianRupee className="size-3.5" />
                    </span>
                    COD available above ₹2,000
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full border border-[#bdbdbd]">
                      <RotateCcw className="size-3.5" />
                    </span>
                    7-day easy returns
                  </li>
                  <li>
                    <a
                      href={SUPPORT_MAILTO}
                      className="font-semibold text-[#cf2028] hover:underline"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="mt-12 flex flex-col items-center">
          <FusoraLogo compact centered />
        </div>

        {/* Who we are */}
        <details className="group mt-10 border border-[#dcdcdc] bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm font-bold text-[#cf2028] [&::-webkit-details-marker]:hidden">
            Who we are
            <span className="text-xl leading-none transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="border-t border-[#eee] px-4 py-4 text-sm leading-relaxed text-[#3d3d3d]">
            <p>
              Fusora is an Indian fashion destination for sarees, everyday
              apparel and artificial jewellery — run by {COMPANY_NAME}. We work
              with our own curated collections and independent resellers on
              “Sell on Fusora” to bring honest prices, secure Razorpay payments
              and delivery in 1–7 days across India.
            </p>
            <p className="mt-3 text-xs font-bold text-[#262626]">
              CIN: {COMPANY_CIN} · GSTIN: {COMPANY_GSTIN}
            </p>
          </div>
        </details>

        {/* Payments row */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-[#e0e0e0] pt-5 text-center text-xs text-[#6a6667] sm:flex-row sm:gap-6">
          <p>
            <span className="font-bold text-[#262626]">
              100% Secure Payments:
            </span>{' '}
            Razorpay · UPI · Cards · Net Banking · COD
          </p>
          <span className="hidden h-4 w-px bg-[#cfcaca] sm:block" />
          <p>
            <span className="font-bold text-[#262626]">Delivery:</span> 1–7
            days across India
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-[#e0e0e0] py-4 text-center">
        <p className="px-4 text-xs font-bold text-[#262626]">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
