import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import type { Product } from '../data'

const PAGE = 12

const trendTabs: {
  id: string
  label: string
  filter: (p: Product) => boolean
}[] = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'sarees', label: 'Sarees', filter: (p) => p.subtype === 'sarees' },
  {
    id: 'women',
    label: 'Women',
    filter: (p) => p.gender === 'women' || p.tab === 'women',
  },
  {
    id: 'men',
    label: 'Men',
    filter: (p) => p.gender === 'men' || p.tab === 'men',
  },
  { id: 'jeans', label: 'Jeans', filter: (p) => p.subtype === 'jeans' },
  {
    id: 'jewellery',
    label: 'Jewellery',
    filter: (p) => p.tab === 'jewelry-eyewear-watches',
  },
]

const shopCategories = [
  {
    title: 'Sarees',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Women',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Men',
    to: '/category/men',
    image: '/heroes/hero-denim.jpg',
  },
  {
    title: 'Jewellery',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
  },
]

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const [tab, setTab] = useState('all')
  const [visible, setVisible] = useState(PAGE)

  const filtered = useMemo(() => {
    const t = trendTabs.find((x) => x.id === tab) ?? trendTabs[0]
    return products.filter(t.filter)
  }, [products, tab])

  const shown = filtered.slice(0, visible)

  return (
    <main className="bg-white">
      <Hero />

      {/* Featured products — Nalli */}
      <section className="px-3 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl tracking-wide text-[#1a1a1a] sm:text-4xl">
                Featured products
              </h2>
              <p className="mt-2 max-w-lg text-sm text-[#6e6a65]">
                Fresh weaves, added daily — discover pieces handpicked for you
              </p>
            </div>
            <Link
              to="/deals"
              className="text-sm font-medium text-[#8b1538] transition hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {trendTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className="pill-tab"
                data-active={tab === t.id}
                onClick={() => {
                  setTab(t.id)
                  setVisible(PAGE)
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => n + PAGE)}
                className="btn-maroon"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Shop by category */}
      <section className="border-t border-[#ebe6df] bg-[#faf8f5] px-3 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl tracking-wide text-[#1a1a1a] sm:text-4xl">
              Shop by category
            </h2>
            <Link
              to="/category/women"
              className="text-sm font-medium text-[#8b1538] hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {shopCategories.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <p className="absolute inset-x-0 bottom-5 text-center text-sm font-medium tracking-[0.16em] text-white uppercase sm:text-base">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative mx-auto max-w-[1440px] px-2 py-6 sm:px-3 lg:px-4">
        <div className="relative min-h-[40svh] overflow-hidden sm:min-h-[48svh]">
          <div
            className="pointer-events-none absolute inset-3 z-[1] border border-[#c4a574]/60"
            aria-hidden
          />
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-[2] flex min-h-[40svh] flex-col items-center justify-center px-4 py-16 text-center text-white sm:min-h-[48svh]">
            <h2 className="font-serif text-4xl tracking-[0.06em] uppercase sm:text-5xl">
              Wedding Collection
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/90 sm:text-base">
              Pieces chosen for the celebrations that last forever
            </p>
            <Link
              to="/category/women/sarees"
              className="btn-gold mt-8 inline-flex"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
