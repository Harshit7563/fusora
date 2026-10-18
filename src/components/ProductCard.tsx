import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type Product } from '../data'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

type Props = {
  product: Product
  showAdd?: boolean
}

/** Bla Bli Blu–style card: bordered tile, centered copy, BUY CTA */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish, addToCart } = useStore()
  const onSale = p.was > p.price

  return (
    <article className="group flex h-full flex-col border border-[#d9d9d9] bg-white transition hover:shadow-[0_3px_13px_#00000024]">
      <div className="relative overflow-hidden bg-[#f1efec]">
        <Link to={`/product/${p.id}`}>
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWish(p.id)}
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white text-[#070001] shadow-sm transition hover:scale-105"
          aria-label="Wishlist"
        >
          <Heart
            className={`size-[0.95rem] ${
              wishlist.has(p.id) ? 'fill-[#cf2028] text-[#cf2028]' : ''
            }`}
            strokeWidth={2}
          />
        </button>
        {onSale && (
          <span className="absolute top-2.5 left-2.5 bg-[#ffc462] px-2 py-0.5 font-heading text-[0.85rem] tracking-wide text-[#7f1714]">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col items-center gap-2 px-3 py-3 text-center">
        <Link to={`/product/${p.id}`} className="block w-full">
          <p className="line-clamp-2 min-h-[2.4em] text-[0.8rem] font-medium leading-snug text-[#070001]">
            {p.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-baseline justify-center gap-2">
            <p className="font-heading text-xl leading-none text-[#070001]">
              {formatMoney(p.price)}
            </p>
            {onSale && (
              <p className="text-xs font-medium text-[#6a6667] line-through">
                {formatMoney(p.was)}
              </p>
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={() => addToCart(p)}
          className="btn-outline mt-auto w-full max-w-[9rem]"
        >
          Buy
        </button>
      </div>
    </article>
  )
}
