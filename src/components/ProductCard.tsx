import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

/** Nalli-style card: clean image, title, price */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish } = useStore()

  return (
    <article className="group">
      <div className="relative mb-3 overflow-hidden bg-[#f7f5f2]">
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
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white/90 text-[#1a1a1a] shadow-sm transition hover:bg-white"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-[1rem] ${
              wishlist.has(p.id) ? 'fill-[#8b1538] text-[#8b1538]' : ''
            }`}
            strokeWidth={1.4}
          />
        </button>
      </div>
      <Link to={`/product/${p.id}`} className="block">
        <p className="line-clamp-2 text-[0.8rem] leading-snug text-[#1a1a1a] transition group-hover:text-[#8b1538]">
          {p.name}
        </p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <p className="text-[0.85rem] font-medium text-[#1a1a1a]">
            {formatMoney(p.price)}
          </p>
          {p.was > p.price && (
            <p className="text-xs text-[#6e6a65] line-through">
              {formatMoney(p.was)}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
