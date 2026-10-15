import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish } = useStore()
  const savePct =
    p.was > p.price ? Math.round(((p.was - p.price) / p.was) * 100) : 0

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
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center text-white drop-shadow transition hover:opacity-80"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-4 ${wishlist.has(p.id) ? 'fill-white' : ''}`}
            strokeWidth={1.4}
          />
        </button>
        {savePct > 0 && (
          <span className="absolute bottom-2.5 left-2.5 bg-white/95 px-2 py-0.5 text-[0.62rem] tracking-wide text-[#6b161d]">
            -{savePct}%
          </span>
        )}
      </div>
      <Link
        to={`/product/${p.id}`}
        className="line-clamp-2 block text-[0.82rem] leading-snug text-[#121212] transition group-hover:opacity-70"
      >
        {p.name}
      </Link>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <p className="text-sm font-medium text-[#121212]">
          {formatMoney(p.price)}
        </p>
        {p.was > p.price && (
          <p className="text-xs text-[#6b6560] line-through">
            {formatMoney(p.was)}
          </p>
        )}
      </div>
    </article>
  )
}
