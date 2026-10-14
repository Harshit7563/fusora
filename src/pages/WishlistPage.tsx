import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useCatalog } from '../hooks/useCatalog'
import { ProductCard } from '../components/ProductCard'

export function WishlistPage() {
  usePageTitle('Wishlist')
  const { wishlist } = useStore()
  const { products } = useCatalog()
  const list = products.filter((p) => wishlist.has(p.id))

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
      <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
        Saved
      </p>
      <h1 className="font-serif mt-2 text-4xl text-bb-text">Your wishlist</h1>
      <p className="mt-2 text-sm text-bb-muted">
        {list.length} saved piece{list.length === 1 ? '' : 's'}
      </p>

      {list.length === 0 ? (
        <div className="mt-14 border border-dashed border-bb-border px-6 py-16 text-center">
          <Heart className="mx-auto size-8 text-bb-muted" />
          <p className="mt-4 font-semibold text-bb-text">Wishlist is empty</p>
          <p className="mt-1 text-sm text-bb-muted">
            Tap the heart on any product to save it here.
          </p>
          <Link
            to="/deals"
            className="mt-6 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
          >
            Browse shop
          </Link>
        </div>
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
