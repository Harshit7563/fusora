import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { CategoryStrip } from '../components/CategoryStrip'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'

/** Thin gold frame card — Koskii signature */
function GoldCard({
  to,
  image,
  children,
  aspect = 'aspect-[3/4]',
}: {
  to: string
  image: string
  children: ReactNode
  aspect?: string
}) {
  return (
    <Link
      to={to}
      className={`group relative block overflow-hidden rounded-[6px] border border-[#c5a059] ${aspect}`}
    >
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-2 py-4 text-center text-white sm:py-5">
        {children}
      </div>
    </Link>
  )
}

const savings = [
  {
    title: 'Women',
    offer: 'FLAT 40% OFF',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Sarees',
    offer: 'FLAT 30%–50% OFF',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Men',
    offer: 'UP TO 40% OFF',
    to: '/category/men',
    image: '/heroes/hero-denim.jpg',
  },
]

const festive = [
  {
    label: 'Wedding Sarees',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
  },
  {
    label: 'Festive Wear',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85',
  },
  {
    label: 'Everyday Jeans',
    to: '/category/men/jeans',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85',
  },
  {
    label: 'Jewellery',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85',
  },
]

const shades = [
  {
    word: 'Radiant',
    tone: 'REDS',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Enchanting',
    tone: 'GOLDS',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Gorgeous',
    tone: 'GREYS',
    to: '/deals',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Warm',
    tone: 'RUSTS',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Soft',
    tone: 'CREAMS',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Bold',
    tone: 'MAROONS',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
  },
]

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-7 text-center text-[0.78rem] font-semibold tracking-[0.28em] text-[#5c2a2a] uppercase sm:mb-9 sm:text-[0.82rem]">
      {children}
    </h2>
  )
}

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const bestsellers = (
    products.filter((p) => p.topDeal).length >= 4
      ? products.filter((p) => p.topDeal)
      : products.filter((p) => p.subtype === 'sarees')
  ).slice(0, 4)

  return (
    <main className="bg-white">
      <Hero />
      <CategoryStrip />

      {/* THE SAVINGS EDIT */}
      <section className="px-3 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle>The Savings Edit</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {savings.map((b) => (
              <GoldCard key={b.title} to={b.to} image={b.image}>
                <p className="font-serif text-[0.95rem] tracking-[0.14em] uppercase sm:text-lg">
                  {b.title}
                </p>
                <p className="mt-1 text-base font-semibold tracking-wide text-[#e8c84a] sm:text-lg">
                  {b.offer}
                </p>
              </GoldCard>
            ))}
          </div>
        </div>
      </section>

      {/* FESTIVE GLAM */}
      <section className="px-3 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle>Festive Glam</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {festive.map((t) => (
              <GoldCard
                key={t.label}
                to={t.to}
                image={t.image}
                aspect="aspect-[4/5]"
              >
                <p className="font-serif text-sm italic tracking-wide sm:text-base">
                  {t.label}
                </p>
              </GoldCard>
            ))}
          </div>
        </div>
      </section>

      {/* SHADES */}
      <section className="px-3 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle>Shades of Fusora</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {shades.map((c) => (
              <GoldCard key={c.tone} to={c.to} image={c.image}>
                <p className="font-serif text-xl sm:text-2xl">{c.word}</p>
                <p className="mt-0.5 font-serif text-sm italic tracking-[0.12em] uppercase sm:text-base">
                  {c.tone}
                </p>
              </GoldCard>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers — product strip */}
      <section className="px-3 pb-14 sm:px-6 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-medium tracking-[0.22em] text-[#8a7e7a] uppercase">
                Loved, worn, repeated
              </p>
              <h2 className="mt-1 font-serif text-[1.55rem] text-[#5c2a2a] sm:text-3xl">
                Bestsellers
              </h2>
            </div>
            <Link
              to="/deals"
              className="text-[0.68rem] font-semibold tracking-[0.14em] text-[#5c2a2a] uppercase underline underline-offset-4"
            >
              Shop all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
