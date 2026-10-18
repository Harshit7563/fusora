import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import { formatMoney, type Product } from '../data'

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

const categories = [
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

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const [tab, setTab] = useState('all')
  const [visible, setVisible] = useState(PAGE)
  const [dealIndex, setDealIndex] = useState(0)

  const filtered = useMemo(() => {
    const t = tabs.find((x) => x.id === tab) ?? tabs[0]
    return products.filter(t.filter)
  }, [products, tab])

  const shown = filtered.slice(0, visible)

  const deals = useMemo(
    () => products.filter((p) => p.topDeal || p.was > p.price).slice(0, 8),
    [products],
  )

  const founderPicks = useMemo(
    () => products.filter((p) => p.subtype === 'sarees').slice(0, 8),
    [products],
  )

  const activeDeal = deals[dealIndex % Math.max(deals.length, 1)]

  return (
    <main className="bg-[#f8f6ee]">
      <Hero />

      {/* What's in your deck — category strip */}
      <section className="bg-white px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="section-title text-[#1f201e]">What&apos;s in your deck</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {categories.map((c) => (
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
                <p className="absolute inset-x-0 bottom-0 p-3 text-center font-heading text-xl tracking-wide text-white sm:text-2xl">
                  {c.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      {activeDeal && (
        <section className="bbb-red-band px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="section-title text-[#ffc462]">Deal of the Day</h2>
            <div className="mx-auto mt-2 grid w-max place-items-center bg-[#ffc462] px-3 py-1 font-heading text-lg text-[#7f1714]">
              Hot pick
            </div>
            <div className="mx-auto mt-8 max-w-sm border border-[#d9d9d9] bg-white text-[#070001] shadow-[0_3px_13px_#00000024]">
              <Link to={`/product/${activeDeal.id}`}>
                <img
                  src={activeDeal.image}
                  alt={activeDeal.name}
                  className="aspect-square w-full object-cover"
                />
              </Link>
              <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
                <p className="line-clamp-2 text-sm font-medium">{activeDeal.name}</p>
                <p className="font-heading text-2xl">{formatMoney(activeDeal.price)}</p>
                {activeDeal.was > activeDeal.price && (
                  <p className="text-xs text-[#6a6667] line-through">
                    {formatMoney(activeDeal.was)}
                  </p>
                )}
                <Link to={`/product/${activeDeal.id}`} className="btn-outline mt-1">
                  Buy
                </Link>
              </div>
            </div>
            {deals.length > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {deals.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Deal ${i + 1}`}
                    onClick={() => setDealIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === dealIndex % deals.length
                        ? 'w-5 bg-white'
                        : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Free gift tiers */}
      <section className="bg-[#f8f6ee] px-4 py-12 sm:py-14">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="section-title text-[#1f201e]">Build the party bag</h2>
          <p className="mt-2 text-sm text-[#6a6667]">
            Pick your price band and stack the looks
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {giftTiers.map((t) => (
              <Link
                key={t.label}
                to={t.to}
                className="border border-[#d9d9d9] bg-white px-3 py-6 transition hover:border-[#cf2028] hover:shadow-[0_3px_13px_#00000014]"
              >
                <p className="font-heading text-2xl text-[#cf2028]">{t.price}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-[#6a6667] uppercase">
                  {t.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Pick */}
      {founderPicks.length > 0 && (
        <section className="bg-white px-4 py-12 sm:py-14">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="section-title text-[#1f201e]">Founder&apos;s Pick</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {founderPicks.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop By grid */}
      <section className="bg-[#f8f6ee] px-4 py-12 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="section-title text-left text-[#1f201e]">Shop the drop</h2>
            <Link
              to="/deals"
              className="font-heading text-lg tracking-wide text-[#cf2028] hover:underline"
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

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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

      {/* Promo band */}
      <section className="relative min-h-[42svh] overflow-hidden sm:min-h-[48svh]">
        <img
          src="/heroes/ai-wedding.jpg?v=2"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-[#3a0505]/60" />
        <div className="relative flex min-h-[42svh] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[48svh]">
          <p className="font-display text-sm tracking-[0.4em] text-[#f3dcb0]">
            Fusora
          </p>
          <h2 className="mt-2 font-display text-5xl tracking-[0.1em] text-[#ffc462] sm:text-6xl">
            Wedding Collection
          </h2>
          <p className="mt-3 max-w-md font-display text-sm tracking-[0.25em] text-[#f3dcb0]">
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
