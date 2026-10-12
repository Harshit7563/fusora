import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

export function ProductCard({ product: p, showAdd = true }: Props) {
  const { addToCart, wishlist, toggleWish } = useStore()
  const savePct =
    p.was > p.price ? Math.round(((p.was - p.price) / p.was) * 100) : 0

  return (
    <article className="group">
      <div className="relative mb-3 overflow-hidden bg-bb-gray sm:mb-3.5">
        <Link to={`/product/${p.id}`}>
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        {savePct > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-bb-save px-2 py-1 text-[0.6rem] font-semibold tracking-wide text-white">
            -{savePct}%
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          className="absolute top-2.5 right-2.5 grid size-9 place-items-center bg-white/92 text-bb-text shadow-sm transition hover:text-bb-blue"
          aria-label="Save"
        >
          <Heart
            className={`size-3.5 ${wishlist.has(p.id) ? 'fill-bb-save text-bb-save' : ''}`}
            strokeWidth={1.5}
          />
        </button>
        {showAdd && (
          <button
            type="button"
            onClick={() => addToCart(p)}
            className="absolute inset-x-0 bottom-0 translate-y-full bg-bb-blue py-3 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase transition duration-300 group-hover:translate-y-0"
          >
            Add to bag
          </button>
        )}
      </div>
      <p className="text-[0.62rem] tracking-[0.14em] text-bb-muted uppercase">
        {p.categoryName || p.brand}
      </p>
      <Link
        to={`/product/${p.id}`}
        className="mt-1 line-clamp-2 block text-[0.9rem] leading-snug text-bb-text transition group-hover:text-bb-blue"
      >
        {p.name}
      </Link>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="text-sm font-semibold text-bb-price">
          {formatMoney(p.price)}
        </p>
        {p.was > p.price && (
          <p className="text-xs text-bb-muted line-through">
            {formatMoney(p.was)}
          </p>
        )}
      </div>
    </article>
  )
}
