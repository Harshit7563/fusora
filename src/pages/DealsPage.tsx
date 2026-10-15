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
      <div className="relative h-[28svh] min-h-[180px] overflow-hidden bg-[#5c4033] sm:h-[34svh]">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 px-4 text-center text-white">
          <h1 className="font-serif text-4xl tracking-wide text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/85">
            {list.length} items
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-3 py-8 sm:px-6 lg:px-10">
        <nav className="mb-6 text-xs text-[#6b6560]">
          <Link to="/" className="hover:text-[#6d1f2c]">
            Home
          </Link>
          <span className="mx-2">|</span>
          <span className="text-[#1c1c1c]">{title}</span>
        </nav>

        <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#e8e1d8] pb-4">
          <p className="text-sm text-[#6b6560]">{list.length} items</p>
          <p className="text-sm text-[#6b6560]">Sort by: Featured</p>
        </div>

        {list.length === 0 ? (
          <p className="border border-dashed border-[#e8e1d8] px-6 py-16 text-center text-[#6b6560]">
            No products found.{' '}
            <Link to="/deals" className="text-[#6d1f2c] underline">
              Clear search
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
