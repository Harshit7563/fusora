import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import { usePageTitle } from '../hooks/usePageTitle'

export function DealsPage() {
  const [params] = useSearchParams()
  const { products } = useCatalog()
  const q = (params.get('q') || '').trim().toLowerCase()
  usePageTitle(q ? `Search: ${params.get('q')}` : 'Sale')

  const list = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tab.includes(q),
      )
    : products.filter((p) => p.topDeal || p.was > p.price)

  const title = q ? `Results for “${params.get('q')}”` : 'Sale'

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

        {list.length === 0 ? (
          <p className="border border-dashed border-[#d9d9d9] bg-white px-6 py-16 text-center text-[#6a6667]">
            No products found.{' '}
            <Link to="/deals" className="font-bold text-[#cf2028] underline">
              Clear search
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
