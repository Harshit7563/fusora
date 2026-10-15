import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { CategoryStrip } from '../components/CategoryStrip'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { TrustBar } from '../components/TrustBar'
import { useCatalog } from '../hooks/useCatalog'

const PAGE = 24

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const [visible, setVisible] = useState(PAGE)

  const list = useMemo(() => products, [products])
  const shown = list.slice(0, visible)
  const hasMore = visible < list.length

  return (
    <main className="bg-white">
      <Hero />
      <CategoryStrip />

      {/* All products first */}
      <section className="px-3 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-medium tracking-[0.22em] text-[#8a7e7a] uppercase">
                Shop the collection
              </p>
              <h2 className="mt-1 font-serif text-[1.55rem] text-[#5c2a2a] sm:text-3xl">
                All products
              </h2>
              <p className="mt-1 text-sm text-[#8a7e7a]">
                {list.length} pieces
              </p>
            </div>
            <Link
              to="/deals"
              className="text-[0.68rem] font-semibold tracking-[0.14em] text-[#5c2a2a] uppercase underline underline-offset-4"
            >
              Filters →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => n + PAGE)}
                className="rounded-[4px] border border-[#5c2a2a] px-10 py-3.5 text-[0.7rem] font-semibold tracking-[0.18em] text-[#5c2a2a] uppercase transition hover:bg-[#5c2a2a] hover:text-white"
              >
                Load more ({list.length - visible} left)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Other */}
      <TrustBar />

      <section className="border-t border-[#e8e0d8] px-3 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-3 sm:gap-5">
          {[
            { label: 'Women', to: '/category/women', line: 'Sarees & apparel' },
            { label: 'Men', to: '/category/men', line: 'Jeans & everyday' },
            { label: 'Sale', to: '/deals', line: 'Special prices' },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="rounded-[6px] border border-[#c5a059] px-5 py-8 text-center transition hover:bg-[#f7f5f3]"
            >
              <p className="font-serif text-xl text-[#5c2a2a]">{c.label}</p>
              <p className="mt-1 text-xs tracking-[0.14em] text-[#8a7e7a] uppercase">
                {c.line}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
