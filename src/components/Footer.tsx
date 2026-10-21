import { Link } from 'react-router-dom'
import {
  Banknote,
  IndianRupee,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react'

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
          Born in India. Worn with Pride.
        </p>
      </div>
      <p className="px-4 pt-8 text-center text-3xl font-light text-[#262626] sm:text-5xl">
        Your Style. <span className="font-bold">Delivered Nationwide.</span>
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

        {/* Payments row */}
        <div className="mt-8 border-t border-[#e0e0e0] pt-5">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6a6667]">
            <span className="mr-1 inline-flex items-center gap-1.5 font-bold text-[#262626]">
              <ShieldCheck className="size-4 text-[#1f8a3b]" />
              100% Secure Payments:
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdcdc] bg-white px-3 py-1.5 font-semibold text-[#3d3d3d]">
              <span className="grid size-4 place-items-center rounded-[4px] bg-[#2b6cf5] text-[0.6rem] font-black text-white italic">
                R
              </span>
              Razorpay
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#dcdcdc] bg-white px-3 py-1.5 font-semibold text-[#3d3d3d]">
              <span className="text-[0.68rem] font-black tracking-tight text-[#3d3d3d] italic">
                UPI
              </span>
              <span className="flex -space-x-1 text-[0.6rem] font-black">
                <span className="text-[#3d9b35]">›</span>
                <span className="text-[#ed752e]">›</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdcdc] bg-white px-3 py-1.5 font-semibold text-[#3d3d3d]">
              <span className="text-[0.62rem] font-black tracking-wide text-[#1a1f71] italic">
                VISA
              </span>
              <span className="relative flex w-6 items-center">
                <span className="size-3.5 rounded-full bg-[#eb001b]/90" />
                <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b]/90" />
              </span>
              Cards
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdcdc] bg-white px-3 py-1.5 font-semibold text-[#3d3d3d]">
              <span className="grid size-4 place-items-center rounded-[4px] bg-[#0e4d92] text-white">
                <Landmark className="size-3" />
              </span>
              Net Banking
            </span>
            {[
              { label: 'COD', Icon: Banknote },
            ].map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdcdc] bg-white px-3 py-1.5 font-semibold text-[#3d3d3d]"
              >
                <Icon className="size-3.5 text-[#cf2028]" />
                {label}
              </span>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-[#cfcaca] sm:block" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdcdc] bg-white px-3 py-1.5 font-semibold text-[#3d3d3d]">
              <Truck className="size-3.5 text-[#cf2028]" />
              Delivery: 1–7 days across India
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#e0e0e0] py-4 text-center">
        <p className="px-4 text-xs font-bold text-[#262626]">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
        <p className="mt-1 px-4 text-[0.65rem] font-semibold text-[#6a6667]">
          CIN: {COMPANY_CIN} · GSTIN: {COMPANY_GSTIN}
        </p>
      </div>
    </footer>
  )
}
