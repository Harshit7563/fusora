import { Heart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getCategory, shopCategories } from '../categories'
import { apparelSubtypes, type ApparelSubtype } from '../data/apparel'
import { formatMoney, products, type CategoryId } from '../data'
import { useStore } from '../context/StoreContext'

const navCats = [
  'apparel-accessories',
  'luggage-bags-cases',
  'jewelry-eyewear-watches',
] as const

export function CategoryPage() {
  const { tab, subtype: subtypeParam } = useParams()
  const { addToCart, wishlist, toggleWish } = useStore()
  const active = (tab as CategoryId) || 'apparel-accessories'
  const meta = getCategory(active)
  const isApparel = active === 'apparel-accessories'

  const subtype =
    subtypeParam &&
    ['tshirts', 'shirts', 'sarees', 'jeans'].includes(subtypeParam)
      ? (subtypeParam as ApparelSubtype)
      : null

  const list = products.filter((p) => {
    if (p.tab !== active) return false
    if (isApparel && subtype) return p.subtype === subtype
    return true
  })

  const chipCats = shopCategories.filter((c) =>
    (navCats as readonly string[]).includes(c.id),
  )

  const subtypeMeta = apparelSubtypes.find((s) => s.id === subtype)
  const showApparelLanding = isApparel && !subtype
  const showGrid = !isApparel || Boolean(subtype) || showApparelLanding

  return (
    <main className="mx-auto max-w-[1400px] px-3 py-8 sm:px-4 sm:py-10 lg:px-8">
      <nav className="mb-4 text-[0.65rem] tracking-wide text-bb-muted uppercase sm:mb-6 sm:text-xs">
        <Link to="/" className="hover:text-bb-text">
          Home
        </Link>
        {' / '}
        <Link to={`/category/${active}`} className="hover:text-bb-text">
          {meta.label}
        </Link>
        {subtypeMeta && (
          <>
            {' / '}
            <span className="text-bb-text">{subtypeMeta.label}</span>
          </>
        )}
      </nav>

      <div className="max-w-2xl">
        <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
          Collection
        </p>
        <h1 className="text-display mt-2 text-[1.85rem] text-bb-text sm:text-5xl">
          {subtypeMeta ? subtypeMeta.label : meta.label}
        </h1>
        <p className="mt-3 text-sm text-bb-muted">
          {subtypeMeta
            ? subtypeMeta.blurb
            : `${list.length} product${list.length === 1 ? '' : 's'}`}
          {subtypeMeta && (
            <>
              {' '}
              · {list.length} piece{list.length === 1 ? '' : 's'}
            </>
          )}
        </p>
        {subtype === 'sarees' && (
          <p className="mt-2 text-xs tracking-wide text-bb-muted">
            Catalogue sourced from Dyntra (dyntra.in)
          </p>
        )}
        {subtype === 'jeans' && (
          <p className="mt-2 text-xs tracking-wide text-bb-muted">
            Catalogue sourced from The Denim Forge (thedenimforge.com)
          </p>
        )}
        {isApparel && !subtype && (
          <p className="mt-2 text-xs tracking-wide text-bb-muted">
            Dyntra sarees · Modcart · The Denim Forge jeans
          </p>
        )}
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {chipCats.map((t) => (
          <Link
            key={t.id}
            to={`/category/${t.id}`}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-xs tracking-wide ${
              t.id === active && !subtype
                ? 'border-bb-blue bg-bb-blue text-[#f7f3ec]'
                : 'border-bb-border text-bb-muted hover:border-bb-blue hover:text-bb-text'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {isApparel && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/category/apparel-accessories"
            className={`rounded-full border px-4 py-2 text-xs tracking-wide ${
              !subtype
                ? 'border-bb-blue bg-bb-blue text-[#f7f3ec]'
                : 'border-bb-border text-bb-muted hover:border-bb-blue'
            }`}
          >
            All apparel
          </Link>
          {apparelSubtypes.map((s) => (
            <Link
              key={s.id}
              to={`/category/apparel-accessories/${s.id}`}
              className={`rounded-full border px-4 py-2 text-xs tracking-wide ${
                subtype === s.id
                  ? 'border-bb-blue bg-bb-blue text-[#f7f3ec]'
                  : 'border-bb-border text-bb-muted hover:border-bb-blue'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {showApparelLanding && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {apparelSubtypes.map((s) => {
            const count = products.filter(
              (p) => p.tab === 'apparel-accessories' && p.subtype === s.id,
            ).length
            return (
              <Link
                key={s.id}
                to={`/category/apparel-accessories/${s.id}`}
                className="group relative aspect-[3/4] overflow-hidden bg-bb-gray sm:aspect-[4/5]"
              >
                <img
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bb-blue/85 via-bb-blue/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-[#f7f3ec] sm:p-5">
                  <h2 className="text-display text-lg sm:text-2xl">{s.label}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-[#e8dfd0]/90 sm:text-sm">
                    {s.blurb}
                  </p>
                  <p className="mt-2 text-[0.55rem] tracking-[0.14em] uppercase sm:mt-3 sm:text-[0.65rem] sm:tracking-[0.18em]">
                    {count} pieces · Shop now
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {showGrid && list.length === 0 ? (
        <div className="mt-16 border border-dashed border-bb-border px-6 py-20 text-center">
          <p className="text-display text-3xl text-bb-text">Coming soon</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-bb-muted">
            We&apos;re stocking this collection. Browse other categories
            meanwhile.
          </p>
          <Link
            to="/category/apparel-accessories"
            className="mt-8 inline-flex rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.18em] text-[#f7f3ec] uppercase"
          >
            Back to apparel
          </Link>
        </div>
      ) : null}

      {showGrid && list.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            <article key={p.id} className="group">
              <div className="relative mb-3 overflow-hidden bg-bb-gray sm:mb-4">
                <Link to={`/product/${p.id}`}>
                  <img
                    src={p.image}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWish(p.id)}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/90 sm:top-3 sm:right-3 sm:size-9"
                  aria-label="Save"
                >
                  <Heart
                    className={`size-3.5 sm:size-4 ${wishlist.has(p.id) ? 'fill-bb-save text-bb-save' : ''}`}
                  />
                </button>
              </div>
              <p className="text-[0.6rem] tracking-[0.14em] text-bb-muted uppercase sm:text-[0.65rem]">
                {p.brand}
              </p>
              <Link
                to={`/product/${p.id}`}
                className="mt-1 line-clamp-2 block text-[0.8rem] text-bb-text group-hover:underline sm:text-sm"
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
                className="mt-2.5 w-full rounded-full border border-bb-border py-2 text-[0.6rem] font-semibold tracking-[0.14em] uppercase transition hover:bg-bb-blue hover:text-[#f7f3ec] sm:mt-3 sm:py-2.5 sm:text-[0.65rem]"
              >
                Add to bag
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
