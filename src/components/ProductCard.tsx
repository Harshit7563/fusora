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
  const { wishlist, toggleWish } = useStore()
  const savePct =
    p.was > p.price ? Math.round(((p.was - p.price) / p.was) * 100) : 0
  const badge = p.topDeal
    ? 'BESTSELLER'
    : savePct >= 40
      ? 'SALE'
      : savePct > 0
        ? 'NEW'
        : null

  return (
    <article className="group">
      <div className="relative mb-3 overflow-hidden bg-[#f7f5f3] gold-frame sm:mb-3.5">
        <Link to={`/product/${p.id}`}>
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>
        {badge && (
          <span className="absolute top-2.5 left-2.5 bg-white px-2 py-1 text-[0.58rem] font-semibold tracking-[0.12em] text-[#1a1a1a] uppercase">
            {badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          className="absolute top-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-white/95 text-[#1a1a1a] shadow-sm transition hover:opacity-80"
          aria-label="Save"
        >
          <Heart
            className={`size-3.5 ${wishlist.has(p.id) ? 'fill-[#b4232f] text-[#b4232f]' : ''}`}
            strokeWidth={1.5}
          />
        </button>
        {showAdd && (
          <Link
            to={`/product/${p.id}`}
            className="absolute inset-x-0 bottom-0 translate-y-full bg-[#5c2a2a] py-3 text-center text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase transition duration-300 group-hover:translate-y-0"
          >
            Discover this piece
          </Link>
        )}
      </div>
      <p className="text-[0.62rem] tracking-[0.14em] text-[#776865] uppercase">
        {p.categoryName || p.brand}
      </p>
      <Link
        to={`/product/${p.id}`}
        className="mt-1 line-clamp-2 block text-[0.88rem] leading-snug text-[#1a1a1a] transition group-hover:opacity-70"
      >
        {p.name}
      </Link>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="text-sm font-medium text-[#1a1a1a]">
          {formatMoney(p.price)}
        </p>
        {p.was > p.price && (
          <p className="text-xs text-[#776865] line-through">
            {formatMoney(p.was)}
          </p>
        )}
        {savePct > 0 && (
          <p className="text-xs font-medium text-[#b4232f]">-{savePct}%</p>
        )}
      </div>
    </article>
  )
}
