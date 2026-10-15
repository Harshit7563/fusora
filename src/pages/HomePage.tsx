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

const festiveCards = [
  {
    title: 'Sarees for Evening Glam',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Sarees for Celebrations',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Festive Gatherings',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'Everyday Ethnic',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80&sat=-20',
  },
  {
    title: 'Men’s Edit',
    to: '/category/men',
    image: '/heroes/hero-denim.jpg',
  },
  {
    title: 'Jewellery',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85',
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

      {/* Festive Edit — Taneira maroon strip */}
      <section className="relative overflow-hidden bg-[#6d1f2c] py-12 sm:py-16">
        <div className="motif-border absolute inset-x-0 top-0 opacity-80" />
        <div className="motif-border absolute inset-x-0 bottom-0 opacity-80" />
        <div className="relative mx-auto max-w-[1280px] px-3 sm:px-6 lg:px-10">
          <div className="text-center">
            <h2 className="font-serif text-3xl tracking-[0.12em] text-[#c4a574] uppercase sm:text-4xl">
              Festive Edit
            </h2>
            <p className="mt-2 text-sm text-[#c4a574]/90 sm:text-base">
              Where every thread celebrates the spirit of festivity
            </p>
          </div>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:mt-10 sm:gap-4">
            {festiveCards.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group relative w-[42vw] shrink-0 overflow-hidden rounded-xl border border-[#c4a574]/50 sm:w-[200px] lg:w-[210px]"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-3 text-center text-[0.72rem] font-medium leading-snug text-white sm:text-[0.78rem]">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="px-3 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl tracking-wide text-[#1c1c1c] sm:text-4xl">
                New arrivals
              </h2>
              <p className="mt-2 text-sm text-[#6b6560]">
                Fresh weaves and everyday ethnic — curated for you
              </p>
            </div>
            <Link
              to="/deals"
              className="text-sm font-semibold text-[#6d1f2c] hover:underline"
            >
              View all
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
                className="btn-shop-dark"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative min-h-[42svh] overflow-hidden sm:min-h-[48svh]">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#3a1018]/50" />
        <div className="relative flex min-h-[42svh] flex-col items-center justify-center px-4 py-16 text-center text-white sm:min-h-[48svh]">
          <p className="font-serif text-base italic text-white/90">By Fusora</p>
          <h2 className="mt-1 font-serif text-4xl tracking-[0.06em] uppercase sm:text-5xl">
            Wedding Collection
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/90">
            Pieces chosen for celebrations that last forever
          </p>
          <Link to="/category/women/sarees" className="btn-shop mt-8">
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  )
}
