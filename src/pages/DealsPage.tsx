import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'

export function DealsPage() {
  const [params] = useSearchParams()
  const { products } = useCatalog()
  const q = (params.get('q') || '').trim().toLowerCase()

  const list = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tab.includes(q),
      )
    : products.filter((p) => p.topDeal || p.was > p.price)

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
      <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
        {q ? 'Search' : 'The edit'}
      </p>
      <h1 className="text-display mt-2 text-3xl text-bb-text sm:text-4xl">
        {q ? `Results for “${params.get('q')}”` : 'Top picks'}
      </h1>
      <p className="mt-2 text-sm text-bb-muted">{list.length} items</p>

      {list.length === 0 ? (
        <p className="mt-12 border border-dashed border-bb-border px-6 py-16 text-center text-bb-muted">
          No products found.{' '}
          <Link to="/deals" className="text-bb-text underline">
            Clear search
          </Link>
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  )
}
