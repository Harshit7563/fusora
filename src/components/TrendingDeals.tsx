import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CategoryId } from '../categories'
import type { Product } from '../data'
import { useCatalog } from '../hooks/useCatalog'
import { ProductCard } from './ProductCard'

const homeTabs: {
  id: CategoryId | 'sarees' | 'jeans'
  label: string
  filter: (p: Product) => boolean
}[] = [
  {
    id: 'sarees',
    label: 'Sarees',
    filter: (p) => p.subtype === 'sarees',
  },
  {
    id: 'jeans',
    label: 'Jeans',
    filter: (p) => p.subtype === 'jeans',
  },
  {
    id: 'jewelry-eyewear-watches',
    label: 'Jewellery',
    filter: (p) => p.tab === 'jewelry-eyewear-watches',
  },
  {
    id: 'luggage-bags-cases',
    label: 'Luggage',
    filter: (p) => p.tab === 'luggage-bags-cases',
  },
]

export function TrendingDeals() {
  const { products } = useCatalog()
  const available = useMemo(
    () => homeTabs.filter((t) => products.some(t.filter)),
    [products],
  )
  const [tab, setTab] = useState(available[0]?.id ?? 'sarees')
  const active = available.find((t) => t.id === tab) ?? available[0]

  const list = useMemo(
    () => (active ? products.filter(active.filter).slice(0, 8) : []),
    [active, products],
  )

  const viewAllTo =
    tab === 'sarees'
      ? '/category/apparel-accessories/sarees'
      : tab === 'jeans'
        ? '/category/apparel-accessories/jeans'
        : `/category/${tab}`

  return (
    <section id="deals" className="bg-white px-3 py-12 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-bb-blue uppercase">
            Beautiful pieces
          </p>
          <h2 className="text-display mt-2 text-[2rem] leading-none text-bb-text sm:text-4xl">
            At special prices
          </h2>
        </div>

        <div
          role="tablist"
          className="mt-8 flex justify-center gap-5 overflow-x-auto border-b border-bb-border pb-px sm:gap-8"
          aria-label="Collections"
        >
          {available.map((t) => {
            const isActive = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 pb-3 text-[0.72rem] tracking-[0.14em] uppercase transition ${
                  isActive ? 'text-bb-blue' : 'text-bb-muted hover:text-bb-text'
                }`}
              >
                {t.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-bb-blue" />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:mt-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to={viewAllTo}
            className="inline-flex border border-bb-blue px-8 py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-bb-blue uppercase transition hover:bg-bb-blue hover:text-white"
          >
            View all {active?.label ?? 'products'}
          </Link>
        </div>
      </div>
    </section>
  )
}
