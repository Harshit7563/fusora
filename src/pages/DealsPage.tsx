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
    <main className="bg-white">
      <div className="border-b border-[#eee] bg-[#fafafa] px-3 py-10 text-center sm:px-5 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111] uppercase sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm font-medium text-[#666]">{list.length} items</p>
      </div>

      <div className="mx-auto max-w-[1400px] px-3 py-8 sm:px-5 lg:px-8">
        <nav className="mb-6 text-xs font-semibold text-[#666]">
          <Link to="/" className="hover:text-[#e30613]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#111]">{title}</span>
        </nav>

        {list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#ddd] px-6 py-16 text-center text-[#666]">
            No products found.{' '}
            <Link to="/deals" className="font-bold text-[#e30613] underline">
              Clear search
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
