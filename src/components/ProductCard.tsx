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

function isNew(p: Product): boolean {
  if (!p.uploadedAt) return false
  const t = new Date(String(p.uploadedAt)).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() - t < 45 * 24 * 3600 * 1000
}

/** Storefront card: portrait photo, hover second photo, wishlist, price + green discount */
export function ProductCard({ product: p }: Props) {
  const { wishlist, toggleWish, addToCart } = useStore()
  const onSale = p.was > p.price
  const off = onSale ? Math.round(((p.was - p.price) / p.was) * 100) : 0
  const secondImage = p.images?.find((img) => img && img !== p.image)

  return (
    <article className="group flex h-full flex-col bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.10)]">
      <div className="relative overflow-hidden bg-[#f4f2ee]">
        <Link to={`/product/${p.id}`} className="relative block">
          <SafeImage
            src={p.image}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
          {secondImage && (
            <SafeImage
              src={secondImage}
              alt=""
              className="absolute inset-0 aspect-[3/4] w-full object-cover object-center opacity-0 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {isNew(p) && (
            <span className="bg-[#141414] px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] text-white uppercase">
              New
            </span>
          )}
          {p.topDeal && (
            <span className="bg-[#ffc462] px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] text-[#7f1714] uppercase">
              Bestseller
            </span>
          )}
        </div>

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
          <span className="absolute bottom-2.5 left-2.5 bg-[#cf2028] px-1.5 py-0.5 text-[0.62rem] font-bold tracking-wide text-white uppercase shadow-sm">
            {off}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.62rem] font-bold tracking-[0.14em] text-[#8a8585] uppercase">
            {categoryLabel(p)}
          </p>
          {p.brand && (
            <p className="line-clamp-1 text-[0.62rem] font-semibold tracking-[0.08em] text-[#b3aca4] uppercase">
              {p.brand}
            </p>
          )}
        </div>
        <Link to={`/product/${p.id}`} className="block">
          <p className="mt-1 line-clamp-2 min-h-[2.55em] text-[0.86rem] leading-snug font-medium text-[#262626] transition group-hover:text-[#cf2028]">
            {p.name}
          </p>
        </Link>
        {p.tab === 'jewelry-eyewear-watches' && (
          <p className="mt-0.5 text-[0.62rem] font-semibold tracking-wide text-[#cf2028] uppercase">
            Not real gold / diamond
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[1rem] font-bold text-[#070001]">
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
          className="mt-3 w-full rounded-full border border-[#262626] py-2.5 text-[0.68rem] font-bold tracking-[0.16em] text-[#262626] uppercase transition hover:border-[#cf2028] hover:bg-[#cf2028] hover:text-white active:scale-[0.99]"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
