import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatMoney } from '../data'

export function DealsPage() {
  const [params] = useSearchParams()
  const { products } = useCatalog()
  const q = (params.get('q') || '').trim().toLowerCase()
  const maxRaw = Number(params.get('max') || 0)
  const max = Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : 0

  usePageTitle(
    q ? `Search: ${params.get('q')}` : max ? `Under ${formatMoney(max)}` : 'Sale',
  )

  let list = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tab.includes(q),
      )
    : products.filter((p) => p.topDeal || p.was > p.price)

  if (max) list = list.filter((p) => p.price <= max)
  list = [...list].sort((a, b) => a.price - b.price)

  const title = q
    ? `Results for “${params.get('q')}”`
    : max
      ? `Under ${formatMoney(max)}`
      : 'Sale'

  return (
    <main className="bg-[#f8f6ee]">
      <div className="bbb-red-band px-3 py-12 text-center sm:px-5 sm:py-14">
        <h1 className="font-display text-5xl tracking-[0.1em] text-[#ffc462] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-2 font-heading text-lg text-white/80">
          {list.length} items
        </p>
      </div>

      <div className="mx-auto max-w-[1200px] px-3 py-8 sm:px-5 lg:px-4">
        <nav className="mb-6 text-xs font-semibold text-[#6a6667]">
          <Link to="/" className="hover:text-[#cf2028]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#070001]">{title}</span>
        </nav>

        {max > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#141414] py-1.5 pr-2 pl-4 text-xs font-bold text-white">
              Price: up to {formatMoney(max)}
              <Link
                to="/deals"
                aria-label="Clear price filter"
                className="grid size-5 place-items-center rounded-full bg-white/15 transition hover:bg-[#cf2028]"
              >
                <X className="size-3" />
              </Link>
            </span>
            {[999, 1499, 2999].map((m) => (
              <Link
                key={m}
                to={`/deals?max=${m}`}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  max === m
                    ? 'border-[#141414] bg-[#141414] text-white'
                    : 'border-[#d9d9d9] bg-white text-[#262626] hover:border-[#141414]'
                }`}
              >
                Under {formatMoney(m)}
              </Link>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <p className="border border-dashed border-[#d9d9d9] bg-white px-6 py-16 text-center text-[#6a6667]">
            No products found.{' '}
            <Link to="/deals" className="font-bold text-[#cf2028] underline">
              Clear filter
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
