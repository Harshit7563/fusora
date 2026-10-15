import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

/** Kankatala-style card: tall image, heart, name + price row */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish } = useStore()

  return (
    <article className="group">
      <div className="relative mb-3 overflow-hidden bg-[#f5f3f1]">
        <Link to={`/product/${p.id}`}>
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center text-white drop-shadow-md transition hover:opacity-80"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-[1.05rem] ${wishlist.has(p.id) ? 'fill-white' : ''}`}
            strokeWidth={1.4}
          />
        </button>
      </div>
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/product/${p.id}`}
          className="min-w-0 flex-1 text-[0.8rem] leading-snug text-[#121212] transition group-hover:opacity-70"
        >
          <span className="line-clamp-2">{p.name}</span>
        </Link>
        <p className="shrink-0 text-[0.8rem] font-medium text-[#121212]">
          {formatMoney(p.price)}
        </p>
      </div>
      {p.was > p.price && (
        <p className="mt-0.5 text-xs text-[#6b6560] line-through">
          {formatMoney(p.was)}
        </p>
      )}
    </article>
  )
}
