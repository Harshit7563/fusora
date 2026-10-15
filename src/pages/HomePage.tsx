import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import type { Product } from '../data'

const PAGE = 24

const trendTabs: {
  id: string
  label: string
  filter: (p: Product) => boolean
}[] = [
  { id: 'all', label: 'New Arrivals', filter: () => true },
  { id: 'sarees', label: 'Sarees', filter: (p) => p.subtype === 'sarees' },
  { id: 'women', label: 'Women', filter: (p) => p.gender === 'women' || p.tab === 'women' },
  { id: 'men', label: 'Men', filter: (p) => p.gender === 'men' || p.tab === 'men' },
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

const occasions = [
  { label: 'Wedding', to: '/category/women/sarees' },
  { label: 'Festive', to: '/category/women' },
  { label: 'Casual', to: '/category/men' },
  { label: 'Formal', to: '/category/men/jeans' },
  { label: 'Party', to: '/deals' },
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

      {/* TRENDING — all products with tabs */}
      <section className="px-3 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-center font-serif text-3xl tracking-wide text-[#6b161d] sm:text-4xl">
            Trending
          </h2>

          <div className="mt-7 flex justify-center gap-2 overflow-x-auto pb-1 sm:mt-8 sm:gap-2.5">
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

          <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-11 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => n + PAGE)}
                className="border border-[#6b161d] px-10 py-3 text-[0.7rem] font-medium tracking-[0.16em] text-[#6b161d] uppercase transition hover:bg-[#6b161d] hover:text-white"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Shop Categories */}
      <section className="border-t border-[#e5ddd6] px-3 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-center font-serif text-3xl tracking-wide text-[#6b161d] sm:text-4xl">
            Shop Categories
          </h2>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-11 sm:grid-cols-4 sm:gap-4">
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
                <div className="absolute inset-0 bg-black/30" />
                <p className="absolute inset-x-0 bottom-5 text-center font-serif text-xl tracking-[0.12em] text-white uppercase sm:text-2xl">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding banner */}
      <section className="relative min-h-[42svh] overflow-hidden sm:min-h-[50svh]">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#5a3826]/55" />
        <div className="relative flex min-h-[42svh] flex-col items-center justify-center px-4 py-16 text-center text-white sm:min-h-[50svh]">
          <h2 className="font-serif text-4xl tracking-wide sm:text-5xl">
            Wedding Collection
          </h2>
          <p className="mt-3 max-w-md font-serif text-lg italic text-white/90">
            Pieces chosen for the moments that matter.
          </p>
          <Link
            to="/category/women/sarees"
            className="btn-outline-light mt-8 inline-flex"
          >
            Shop Kanchipuram
          </Link>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="px-3 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <h2 className="text-center font-serif text-3xl tracking-wide text-[#6b161d] sm:text-4xl">
            Shop by Occasion
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:mt-10">
            {occasions.map((o) => (
              <Link key={o.label} to={o.to} className="pill-tab">
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
