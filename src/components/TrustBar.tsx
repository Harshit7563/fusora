import { Headset, IndianRupee, ShieldCheck, Truck } from 'lucide-react'

const items = [
  {
    icon: IndianRupee,
    title: 'COD Available',
    line: 'Cash on Delivery on eligible orders',
  },
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    line: 'Dispatch in 24–48 hours',
  },
  {
    icon: Headset,
    title: 'Monday–Saturday',
    line: 'Expert support, 10:30 AM–7:00 PM',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    line: 'Safe checkout on every order',
  },
]

export function TrustBar() {
  return (
    <section className="border-y border-bb-border bg-bb-gray px-3 py-10 sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {items.map(({ icon: Icon, title, line }) => (
          <div key={title} className="flex items-start gap-3 sm:justify-center">
            <span className="grid size-11 shrink-0 place-items-center border border-bb-border bg-white text-bb-blue">
              <Icon className="size-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide text-bb-text">
                {title}
              </p>
              <p className="mt-0.5 text-xs text-bb-muted">{line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
