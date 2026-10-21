import { useMemo, useState, type ReactNode } from 'react'
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
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
    label: 'Artificial Jewellery',
    filter: (p) => p.tab === 'jewelry-eyewear-watches',
  },
]

const collections = [
  {
    title: 'Sarees',
    to: '/category/women/sarees',
    image: '/heroes/ai-saree.jpg?v=2',
  },
  {
    title: 'Women',
    to: '/category/women',
    image: '/heroes/ai-wedding.jpg?v=2',
  },
  {
    title: 'Men',
    to: '/category/men',
    image: '/heroes/ai-men.jpg?v=2',
  },
  {
    title: 'Sale',
    to: '/deals',
    image: '/heroes/ai-sale.jpg?v=2',
  },
]

const giftTiers = [
  { label: 'Under ₹999', to: '/deals', price: '₹999' },
  { label: 'Under ₹1,499', to: '/deals', price: '₹1,499' },
  { label: 'Under ₹2,999', to: '/deals', price: '₹2,999' },
  { label: 'Shop All', to: '/deals', price: 'All' },
]

function SectionTitle({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}) {
  return (
    <div className="text-center">
      <h2
        className={`font-heading text-4xl tracking-wide uppercase sm:text-5xl ${
          light ? 'text-white' : 'text-[#141414]'
        }`}
      >
        {children}
      </h2>
      <div className="mx-auto mt-2.5 h-1 w-14 bg-[#cf2028]" />
    </div>
  )
}

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

  const deals = useMemo(() => {
    const onSale = products.filter((p) => p.topDeal || p.was > p.price)
    const pool = onSale.length >= 4 ? onSale : products
    return pool.slice(0, 4)
  }, [products])

  const newArrivals = useMemo(
    () =>
      [...products]
        .sort((a, b) =>
          String(b.uploadedAt ?? '').localeCompare(String(a.uploadedAt ?? '')),
        )
        .slice(0, 8),
    [products],
  )

  const bestsellers = useMemo(
    () => products.filter((p) => p.subtype === 'sarees').slice(0, 8),
    [products],
  )

  const circles = useMemo(() => {
    const pick = (fn: (p: Product) => boolean, fallback: string) =>
      products.find(fn)?.image || fallback
    return [
      {
        title: 'Men',
        to: '/category/men',
        image: pick((p) => p.gender === 'men', '/heroes/ai-men.jpg?v=2'),
      },
      {
        title: 'Women',
        to: '/category/women',
        image: '/products/dresses/red-floral-fitflare.jpg',
      },
      {
        title: 'Jeans',
        to: '/category/men/jeans',
        image: pick((p) => p.subtype === 'jeans', '/heroes/ai-men.jpg?v=2'),
      },
      {
        title: 'Sarees',
        to: '/category/women/sarees',
        image: pick((p) => p.subtype === 'sarees', '/heroes/ai-saree.jpg?v=2'),
      },
      {
        title: 'Dresses',
        to: '/category/women/dresses',
        image: pick((p) => p.subtype === 'dresses', '/heroes/ai-wedding.jpg?v=2'),
      },
      {
        title: 'Jewellery',
        to: '/category/jewelry-eyewear-watches',
        image: pick(
          (p) => p.tab === 'jewelry-eyewear-watches',
          '/heroes/ai-sale.jpg?v=2',
        ),
      },
    ]
  }, [products])

  return (
    <main className="bg-white">
      <Hero />

      {/* Trust strip */}
      <section className="bg-[#e9f5f6]">
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
              <Icon
                className="size-8 shrink-0 text-[#141414]"
                strokeWidth={1.5}
              />
              <p className="text-sm leading-tight font-bold text-[#141414]">
                {head}
                <span className="block text-xs font-medium text-[#4c5a5c]">
                  {sub}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category — circles */}
      <section className="px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle>Shop by category</SectionTitle>
          <div className="mt-8 flex flex-wrap items-start justify-center gap-4 pb-1 sm:gap-6">
            {circles.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group w-24 shrink-0 text-center sm:w-28"
              >
                <span className="block overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-[#cf2028]">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="aspect-square w-full object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="mt-2 block text-xs font-bold tracking-[0.08em] text-[#262626] uppercase group-hover:text-[#cf2028]">
                  {c.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="px-4 pb-12 sm:pb-16">
          <div className="mx-auto max-w-[1280px]">
            <SectionTitle>New arrivals</SectionTitle>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending collections */}
      <section className="bg-[#faf8f4] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle>Trending collections</SectionTitle>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {collections.map((c) => (
              <Link
                key={c.to + c.title}
                to={c.to}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070001]/75 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-3 text-center font-heading text-2xl tracking-wide text-white uppercase">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      {deals.length > 0 && (
        <section className="bg-[#cf2028] px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-[1280px]">
            <SectionTitle light>Deal of the day</SectionTitle>
            <p className="mt-2 text-center text-xs font-bold tracking-[0.2em] text-[#ffc462] uppercase">
              Limited time · Grab before it&apos;s gone
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 lg:grid-cols-4">
              {deals.map((deal) => (
                <div key={deal.id} className="bg-white p-2">
                  <ProductCard product={deal} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price bands */}
      <section className="px-4 py-12 sm:py-14">
        <div className="mx-auto max-w-[900px] text-center">
          <SectionTitle>Shop by price</SectionTitle>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {giftTiers.map((t) => (
              <Link
                key={t.label}
                to={t.to}
                className="border border-[#e5e0da] bg-white px-3 py-6 transition hover:border-[#cf2028] hover:shadow-[0_3px_13px_#00000014]"
              >
                <p className="font-heading text-3xl text-[#cf2028]">{t.price}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-[#6a6667] uppercase">
                  {t.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="bg-[#faf8f4] px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-[1280px]">
            <SectionTitle>Bestselling sarees</SectionTitle>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop the drop */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-4xl tracking-wide text-[#141414] uppercase sm:text-5xl">
                Shop the drop
              </h2>
              <div className="mt-2.5 h-1 w-14 bg-[#cf2028]" />
            </div>
            <Link
              to="/deals"
              className="text-xs font-bold tracking-[0.14em] text-[#cf2028] uppercase hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id)
                  setVisible(PAGE)
                }}
                className={`rounded-full border px-4 py-2 text-xs font-bold tracking-[0.08em] whitespace-nowrap uppercase transition ${
                  tab === t.id
                    ? 'border-[#141414] bg-[#141414] text-white'
                    : 'border-[#d9d9d9] bg-white text-[#262626] hover:border-[#141414]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => n + PAGE)}
                className="border border-[#141414] px-8 py-3 text-xs font-bold tracking-[0.16em] text-[#141414] uppercase transition hover:bg-[#141414] hover:text-white"
              >
                Load more products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Reseller band */}
      <section className="relative min-h-[42svh] overflow-hidden sm:min-h-[48svh]">
        <img
          src="/heroes/ai-wedding.jpg?v=2"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-[#3a0505]/65" />
        <div className="relative flex min-h-[42svh] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[48svh]">
          <p className="font-display text-sm tracking-[0.4em] text-[#f3dcb0]">
            Fusora
          </p>
          <h2 className="mt-2 font-display text-5xl tracking-[0.1em] text-[#ffc462] sm:text-6xl">
            Become a Reseller
          </h2>
          <p className="mt-3 max-w-md font-display text-sm tracking-[0.25em] text-[#f3dcb0]">
            List your shop · Sell on Fusora · Reach customers nationwide
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/sell" className="btn-primary">
              Start Selling
            </Link>
            <Link
              to="/sell"
              className="border border-[#f3dcb0]/50 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-[#f3dcb0] uppercase transition hover:border-[#ffc462] hover:text-[#ffc462]"
            >
              Reseller Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
