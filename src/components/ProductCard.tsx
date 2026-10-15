import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

/** Taneira-style card: image, title, price, heart */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish } = useStore()

  return (
    <article className="group">
      <div className="relative mb-3 overflow-hidden rounded-lg bg-[#f5f1eb]">
        <Link to={`/product/${p.id}`}>
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white/95 text-[#1c1c1c] shadow-sm transition hover:bg-white"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-[1rem] ${
              wishlist.has(p.id) ? 'fill-[#6d1f2c] text-[#6d1f2c]' : ''
            }`}
            strokeWidth={1.5}
          />
        </button>
      </div>
      <Link to={`/product/${p.id}`} className="block px-0.5">
        <p className="line-clamp-2 text-[0.82rem] leading-snug text-[#1c1c1c] transition group-hover:text-[#6d1f2c]">
          {p.name}
        </p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <p className="text-[0.9rem] font-semibold text-[#1c1c1c]">
            {formatMoney(p.price)}
          </p>
          {p.was > p.price && (
            <p className="text-xs text-[#6b6560] line-through">
              {formatMoney(p.was)}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
