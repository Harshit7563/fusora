import { ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { SafeImage } from './SafeImage'

type Props = {
  title: string
  products: Product[]
  labels: string[]
}

/** Explore slider: one big tile left, three product tiles right, trust strip below. */
export function CategorySlider({ title, products, labels }: Props) {
  const slides = useMemo(() => {
    const pool = products.filter((p) => p.image)
    if (pool.length < 4) return []
    const groups: Product[][] = []
    for (let g = 0; g < 3; g++) {
      const group: Product[] = []
      for (let i = 0; i < 4; i++) group.push(pool[(g * 4 + i) % pool.length])
      groups.push(group)
    }
    return groups
  }, [products])

  const [index, setIndex] = useState(0)
  useEffect(() => {
    setIndex(0)
  }, [title])
  useEffect(() => {
    if (slides.length < 2) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000,
    )
    return () => window.clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null
  const group = slides[index % slides.length]
  const [big, ...tiles] = group

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-3 pt-4 sm:px-5">
        <div className="grid overflow-hidden border border-[#e3ded8] lg:grid-cols-5">
          {/* Big tile */}
          <div className="relative lg:col-span-2">
            <Link to={`/product/${big.id}`} className="block">
              <SafeImage
                src={big.image}
                alt={big.name}
                className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[380px]"
              />
            </Link>
            <span className="absolute bottom-3 left-3 max-w-[85%] bg-[#141414]/85 px-3 py-1.5 text-xs font-semibold text-white">
              {big.name} · {formatMoney(big.price)}
            </span>
            <button
              type="button"
              aria-label="Previous"
              onClick={() =>
                setIndex((i) => (i - 1 + slides.length) % slides.length)
              }
              className="absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white lg:hidden"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Explore tiles */}
          <div className="flex flex-col lg:col-span-3">
            <h1 className="px-4 pt-5 text-center font-heading text-3xl tracking-wide text-[#141414] uppercase sm:text-4xl">
              Explore {title}
            </h1>
            <div className="grid flex-1 grid-cols-3 divide-x divide-[#e3ded8] border-y border-[#e3ded8] mt-4">
              {tiles.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block bg-white p-2 sm:p-3"
                >
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <p className="mt-2 line-clamp-1 text-center text-[0.7rem] font-semibold text-[#262626] sm:text-xs">
                    {p.name}
                  </p>
                  <p className="text-center text-[0.7rem] font-bold text-[#cf2028] sm:text-xs">
                    {formatMoney(p.price)}
                  </p>
                </Link>
              ))}
            </div>
            {labels.length > 0 && (
              <p className="px-4 py-3.5 text-center text-[0.72rem] font-bold tracking-[0.18em] text-[#262626] uppercase sm:text-sm">
                {labels.join(' | ')}
              </p>
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 py-3">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`size-2 rounded-full transition ${
                i === index ? 'bg-[#cf2028]' : 'bg-[#d8d2cc]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-[#e9f5f6]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 px-4 py-4 text-center sm:grid-cols-3 sm:px-5">
          {[
            {
              Icon: ShieldCheck,
              head: 'Extra 5% Off',
              sub: 'on prepaid Razorpay orders',
            },
            {
              Icon: RotateCcw,
              head: '7-Day Easy Returns',
              sub: '& quick refunds',
            },
            {
              Icon: Truck,
              head: 'Free & Fast Shipping',
              sub: 'on orders above ₹999',
            },
          ].map(({ Icon, head, sub }) => (
            <div
              key={head}
              className="flex items-center justify-center gap-3 text-left"
            >
              <Icon className="size-8 shrink-0 text-[#141414]" strokeWidth={1.5} />
              <p className="text-sm leading-tight font-bold text-[#141414]">
                {head}
                <span className="block text-xs font-medium text-[#4c5a5c]">
                  {sub}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
