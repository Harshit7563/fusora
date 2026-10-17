import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
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
  const { products } = useCatalog()
  const [sort, setSort] = useState('featured')

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
    if (active === 'men') return apparelSubtypes.filter((s) => s.id !== 'sarees')
    return apparelSubtypes
  }, [active])

  const subtypeMeta = apparelSubtypes.find((s) => s.id === subtype)
  const denimMeta = denimCollections.find((c) => c.id === denimCollection)
  const showGenderLanding = isGenderShop && !subtype
  const showApparelLanding = isApparel && !subtype
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
    <main className="bg-white">
      <div className="border-b border-[#eee] bg-[#fafafa] px-3 py-10 text-center sm:px-5 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111] uppercase sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-[#666]">{blurb}</p>
      </div>

      <div className="mx-auto max-w-[1400px] px-3 py-6 sm:px-5 lg:px-8">
        <nav className="mb-5 text-xs font-semibold text-[#666]">
          <Link to="/" className="hover:text-[#e30613]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${active}`} className="hover:text-[#e30613]">
            {meta.label}
          </Link>
          {subtypeMeta && (
            <>
              <span className="mx-2">/</span>
              <span className="text-[#111]">{subtypeMeta.label}</span>
            </>
          )}
        </nav>

        {(isApparel || isGenderShop) && (
          <div className="mb-7 flex flex-wrap gap-2">
            <Link
              to={`/category/${active}`}
              className="chip"
              data-active={!subtype}
            >
              All
            </Link>
            {genderSubtypes.map((s) => (
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
              const count = products.filter((p) => {
                if (p.subtype !== s.id) return false
                if (shopGender) return matchesGender(p, shopGender)
                return p.tab === 'apparel-accessories'
              }).length
              return (
                <Link
                  key={s.id}
                  to={`/category/${active}/${s.id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <SafeImage
                    src={s.image}
                    alt={s.label}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h2 className="text-lg font-extrabold uppercase tracking-wide">
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
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <SafeImage
                    src={c.image}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h2 className="text-xl font-extrabold uppercase">
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
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#eee] pb-4">
              <p className="text-sm font-semibold text-[#666]">
                {list.length} items
              </p>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#666]">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-[#ddd] bg-white px-3 py-1.5 text-sm font-semibold text-[#111] outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                </select>
              </label>
            </div>

            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#ddd] px-6 py-20 text-center">
                <p className="text-2xl font-extrabold uppercase text-[#111]">
                  Coming soon
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm text-[#666]">
                  We&apos;re stocking this collection. Browse other categories
                  meanwhile.
                </p>
                <Link to="/category/women" className="btn-primary mt-8 inline-flex">
                  Shop women
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
