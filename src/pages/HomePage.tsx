import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import type { Product } from '../data'

const PAGE = 12

const tabs: {
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

const categories = [
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
    title: 'T-shirts',
    to: '/category/men/tshirts',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Shirts',
    to: '/category/men/shirts',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Jeans',
    to: '/category/men/jeans',
    image:
      'https://thedenimforge.com/uploads/products/1789985439763-lnhn91.webp',
  },
  {
    title: 'Jewellery',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Sale',
    to: '/deals',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
  },
]

const priceBands = [
  { label: 'Under ₹999', to: '/deals' },
  { label: 'Under ₹1,499', to: '/deals' },
  { label: 'Under ₹2,999', to: '/deals' },
  { label: 'Shop all', to: '/deals' },
]

const occasions = [
  { label: 'Wedding', to: '/category/women/sarees' },
  { label: 'Festive', to: '/category/women' },
  { label: 'Everyday', to: '/category/men' },
  { label: 'Office', to: '/category/men/shirts' },
  { label: 'Party', to: '/deals' },
  { label: 'Casual', to: '/category/men/jeans' },
]

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const [tab, setTab] = useState('all')
  const [visible, setVisible] = useState(PAGE)

  const filtered = useMemo(() => {
    const t = tabs.find((x) => x.id === tab) ?? tabs[0]
    return products.filter(t.filter)
  }, [products, tab])

  const shown = filtered.slice(0, visible)

  return (
    <main className="bg-white">
      <Hero />

      {/* Shop By */}
      <section className="px-3 py-10 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="text-xl font-extrabold tracking-tight text-[#111] uppercase sm:text-2xl">
              Shop By
            </h2>
            <Link
              to="/deals"
              className="text-xs font-bold tracking-wide text-[#e30613] uppercase hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className="chip"
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

          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => n + PAGE)}
                className="btn-outline"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Category tiles */}
      <section className="border-t border-[#eee] bg-[#fafafa] px-3 py-10 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-6 text-xl font-extrabold tracking-tight text-[#111] uppercase sm:text-2xl">
            Shop Categories
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {categories.map((c) => (
              <Link
                key={c.to + c.title}
                to={c.to}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-3 text-center text-sm font-bold tracking-wide text-white uppercase sm:p-4 sm:text-base">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by price */}
      <section className="px-3 py-10 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-[#111] uppercase sm:text-2xl">
            Shop by Price
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {priceBands.map((b) => (
              <Link key={b.label} to={b.to} className="chip">
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="border-t border-[#eee] px-3 py-10 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-[#111] uppercase sm:text-2xl">
            Shop by Occasion
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {occasions.map((o) => (
              <Link key={o.label} to={o.to} className="chip">
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo strip */}
      <section className="relative min-h-[38svh] overflow-hidden sm:min-h-[44svh]">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex min-h-[38svh] flex-col items-center justify-center px-4 py-14 text-center text-white sm:min-h-[44svh]">
          <p className="text-xs font-bold tracking-[0.16em] uppercase opacity-90">
            Fusora
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight uppercase sm:text-5xl">
            Wedding Collection
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/90">
            Pieces chosen for celebrations that last
          </p>
          <Link to="/category/women/sarees" className="btn-primary mt-7">
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  )
}
