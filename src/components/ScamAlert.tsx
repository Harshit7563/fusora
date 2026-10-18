import { TriangleAlert } from 'lucide-react'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'

export function ScamAlert() {
  return (
    <section className="bg-[#f8f6ee] px-4 pb-10 pt-4 sm:px-6 sm:pb-12 lg:px-4">
      <div className="mx-auto max-w-[1200px] rounded-xl border border-[#cf2028] bg-white px-5 py-7 sm:px-8 sm:py-9">
        <div className="mb-4 flex items-center gap-2.5">
          <TriangleAlert
            className="size-6 shrink-0 fill-[#cf2028] text-white sm:size-7"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="font-heading text-xl tracking-[0.06em] text-[#cf2028] sm:text-2xl">
            Scam Alert
          </h2>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-[#070001] sm:text-[0.95rem]">
          <p className="font-bold">
            We have noticed a rise in fraudulent activities through calls, SMS,
            WhatsApp messages, emails, and other mediums.
          </p>
          <p>
            <span className="font-bold">
              Please be aware that Fusora will never ask for OTPs, passwords,
              bank details, or payments via calls, SMS, WhatsApp, or email.
            </span>{' '}
            We also never request payments for any promotional activities
            through unauthorised channels.
          </p>
          <p>
            If you receive any such communication, stay cautious and reach out
            to us immediately at{' '}
            <a
              href={SUPPORT_MAILTO}
              className="font-bold text-[#cf2028] underline-offset-2 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <p className="font-bold">Stay safe!</p>
        </div>
      </div>
    </section>
  )
}
