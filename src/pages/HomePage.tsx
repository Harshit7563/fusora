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
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80&sat=-15',
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

      {/* Festive Edit — Taneira */}
      <section className="festive-glow relative overflow-hidden py-14 sm:py-16 lg:py-[4.5rem]">
        <div className="motif-border absolute inset-x-0 top-0" />
        <div className="motif-border absolute inset-x-0 bottom-0" />
        <div className="relative mx-auto max-w-[1280px] px-3 sm:px-6 lg:px-10">
          <div className="text-center">
            <div className="mx-auto mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d4af77]/70" />
              <span className="text-[#d4af77]">✦</span>
              <span className="h-px w-8 bg-[#d4af77]/70" />
            </div>
            <h2 className="font-serif text-3xl tracking-[0.16em] text-[#d4af77] uppercase sm:text-4xl md:text-[2.6rem]">
              Festive Edit
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#f7f0e6]/85 sm:text-[0.95rem]">
              Where every thread celebrates the spirit of festivity
            </p>
          </div>

          <div className="hide-scrollbar mt-10 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3 sm:mt-12 sm:gap-4 lg:justify-center lg:overflow-visible">
            {festiveCards.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group relative w-[44vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#d4af77]/55 shadow-[0_8px_28px_rgba(0,0,0,0.22)] sm:w-[190px] lg:w-[175px] xl:w-[190px]"
              >
                <div className="pointer-events-none absolute inset-[3px] z-[1] rounded-[0.9rem] border border-[#d4af77]/35" />
                <img
                  src={c.image}
                  alt={c.title}
                  className="aspect-[3/4.2] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 z-[2] px-2.5 py-3.5 text-center text-[0.7rem] font-medium leading-snug tracking-wide text-[#f7f0e6] sm:text-[0.75rem]">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="px-3 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e8e1d8] pb-5">
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
              className="text-sm font-semibold tracking-wide text-[#6d1f2c] transition hover:underline"
            >
              View all →
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

          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-12 flex justify-center">
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

      {/* Wedding promo */}
      <section className="relative min-h-[44svh] overflow-hidden sm:min-h-[52svh]">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a0c12]/75 via-[#2a0c12]/35 to-[#2a0c12]/25" />
        <div className="relative flex min-h-[44svh] flex-col items-center justify-center px-4 py-16 text-center text-white sm:min-h-[52svh]">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#d4af77]/80" />
            <p className="font-serif text-base italic text-[#f7f0e6]/95">
              By Fusora
            </p>
            <span className="h-px w-8 bg-[#d4af77]/80" />
          </div>
          <h2 className="font-serif text-4xl tracking-[0.08em] text-[#f7f0e6] uppercase sm:text-5xl">
            Wedding Collection
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/88 sm:text-base">
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
