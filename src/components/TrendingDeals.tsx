import { Heart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { shopCategories, type CategoryId } from '../categories'
import { formatMoney, products } from '../data'
import { useStore } from '../context/StoreContext'

export function TrendingDeals() {
  const { addToCart, wishlist, toggleWish } = useStore()
  const tabsWithProducts = useMemo(
    () =>
      shopCategories.filter(
        (c) =>
          ['apparel-accessories', 'luggage-bags-cases', 'jewelry-eyewear-watches'].includes(
            c.id,
          ) && products.some((p) => p.tab === c.id),
      ),
    [],
  )
  const [tab, setTab] = useState<CategoryId>(
    tabsWithProducts[0]?.id ?? 'apparel-accessories',
  )

  const list = useMemo(
    () => products.filter((p) => p.tab === tab).slice(0, 8),
    [tab],
  )

  const activeLabel =
    shopCategories.find((c) => c.id === tab)?.label ?? 'Collection'

  return (
    <section id="deals" className="bg-white px-3 py-12 sm:px-4 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
              The edit
            </p>
            <h2 className="text-display mt-2 text-[1.65rem] text-bb-text sm:text-4xl">
              {activeLabel}
            </h2>
            <p className="mt-2 text-sm text-bb-muted">
              {list.length} pieces · Curated for this week
            </p>
          </div>
          <Link
            to={`/category/${tab}`}
            className="text-xs font-semibold tracking-[0.18em] text-bb-text uppercase underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div
          role="tablist"
          className="mt-8 flex gap-2 overflow-x-auto pb-1"
          aria-label="Collections"
        >
          {tabsWithProducts.map((t) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs tracking-wide transition ${
                  active
                    ? 'border-bb-blue bg-bb-blue text-[#f7f3ec]'
                    : 'border-bb-border bg-transparent text-bb-muted hover:border-bb-blue hover:text-bb-text'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            <article key={p.id} className="group">
              <div className="relative mb-3 overflow-hidden bg-bb-gray sm:mb-4">
                <Link to={`/product/${p.id}`}>
                  <img
                    src={p.image}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWish(p.id)}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/90 text-bb-text backdrop-blur sm:top-3 sm:right-3 sm:size-9"
                  aria-label="Save"
                >
                  <Heart
                    className={`size-3.5 sm:size-4 ${wishlist.has(p.id) ? 'fill-bb-save text-bb-save' : ''}`}
                  />
                </button>
                {p.topDeal && (
                  <span className="absolute top-2 left-2 bg-bb-blue px-1.5 py-0.5 text-[0.55rem] tracking-[0.12em] text-[#f7f3ec] uppercase sm:top-3 sm:left-3 sm:px-2 sm:py-1 sm:text-[0.6rem]">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-[0.6rem] tracking-[0.14em] text-bb-muted uppercase sm:text-[0.65rem] sm:tracking-[0.16em]">
                {p.brand}
              </p>
              <Link
                to={`/product/${p.id}`}
                className="mt-1 line-clamp-2 block text-[0.8rem] leading-snug text-bb-text group-hover:underline sm:text-sm"
              >
                {p.name}
              </Link>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5 sm:mt-2 sm:gap-2">
                <p className="text-sm font-semibold">{formatMoney(p.price)}</p>
                {p.was > p.price && (
                  <p className="text-xs text-bb-muted line-through">
                    {formatMoney(p.was)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => addToCart(p)}
                className="mt-2.5 w-full rounded-full border border-bb-border py-2 text-[0.6rem] font-semibold tracking-[0.14em] text-bb-text uppercase transition hover:border-bb-blue hover:bg-bb-blue hover:text-[#f7f3ec] sm:mt-3 sm:py-2.5 sm:text-[0.65rem] sm:tracking-[0.16em]"
              >
                Add to bag
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
