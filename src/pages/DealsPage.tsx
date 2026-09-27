import { Heart } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatMoney, products } from '../data'
import { useStore } from '../context/StoreContext'

export function DealsPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim().toLowerCase()
  const { addToCart, wishlist, toggleWish } = useStore()

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
      <h1 className="text-display mt-2 text-4xl text-bb-text">
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
            <article key={p.id} className="group">
              <div className="relative mb-4 overflow-hidden bg-bb-gray">
                <Link to={`/product/${p.id}`}>
                  <img
                    src={p.image}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWish(p.id)}
                  className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90"
                  aria-label="Save"
                >
                  <Heart
                    className={`size-4 ${wishlist.has(p.id) ? 'fill-bb-save text-bb-save' : ''}`}
                  />
                </button>
              </div>
              <p className="text-[0.65rem] tracking-[0.16em] text-bb-muted uppercase">
                {p.brand}
              </p>
              <Link
                to={`/product/${p.id}`}
                className="mt-1 line-clamp-2 block text-sm text-bb-text group-hover:underline"
              >
                {p.name}
              </Link>
              <p className="mt-2 text-sm font-semibold">{formatMoney(p.price)}</p>
              <button
                type="button"
                onClick={() => addToCart(p)}
                className="mt-3 w-full rounded-full border border-bb-border py-2.5 text-[0.65rem] font-semibold tracking-[0.16em] uppercase transition hover:bg-bb-blue hover:text-[#f7f3ec]"
              >
                Add to bag
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
