import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { getCategory } from '../categories'
import {
  ALL_APPAREL_SUBTYPES,
  apparelSubtypes,
  denimCollections,
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
  const [searchParams] = useSearchParams()
  const showAll = searchParams.get('all') === '1'
  const { products } = useCatalog()
  const [sort, setSort] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(48)

  useEffect(() => {
    setVisibleCount(48)
  }, [tab, subtypeParam, collectionParam, showAll])

  const active = (tab as CategoryId) || 'apparel-accessories'
  const meta = getCategory(active)
  const isApparel = active === 'apparel-accessories'
  const isGenderShop = active === 'men' || active === 'women'
  const shopGender: Gender | null = isGenderShop ? (active as Gender) : null

  const subtype =
    subtypeParam && ALL_APPAREL_SUBTYPES.includes(subtypeParam as ApparelSubtype)
      ? (subtypeParam as ApparelSubtype)
      : null

  const redirectSareeFabric = subtype === 'sarees' && Boolean(collectionParam)

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

  const collection = denimCollection

  const list = useMemo(() => {
    let rows = products.filter((p) => {
      if (shopGender) {
        if (!matchesGender(p, shopGender)) return false
        if (subtype && p.subtype !== subtype) return false
        if (subtype === 'sarees') return true
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
        if (subtype === 'sarees') return true
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
    if (sort === 'new')
      rows = [...rows].sort((a, b) => Number(b.topDeal) - Number(a.topDeal))
    return rows
  }, [active, isApparel, subtype, collection, shopGender, products, sort])

  const genderSubtypes = useMemo(() => {
    if (active === 'men')
      return apparelSubtypes.filter(
        (s) => s.id !== 'sarees' && s.id !== 'dresses',
      )
    return apparelSubtypes
  }, [active])

  const subtypeMeta = apparelSubtypes.find((s) => s.id === subtype)
  const denimMeta = denimCollections.find((c) => c.id === denimCollection)
  // "All" (?all=1) shows every product as a grid — no category tiles
  const showGenderLanding = isGenderShop && !subtype && !showAll
  const showApparelLanding = isApparel && !subtype && !showAll
  const showJeansLanding = subtype === 'jeans' && !denimCollection

  const title = denimMeta?.label || subtypeMeta?.label || meta.label

  const blurb =
    denimMeta?.blurb ||
    subtypeMeta?.blurb ||
    (isGenderShop
      ? active === 'men'
        ? 'Men only — jeans, shirts and everyday wear.'
        : 'Women only — sarees, jeans and festive apparel.'
      : 'Carefully chosen pieces for every occasion.')

  usePageTitle(title)

  const showProductGrid =
    !showApparelLanding && !showGenderLanding && !showJeansLanding

  if (redirectSareeFabric) {
    return <Navigate to={`/category/${active}/sarees`} replace />
  }

  return (
    <main className="bg-[#f8f6ee]">
      <div className="bbb-red-band px-3 py-12 text-center sm:px-5 sm:py-14">
        <h1 className="font-display text-5xl tracking-[0.1em] text-[#ffc462] sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">{blurb}</p>
      </div>

      <div className="mx-auto max-w-[1200px] px-3 py-6 sm:px-5 lg:px-4">
        <nav className="mb-5 text-xs font-semibold text-[#6a6667]">
          <Link to="/" className="hover:text-[#cf2028]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${active}`} className="hover:text-[#cf2028]">
            {meta.label}
          </Link>
          {subtypeMeta && (
            <>
              <span className="mx-2">/</span>
              <span className="text-[#070001]">{subtypeMeta.label}</span>
            </>
          )}
        </nav>

        {(isApparel || isGenderShop) && (
          <div className="mb-7 flex flex-wrap gap-2">
            <Link
              to={`/category/${active}?all=1`}
              className="chip"
              data-active={!subtype && showAll}
            >
              All
            </Link>
            {genderSubtypes
              .filter((s) => {
                if (!shopGender) return true
                return products.some(
                  (p) => p.subtype === s.id && matchesGender(p, shopGender),
                )
              })
              .map((s) => (
                <Link
                  key={s.id}
                  to={`/category/${active}/${s.id}`}
                  className="chip"
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
              const matching = products.filter((p) => {
                if (p.subtype !== s.id) return false
                if (shopGender) return matchesGender(p, shopGender)
                return p.tab === 'apparel-accessories'
              })
              const count = matching.length
              // On Men/Women pages, never show an empty or wrong-gender tile
              if (shopGender && count === 0) return null
              return (
                <Link
                  key={s.id}
                  to={`/category/${active}/${s.id}`}
                  className="group relative aspect-[3/4] overflow-hidden"
                >
                  <SafeImage
                    src={matching[0]?.image || s.image}
                    alt={s.label}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070001]/75 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h2 className="font-heading text-xl tracking-wide">
                      {s.label}
                    </h2>
                    <p className="mt-1 text-[0.65rem] font-bold tracking-wide uppercase opacity-85">
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
              const matching = products.filter(
                (p) =>
                  p.subtype === 'jeans' &&
                  p.collection === c.id &&
                  (!shopGender || matchesGender(p, shopGender)),
              )
              const count = matching.length
              if (shopGender && count === 0) return null
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
                    src={matching[0]?.image || c.image}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070001]/75 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h2 className="font-heading text-2xl tracking-wide">
                      {c.label}
                    </h2>
                    <p className="mt-1 text-sm text-white/85">{c.blurb}</p>
                    <p className="mt-2 text-[0.65rem] font-bold tracking-wide uppercase">
                      {count} styles
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {(showProductGrid || denimCollection) && (
          <>
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#e9e1db] pb-4">
              <p className="text-sm font-semibold text-[#6a6667]">
                {list.length} items
              </p>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#6a6667]">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-[#d9d9d9] bg-white px-3 py-1.5 text-sm font-semibold text-[#070001] outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                </select>
              </label>
            </div>

            {list.length === 0 ? (
              <div className="border border-dashed border-[#d9d9d9] bg-white px-6 py-20 text-center">
                <p className="font-display text-4xl tracking-wide text-[#070001]">
                  Coming soon
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm text-[#6a6667]">
                  We&apos;re stocking this collection. Browse other categories
                  meanwhile.
                </p>
                <Link
                  to="/category/women"
                  className="btn-primary-solid mt-8 inline-flex"
                >
                  Shop women
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {list.slice(0, visibleCount).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {list.length > visibleCount && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((c) => c + 48)
                      }
                      className="btn-primary-solid inline-flex"
                    >
                      Load more products ({list.length - visibleCount} more)
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
