import { Headphones, Package, ShieldCheck, Truck } from 'lucide-react'

const perks = [
  {
    icon: Truck,
    title: 'Fast delivery',
    body: 'Same-day options in select cities',
  },
  {
    icon: Package,
    title: 'Store pickup',
    body: 'Ready in as little as 1 hour',
  },
  {
    icon: ShieldCheck,
    title: 'Price match',
    body: 'We match eligible competitor prices',
  },
  {
    icon: Headphones,
    title: 'Expert help',
    body: 'Chat or visit a Fusora specialist',
  },
]

export function ServicesBar() {
  return (
    <section className="border-y border-bb-border bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto grid max-w-[1400px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl px-2 py-1">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bb-gray text-bb-blue">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-bb-text">{title}</p>
              <p className="text-xs text-bb-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
