import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

function categoryLabel(p: Product): string {
  if (p.tab === 'jewelry-eyewear-watches') return 'Artificial Jewellery'
  if (p.subtype) return p.subtype.replace(/-/g, ' ')
  if (p.categoryName) return p.categoryName
  return p.gender === 'men' ? 'Men' : p.gender === 'women' ? 'Women' : 'Fusora'
}

/** Souled-style card: portrait photo, wishlist heart, price + green discount */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish, addToCart } = useStore()
  const onSale = p.was > p.price
  const off = onSale ? Math.round(((p.was - p.price) / p.was) * 100) : 0

  return (
    <article className="group flex h-full flex-col bg-white">
      <div className="relative overflow-hidden bg-[#f4f2ee]">
        <Link to={`/product/${p.id}`}>
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white/95 text-[#070001] shadow-sm transition hover:scale-110"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-[0.95rem] ${
              wishlist.has(p.id) ? 'fill-[#cf2028] text-[#cf2028]' : ''
            }`}
            strokeWidth={2}
          />
        </button>
        {off >= 5 && (
          <span className="absolute bottom-2.5 left-2.5 bg-[#cf2028] px-1.5 py-0.5 text-[0.62rem] font-bold tracking-wide text-white uppercase">
            {off}% off
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pt-2.5 pb-1">
        <p className="text-[0.62rem] font-bold tracking-[0.12em] text-[#8a8585] uppercase">
          {categoryLabel(p)}
        </p>
        <Link to={`/product/${p.id}`} className="block">
          <p className="mt-0.5 line-clamp-2 min-h-[2.5em] text-[0.83rem] leading-snug font-medium text-[#262626]">
            {p.name}
          </p>
        </Link>
        {p.tab === 'jewelry-eyewear-watches' && (
          <p className="mt-0.5 text-[0.62rem] font-semibold tracking-wide text-[#cf2028] uppercase">
            Not real gold / diamond
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[0.95rem] font-bold text-[#070001]">
            {formatMoney(p.price)}
          </span>
          {onSale && (
            <>
              <span className="text-xs text-[#8a8585] line-through">
                {formatMoney(p.was)}
              </span>
              {off > 0 && (
                <span className="text-xs font-bold text-[#1f8a3b]">
                  ({off}% OFF)
                </span>
              )}
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(p)}
          className="mt-2.5 w-full border border-[#262626] py-2 text-[0.68rem] font-bold tracking-[0.14em] text-[#262626] uppercase transition hover:bg-[#cf2028] hover:border-[#cf2028] hover:text-white"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
