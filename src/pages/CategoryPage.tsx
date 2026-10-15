import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { getCategory } from '../categories'
import {
  ALL_APPAREL_SUBTYPES,
  apparelSubtypes,
  denimCollections,
  dyntraFabricCategories,
  type ApparelSubtype,
} from '../data/apparel'
import { type CategoryId } from '../data'
import { ProductCard } from '../components/ProductCard'
import { SafeImage } from '../components/SafeImage'
import { useCatalog } from '../hooks/useCatalog'
import { usePageTitle } from '../hooks/usePageTitle'
import { getProductGender, matchesGender, type Gender } from '../lib/gender'

export function CategoryPage() {
  const { tab, subtype: subtypeParam, collection: collectionParam } =
    useParams()
  const { products } = useCatalog()
  const [sort, setSort] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(true)

  const active = (tab as CategoryId) || 'apparel-accessories'
  const meta = getCategory(active)
  const isApparel = active === 'apparel-accessories'
  const isGenderShop = active === 'men' || active === 'women'
  const shopGender: Gender | null = isGenderShop ? (active as Gender) : null

  const subtype =
    subtypeParam && ALL_APPAREL_SUBTYPES.includes(subtypeParam as ApparelSubtype)
      ? (subtypeParam as ApparelSubtype)
      : null

  const genderDenimCollections = useMemo(() => {
    if (active === 'men') {
      return denimCollections.filter((c) => c.id === 'mens-jeans')
    }
    if (active === 'women') {
      return denimCollections.filter((c) => c.id === 'womens-jeans')
    }
    return denimCollections
  }, [active])

  const denimCollection =
    subtype === 'jeans' &&
    collectionParam &&
    denimCollections.some((c) => c.id === collectionParam)
      ? collectionParam
      : null

  const sareeFabric =
    subtype === 'sarees' &&
    collectionParam &&
    dyntraFabricCategories.some((c) => c.id === collectionParam)
      ? collectionParam
      : null

  const collection = denimCollection || sareeFabric

  const list = useMemo(() => {
    let rows = products.filter((p) => {
      if (shopGender) {
        if (!matchesGender(p, shopGender)) return false
        if (subtype && p.subtype !== subtype) return false
        if (
          collection &&
          p.collection !== collection &&
          p.categorySlug !== collection
        ) {
          return false
        }
        return true
      }
      if (p.tab !== active) return false
      if (isApparel && subtype) {
        if (p.subtype !== subtype) return false
        if (
          collection &&
          p.collection !== collection &&
          p.categorySlug !== collection
        ) {
          return false
        }
        if (collection === 'mens-jeans' && getProductGender(p) !== 'men') {
          return false
        }
        if (collection === 'womens-jeans' && getProductGender(p) !== 'women') {
          return false
        }
      }
      return true
    })

    if (sort === 'price-asc') rows = [...rows].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') rows = [...rows].sort((a, b) => b.price - a.price)
    if (sort === 'new') rows = [...rows].sort((a, b) => Number(b.topDeal) - Number(a.topDeal))
    return rows
  }, [active, isApparel, subtype, collection, shopGender, products, sort])

  const genderSubtypes = useMemo(() => {
    if (active === 'men') return apparelSubtypes.filter((s) => s.id !== 'sarees')
    return apparelSubtypes
  }, [active])

  const fabricTiles = useMemo(() => {
    return dyntraFabricCategories
      .map((c) => {
        const cover = products.find(
          (p) =>
            p.subtype === 'sarees' &&
            (p.collection === c.id || p.categorySlug === c.id) &&
            p.image,
        )
        const count = products.filter(
          (p) =>
            p.subtype === 'sarees' &&
            (p.collection === c.id || p.categorySlug === c.id),
        ).length
        return { ...c, cover: cover?.image, count }
      })
      .filter((c) => c.count > 0)
  }, [products])

  const subtypeMeta = apparelSubtypes.find((s) => s.id === subtype)
  const denimMeta = denimCollections.find((c) => c.id === denimCollection)
  const fabricMeta = dyntraFabricCategories.find((c) => c.id === sareeFabric)
  const showGenderLanding = isGenderShop && !subtype
  const showApparelLanding = isApparel && !subtype
  const showJeansLanding = subtype === 'jeans' && !denimCollection
  const showSareeLanding =
    subtype === 'sarees' && !sareeFabric && active !== 'men'

  const title =
    denimMeta?.label || fabricMeta?.label || subtypeMeta?.label || meta.label

  const blurb =
    denimMeta?.blurb ||
    (fabricMeta
      ? `${fabricMeta.label} from the Fusora edit`
      : subtypeMeta?.blurb) ||
    (isGenderShop
      ? active === 'men'
        ? 'Men only — jeans, shirts and everyday wear.'
        : 'Women only — sarees, jeans and festive apparel.'
      : 'Carefully chosen pieces for every occasion.')

  const bannerImage =
    subtypeMeta?.image ||
    denimMeta?.image ||
    fabricTiles[0]?.cover ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80'

  usePageTitle(title)

  const showProductGrid =
    !showApparelLanding &&
    !showGenderLanding &&
    !showJeansLanding &&
    !(showSareeLanding && subtype === 'sarees')

  const showSareeAllGrid = subtype === 'sarees' && active !== 'men'

  return (
    <main className="bg-white">
      {/* Category banner */}
      <div className="relative h-[26svh] min-h-[160px] overflow-hidden bg-[#5c4033] sm:h-[32svh]">
        <img
          src={bannerImage}
          alt=""
          className="h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center text-white">
          <h1 className="font-serif text-4xl tracking-wide sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">{blurb}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-3 py-6 sm:px-6 lg:px-10">
        <nav className="mb-6 text-xs text-[#6e6a65]">
          <Link to="/" className="hover:text-[#8b1538]">
            Home
          </Link>
          <span className="mx-2">|</span>
          <Link to={`/category/${active}`} className="hover:text-[#8b1538]">
            {meta.label}
          </Link>
          {subtypeMeta && (
            <>
              <span className="mx-2">|</span>
              <span className="text-[#1a1a1a]">{subtypeMeta.label}</span>
            </>
          )}
        </nav>

        {(isApparel || isGenderShop) && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              to={`/category/${active}`}
              className="pill-tab"
              data-active={!subtype}
            >
              All
            </Link>
            {genderSubtypes.map((s) => (
              <Link
                key={s.id}
                to={`/category/${active}/${s.id}`}
                className="pill-tab"
                data-active={subtype === s.id}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}

        {(showApparelLanding || showGenderLanding) && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {genderSubtypes.map((s) => {
              const count = products.filter((p) => {
                if (p.subtype !== s.id) return false
                if (shopGender) return matchesGender(p, shopGender)
                return p.tab === 'apparel-accessories'
              }).length
              return (
                <Link
                  key={s.id}
                  to={`/category/${active}/${s.id}`}
                  className="group relative aspect-[3/4] overflow-hidden"
                >
                  <SafeImage
                    src={s.image}
                    alt={s.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h2 className="font-serif text-xl sm:text-2xl">{s.label}</h2>
                    <p className="mt-1 text-[0.65rem] tracking-[0.14em] uppercase opacity-85">
                      {count} pieces
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {showJeansLanding && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genderDenimCollections.map((c) => {
              const count = products.filter(
                (p) =>
                  p.subtype === 'jeans' &&
                  p.collection === c.id &&
                  (!shopGender || matchesGender(p, shopGender)),
              ).length
              const jeansBase = isGenderShop
                ? `/category/${active}/jeans`
                : '/category/apparel-accessories/jeans'
              return (
                <Link
                  key={c.id}
                  to={`${jeansBase}/${c.id}`}
                  className="group relative aspect-[3/4] overflow-hidden"
                >
                  <SafeImage
                    src={c.image}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h2 className="font-serif text-2xl">{c.label}</h2>
                    <p className="mt-1 text-sm text-white/85">{c.blurb}</p>
                    <p className="mt-2 text-[0.65rem] tracking-[0.14em] uppercase">
                      {count} styles
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {showSareeLanding && (
          <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {fabricTiles.map((c) => (
              <Link
                key={c.id}
                to={`/category/${active}/sarees/${c.id}`}
                className="group relative aspect-[4/5] overflow-hidden bg-[#f7f5f2]"
              >
                {c.cover ? (
                  <SafeImage
                    src={c.cover}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                  <h2 className="font-serif text-lg sm:text-xl">{c.label}</h2>
                  <p className="mt-1 text-[0.65rem] tracking-[0.14em] uppercase opacity-85">
                    {c.count} pieces
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {(showProductGrid || showSareeAllGrid || denimCollection) && (
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            {/* Filter sidebar */}
            <aside className="hidden lg:block">
              <h2 className="mb-4 font-serif text-2xl text-[#8b1538]">Filter</h2>
              <div className="border-t border-[#ebe6df] py-4">
                <p className="mb-3 flex items-center justify-between text-sm font-medium">
                  Availability <ChevronDown className="size-4" />
                </p>
                <label className="mb-2 flex items-center gap-2 text-sm text-[#6e6a65]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#8b1538]"
                  />
                  In stock ({list.length})
                </label>
                <label className="flex items-center gap-2 text-sm text-[#6e6a65]">
                  <input type="checkbox" disabled className="accent-[#8b1538]" />
                  Out of stock (0)
                </label>
              </div>
              <div className="border-t border-[#ebe6df] py-4">
                <p className="mb-3 flex items-center justify-between text-sm font-medium">
                  Category <ChevronDown className="size-4" />
                </p>
                <div className="space-y-2">
                  {(isApparel || isGenderShop
                    ? genderSubtypes
                    : [{ id: 'all', label: meta.label }]
                  ).map((s) => (
                    <Link
                      key={s.id}
                      to={
                        'id' in s && s.id !== 'all'
                          ? `/category/${active}/${s.id}`
                          : `/category/${active}`
                      }
                      className={`block text-sm ${
                        subtype === ('id' in s ? s.id : null)
                          ? 'text-[#8b1538]'
                          : 'text-[#6e6a65] hover:text-[#8b1538]'
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              {showSareeAllGrid && showSareeLanding && (
                <h2 className="mb-6 font-serif text-2xl text-[#8b1538] sm:text-3xl">
                  All sarees
                </h2>
              )}

              <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#ebe6df] pb-4">
                <p className="text-sm text-[#6e6a65]">{list.length} items</p>
                <label className="flex items-center gap-2 text-sm text-[#6e6a65]">
                  Sort by
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-[#ebe6df] bg-white px-2 py-1.5 text-sm text-[#1a1a1a] outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="new">New</option>
                    <option value="price-asc">Price, low to high</option>
                    <option value="price-desc">Price, high to low</option>
                  </select>
                </label>
              </div>

              {list.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#ebe6df] px-6 py-20 text-center">
      <p className="font-serif text-3xl text-[#8b1538]">Coming soon</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-[#6e6a65]">
        We&apos;re stocking this collection. Browse other categories meanwhile.
      </p>
      <Link
        to="/category/women"
        className="mt-8 inline-flex border border-[#8b1538] px-6 py-3 text-xs tracking-[0.16em] text-[#8b1538] uppercase"
      >
        Shop women
      </Link>
    </div>
  )
}
