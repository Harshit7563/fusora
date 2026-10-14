import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export function CategoryPage() {
  const { tab, subtype: subtypeParam, collection: collectionParam } =
    useParams()
  const { products } = useCatalog()
  const active = (tab as CategoryId) || 'apparel-accessories'
  const meta = getCategory(active)
  const isApparel = active === 'apparel-accessories'

  const subtype =
    subtypeParam && ALL_APPAREL_SUBTYPES.includes(subtypeParam as ApparelSubtype)
      ? (subtypeParam as ApparelSubtype)
      : null

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

  const list = useMemo(
    () =>
      products.filter((p) => {
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
        }
        return true
      }),
    [active, isApparel, subtype, collection],
  )

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
  }, [])

  const subtypeMeta = apparelSubtypes.find((s) => s.id === subtype)
  const denimMeta = denimCollections.find((c) => c.id === denimCollection)
  const fabricMeta = dyntraFabricCategories.find((c) => c.id === sareeFabric)
  const showApparelLanding = isApparel && !subtype
  const showJeansLanding = subtype === 'jeans' && !denimCollection
  const showSareeLanding = subtype === 'sarees' && !sareeFabric

  const title =
    denimMeta?.label ||
    fabricMeta?.label ||
    subtypeMeta?.label ||
    meta.label

  const blurb =
    denimMeta?.blurb ||
    (fabricMeta
      ? `${fabricMeta.label} from the Fusora edit`
      : subtypeMeta?.blurb) ||
    undefined

  return (
    <main className="mx-auto max-w-[1440px] px-3 py-8 sm:px-4 sm:py-10 lg:px-8">
      <nav className="mb-5 text-[0.65rem] tracking-wide text-bb-muted uppercase sm:text-xs">
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
            <Link
              to={`/category/${active}/${subtype}`}
              className="hover:text-bb-text"
            >
              {subtypeMeta.label}
            </Link>
          </>
        )}
        {(denimMeta || fabricMeta) && (
          <>
            {' / '}
            <span className="text-bb-text">
              {denimMeta?.label || fabricMeta?.label}
            </span>
          </>
        )}
      </nav>

      <div className="max-w-2xl">
        <h1 className="text-display text-[2rem] leading-none text-bb-text sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-bb-muted">
          {blurb ? `${blurb} · ` : ''}
          {list.length} product{list.length === 1 ? '' : 's'}
        </p>
      </div>

      {isApparel && (
        <div className="mt-7 flex gap-5 overflow-x-auto border-b border-bb-border pb-px">
          <Link
            to="/category/apparel-accessories"
            className={`relative shrink-0 pb-3 text-[0.7rem] tracking-[0.14em] uppercase ${
              !subtype
                ? 'font-semibold text-bb-blue'
                : 'text-bb-muted hover:text-bb-text'
            }`}
          >
            All
            {!subtype && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-bb-blue" />
            )}
          </Link>
          {apparelSubtypes.map((s) => (
            <Link
              key={s.id}
              to={`/category/apparel-accessories/${s.id}`}
              className={`relative shrink-0 pb-3 text-[0.7rem] tracking-[0.14em] uppercase ${
                subtype === s.id
                  ? 'font-semibold text-bb-blue'
                  : 'text-bb-muted hover:text-bb-text'
              }`}
            >
              {s.label}
              {subtype === s.id && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-bb-blue" />
              )}
            </Link>
          ))}
        </div>
      )}

      {showApparelLanding && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-4">
          {apparelSubtypes.map((s) => {
            const count = products.filter(
              (p) => p.tab === 'apparel-accessories' && p.subtype === s.id,
            ).length
            return (
              <Link
                key={s.id}
                to={`/category/apparel-accessories/${s.id}`}
                className="group relative aspect-[3/4] overflow-hidden bg-bb-gray"
              >
                <SafeImage
                  src={s.image}
                  alt={s.label}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bb-blue-deep/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-[#fbf7f2] sm:p-5">
                  <h2 className="text-display text-xl sm:text-2xl">{s.label}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-[#f3e8d8]/85 sm:text-sm">
                    {s.blurb}
                  </p>
                  <p className="mt-2 text-[0.6rem] tracking-[0.14em] uppercase sm:mt-3">
                    {count} pieces · Shop now
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {showJeansLanding && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-5">
            {denimCollections.map((c) => {
              const count = products.filter(
                (p) => p.subtype === 'jeans' && p.collection === c.id,
              ).length
              return (
                <Link
                  key={c.id}
                  to={`/category/apparel-accessories/jeans/${c.id}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-bb-gray sm:aspect-[3/4]"
                >
                  <SafeImage
                    src={c.image}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-blue-deep/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-[#fbf7f2] sm:p-6">
                    <h2 className="text-display text-2xl sm:text-3xl">
                      {c.label}
                    </h2>
                    <p className="mt-1 text-sm text-[#f3e8d8]/85">{c.blurb}</p>
                    <p className="mt-3 text-[0.65rem] tracking-[0.16em] uppercase">
                      {count} styles · Shop now
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-12">
            <h2 className="text-display mb-6 text-2xl sm:text-3xl">All jeans</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </>
      )}

      {subtype === 'sarees' && (
        <>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
            <Link
              to="/category/apparel-accessories/sarees"
              className={`shrink-0 border px-4 py-2 text-[0.68rem] tracking-[0.12em] uppercase transition ${
                !sareeFabric
                  ? 'border-bb-blue bg-bb-blue text-white'
                  : 'border-bb-border text-bb-muted hover:border-bb-blue hover:text-bb-text'
              }`}
            >
              All
            </Link>
            {fabricTiles.map((c) => (
              <Link
                key={c.id}
                to={`/category/apparel-accessories/sarees/${c.id}`}
                className={`shrink-0 border px-4 py-2 text-[0.68rem] tracking-[0.12em] uppercase transition ${
                  sareeFabric === c.id
                    ? 'border-bb-blue bg-bb-blue text-white'
                    : 'border-bb-border text-bb-muted hover:border-bb-blue hover:text-bb-text'
                }`}
              >
                {c.label.replace(/ sarees$/i, '')}
              </Link>
            ))}
          </div>

          {showSareeLanding && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {fabricTiles.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/apparel-accessories/sarees/${c.id}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-bb-gray"
                >
                  {c.cover ? (
                    <SafeImage
                      src={c.cover}
                      alt={c.label}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-bb-gray" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bb-blue-deep/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-[#fbf7f2] sm:p-4">
                    <h2 className="text-display text-lg sm:text-xl">{c.label}</h2>
                    <p className="mt-1 text-[0.65rem] tracking-[0.14em] uppercase text-[#f3e8d8]/85">
                      {c.count} pieces · Shop
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className={showSareeLanding ? 'mt-12' : 'mt-8'}>
            {showSareeLanding && (
              <h2 className="text-display mb-6 text-2xl sm:text-3xl">
                All sarees
              </h2>
            )}
            {list.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {subtype === 'jeans' && denimCollection && (
        <>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
            <Link
              to="/category/apparel-accessories/jeans"
              className="shrink-0 border border-bb-border px-4 py-2 text-[0.68rem] tracking-[0.12em] text-bb-muted uppercase hover:border-bb-blue hover:text-bb-text"
            >
              All
            </Link>
            {denimCollections.map((c) => (
              <Link
                key={c.id}
                to={`/category/apparel-accessories/jeans/${c.id}`}
                className={`shrink-0 border px-4 py-2 text-[0.68rem] tracking-[0.12em] uppercase ${
                  c.id === denimCollection
                    ? 'border-bb-blue bg-bb-blue text-white'
                    : 'border-bb-border text-bb-muted hover:border-bb-blue hover:text-bb-text'
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      {(subtype === 'tshirts' || subtype === 'shirts') && (
        <div className="mt-8">
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {!isApparel && (
        <div className="mt-8">
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}

function EmptyState() {
  return (
    <div className="border border-dashed border-bb-border px-6 py-20 text-center">
      <p className="text-display text-3xl text-bb-text">Coming soon</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-bb-muted">
        We&apos;re stocking this collection. Browse other categories meanwhile.
      </p>
      <Link
        to="/category/apparel-accessories"
        className="mt-8 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.18em] text-white uppercase"
      >
        Back to apparel
      </Link>
    </div>
  )
}
