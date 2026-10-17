import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

/** Bear House–style card: clean image, bold price, heart */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish } = useStore()
  const onSale = p.was > p.price

  return (
    <article className="group">
      <div className="relative mb-2.5 overflow-hidden rounded-xl bg-[#f5f5f5]">
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
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white text-[#111] shadow-sm transition hover:scale-105"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-[0.95rem] ${
              wishlist.has(p.id) ? 'fill-[#e30613] text-[#e30613]' : ''
            }`}
            strokeWidth={2}
          />
        </button>
        {onSale && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#e30613] px-2 py-0.5 text-[0.58rem] font-bold tracking-wide text-white uppercase">
            Sale
          </span>
        )}
      </div>
      <Link to={`/product/${p.id}`} className="block px-0.5">
        <p className="line-clamp-2 min-h-[2.35em] text-[0.78rem] font-medium leading-snug text-[#222]">
          {p.name}
        </p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <p className="text-[0.92rem] font-bold text-[#111]">
            {formatMoney(p.price)}
          </p>
          {onSale && (
            <p className="text-xs font-medium text-[#888] line-through">
              {formatMoney(p.was)}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
