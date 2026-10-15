import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SafeImage } from './SafeImage'

const featured = [
  {
    id: 'sale',
    title: 'Sale',
    to: '/deals',
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
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
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
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80',
  },
]

/** Ornate scalloped gold ring — Koskii category icons */
function ScallopRing({
  children,
  sale,
}: {
  children: ReactNode
  sale?: boolean
}) {
  return (
    <div className="relative mx-auto size-[5.25rem] sm:size-[6.5rem] lg:size-[7.25rem]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full drop-shadow-sm"
        aria-hidden
      >
        <path
          d="M50,3.5
            C55.5,3.5 58,9.5 62,11.5 C67.5,9.5 72,3.8 77.5,7.5
            C83.5,11.5 81.5,18 85.5,22 C92,24.5 96.5,29 96.5,35
            C96.5,41 90.5,43 88.5,49 C90.5,55 96.5,57 96.5,63
            C96.5,69 92,73.5 85.5,76 C81.5,80 83.5,86.5 77.5,90.5
            C72,94.2 67.5,88.5 62,86.5 C58,88.5 55.5,94.5 50,94.5
            C44.5,94.5 42,88.5 38,86.5 C32.5,88.5 28,94.2 22.5,90.5
            C16.5,86.5 18.5,80 14.5,76 C8,73.5 3.5,69 3.5,63
            C3.5,57 9.5,55 11.5,49 C9.5,43 3.5,41 3.5,35
            C3.5,29 8,24.5 14.5,22 C18.5,18 16.5,11.5 22.5,7.5
            C28,3.8 32.5,9.5 38,11.5 C42,9.5 44.5,3.5 50,3.5 Z"
          fill={sale ? '#c2185b' : '#fff'}
          stroke="#c5a059"
          strokeWidth="1.8"
        />
      </svg>
      <div className="absolute inset-[14%] overflow-hidden rounded-full bg-[#f7f5f3]">
        {children}
      </div>
    </div>
  )
}

export function CategoryStrip() {
  return (
    <section className="bg-white px-3 py-9 sm:px-6 sm:py-11 lg:px-10">
      <div className="mx-auto max-w-[980px]">
        <div className="flex justify-between gap-3 overflow-x-auto pb-1 sm:gap-0 sm:overflow-visible">
          {featured.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="group w-[5.5rem] shrink-0 text-center sm:w-[14%] sm:shrink"
            >
              <ScallopRing sale={item.sale}>
                {item.sale ? (
                  <div
                    className="grid h-full place-items-center"
                    style={{
                      background:
                        'radial-gradient(circle at center, #e91e63 0%, #ad1457 70%)',
                    }}
                  >
                    <span className="font-serif text-[0.95rem] tracking-wide text-[#e8c84a] sm:text-lg">
                      SALE
                    </span>
                  </div>
                ) : (
                  <SafeImage
                    src={item.image!}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </ScallopRing>
              <p className="mt-2.5 text-[0.58rem] font-medium tracking-[0.14em] text-[#8a7e7a] uppercase sm:mt-3 sm:text-[0.62rem]">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
