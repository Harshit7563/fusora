import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SafeImage } from './SafeImage'

const featured = [
  {
    id: 'sale',
    title: 'Sale',
    to: '/deals',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80',
    sale: true,
  },
  {
    id: 'sarees',
    title: 'Sarees',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'women',
    title: 'Women',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'men',
    title: 'Men',
    to: '/category/men',
    image: '/heroes/hero-denim.jpg',
  },
  {
    id: 'jeans',
    title: 'Jeans',
    to: '/category/men/jeans',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'jewellery',
    title: 'Jewellery',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=400&q=80',
  },
]

/** Ornate scalloped ring — Koskii category icons */
function ScallopRing({
  children,
  sale,
}: {
  children: ReactNode
  sale?: boolean
}) {
  return (
    <div className="relative mx-auto size-[5.5rem] sm:size-[6.75rem]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <path
            id="scallop"
            d="M50,4
              C56,4 58,10 62,12 C68,10 72,4 78,8
              C84,12 82,18 86,22 C92,24 96,28 96,34
              C96,40 90,42 88,48 C90,54 96,56 96,62
              C96,68 92,72 86,74 C82,78 84,84 78,88
              C72,92 68,86 62,84 C58,86 56,92 50,92
              C44,92 42,86 38,84 C32,86 28,92 22,88
              C16,84 18,78 14,74 C8,72 4,68 4,62
              C4,56 10,54 12,48 C10,42 4,40 4,34
              C4,28 8,24 14,22 C18,18 16,12 22,8
              C28,4 32,10 38,12 C42,10 44,4 50,4 Z"
          />
        </defs>
        <use
          href="#scallop"
          fill={sale ? '#9b1b4a' : 'none'}
          stroke="#c5a059"
          strokeWidth="2.2"
        />
      </svg>
      <div className="absolute inset-[12%] overflow-hidden rounded-full bg-[#f7f5f3]">
        {children}
      </div>
    </div>
  )
}

export function CategoryStrip() {
  return (
    <section className="bg-white px-3 py-8 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-6 sm:gap-5 sm:overflow-visible sm:pb-0">
          {featured.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="group w-[5.75rem] shrink-0 text-center sm:w-auto"
            >
              <ScallopRing sale={item.sale}>
                {item.sale ? (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-[#c2185b] to-[#7b1fa2]">
                    <span className="font-serif text-sm tracking-wide text-[#e8c84a] sm:text-base">
                      SALE
                    </span>
                  </div>
                ) : (
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </ScallopRing>
              <p className="mt-3 text-[0.62rem] font-medium tracking-[0.14em] text-[#776865] uppercase sm:text-[0.68rem]">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
