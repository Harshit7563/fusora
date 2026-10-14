import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  Share2,
  ShieldCheck,
  Star,
  ThumbsUp,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCategory } from '../categories'
import { formatMoney, products } from '../data'
import { useStore } from '../context/StoreContext'
import { getProductDetails } from '../productDetails'
import { usePageTitle } from '../hooks/usePageTitle'
import { SafeImage } from '../components/SafeImage'

type TabId = 'overview' | 'specs' | 'sizechart' | 'reviews'

function Stars({
  value,
  size = 'size-4',
}: {
  value: number
  size?: string
}) {
  return (
    <div className="flex items-center gap-0.5 text-[#c4a35a]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(value) ? 'fill-current' : 'opacity-25'}`}
        />
      ))}
    </div>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    addToCart,
    wishlist,
    toggleWish,
    openCart,
  } = useStore()

  const product = products.find((p) => p.id === id)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<TabId>('overview')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeHint, setSizeHint] = useState(false)
  const sizeSectionRef = useRef<HTMLDivElement>(null)

  const details = useMemo(
    () => (product ? getProductDetails(product) : null),
    [product],
  )

  usePageTitle(product?.name)

  useEffect(() => {
    setActiveImage(0)
    setQty(1)
    setTab('overview')
    setSizeHint(false)
    if (!product) {
      setSelectedSize(null)
      return
    }
    const sizes = getProductDetails(product).sizes
    // One size (e.g. Free Size) — preselect so Buy works on mobile
    setSelectedSize(sizes.length === 1 ? sizes[0] : null)
  }, [product?.id])

  const safeImageIndex = Math.min(
    activeImage,
    Math.max(0, (details?.gallery.length ?? 1) - 1),
  )

  if (!product || !details) {
    return (
      <main className="mx-auto max-w-[900px] px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-bb-text">Product not found</h1>
        <Link
          to="/deals"
          className="mt-4 inline-block text-sm tracking-wide text-bb-link uppercase hover:underline"
        >
          Back to shop
        </Link>
      </main>
    )
  }

  const category = getCategory(product.tab)
  const related = products
    .filter((p) => p.tab === product.tab && p.id !== product.id)
    .slice(0, 4)
  const saveAmt = product.was > product.price ? product.was - product.price : 0
  const savePct =
    product.was > product.price
      ? Math.round((saveAmt / product.was) * 100)
      : 0
  const saved = wishlist.has(product.id)
  const needsSize = details.sizes.length > 0
  const maxBreakdown = Math.max(...details.ratingBreakdown, 1)

  const requireSizeOrScroll = () => {
    if (!needsSize || selectedSize) return true
    setSizeHint(true)
    sizeSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    return false
  }

  const addQty = () => {
    if (!requireSizeOrScroll()) return false
    for (let i = 0; i < qty; i++) {
      addToCart(product, selectedSize ?? undefined)
    }
    return true
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Details' },
    ...(details.sizeChart
      ? [{ id: 'sizechart' as const, label: 'Size chart' }]
      : []),
    { id: 'reviews', label: `Reviews (${details.reviewCount})` },
  ]

  return (
    <main className="bg-fusora-ivory pb-36 lg:pb-0">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-[0.65rem] tracking-[0.12em] text-bb-muted uppercase sm:mb-6 sm:text-xs sm:tracking-[0.14em]">
          <Link to="/" className="hover:text-bb-text">
            Home
          </Link>
          <ChevronRight className="size-3.5 opacity-50" />
          <Link to={`/category/${product.tab}`} className="hover:text-bb-text">
            {category.label}
          </Link>
          {product.subtype && (
            <>
              <ChevronRight className="size-3.5 opacity-50" />
              <Link
                to={`/category/${product.tab}/${product.subtype}`}
                className="hover:text-bb-text"
              >
                {product.subtype}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 opacity-50" />
          <span className="line-clamp-1 text-bb-text">{product.brand}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:gap-12">
          {/* Gallery */}
          <section>
            <div className="relative overflow-hidden bg-bb-gray">
              <SafeImage
                key={details.gallery[safeImageIndex]}
                src={details.gallery[safeImageIndex]}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover sm:aspect-square"
                loading="eager"
              />
              {product.topDeal && (
                <span className="absolute top-4 left-4 bg-bb-blue px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-white uppercase">
                  New
                </span>
              )}
              {savePct > 0 && (
                <span className="absolute top-4 right-4 bg-[#8b2e2e] px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-white uppercase">
                  Save {savePct}%
                </span>
              )}
            </div>
            {details.gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {details.gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`size-16 shrink-0 overflow-hidden border sm:size-[4.5rem] ${
                      safeImageIndex === i
                        ? 'border-bb-blue'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Buy box */}
          <section className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.7rem] font-medium tracking-[0.28em] text-bb-muted uppercase">
              {product.brand}
            </p>
            <h1 className="font-serif mt-2 text-[1.65rem] leading-tight text-bb-text sm:text-4xl">
              {product.name}
            </h1>

            <button
              type="button"
              onClick={() => setTab('reviews')}
              className="mt-4 flex flex-wrap items-center gap-2 text-sm"
            >
              <Stars value={details.rating} />
              <span className="font-semibold text-bb-text">{details.rating}</span>
              <span className="text-bb-muted underline-offset-2 hover:underline">
                {details.reviewCount} reviews
              </span>
            </button>

            <div className="mt-6 border-y border-bb-border py-5">
              <div className="flex flex-wrap items-end gap-3">
                <p className="font-serif text-3xl text-bb-text sm:text-4xl">
                  {formatMoney(product.price)}
                </p>
                {saveAmt > 0 && (
                  <>
                    <p className="pb-1 text-sm text-bb-muted line-through">
                      {formatMoney(product.was)}
                    </p>
                    <p className="pb-1 text-sm font-semibold text-[#8b2e2e]">
                      You save {formatMoney(saveAmt)}
                    </p>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs tracking-wide text-bb-muted">
                SKU {details.sku} · {details.color} · {details.material}
              </p>
            </div>

            {needsSize && (
              <div
                ref={sizeSectionRef}
                id="product-size"
                className={`mt-6 scroll-mt-28 ${
                  sizeHint && !selectedSize
                    ? 'rounded-2xl ring-2 ring-[#8b2e2e]/35 ring-offset-2 ring-offset-fusora-ivory'
                    : ''
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold tracking-wide text-bb-text">
                    Select size
                    {selectedSize ? (
                      <span className="ml-2 font-normal text-bb-muted">
                        · {selectedSize}
                      </span>
                    ) : null}
                  </p>
                  {details.sizeChart && (
                    <button
                      type="button"
                      onClick={() => {
                        setTab('sizechart')
                        document
                          .getElementById('product-tabs')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-bb-link uppercase hover:underline"
                    >
                      <Ruler className="size-3.5" />
                      Size chart
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.sizes.map((size) => {
                    const active = selectedSize === size
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size)
                          setSizeHint(false)
                        }}
                        className={`min-h-11 min-w-12 touch-manipulation border px-3.5 py-2.5 text-sm font-medium transition ${
                          active
                            ? 'border-bb-blue bg-bb-blue text-white'
                            : 'border-bb-border bg-white text-bb-text hover:border-bb-blue'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                {sizeHint && !selectedSize && (
                  <p className="mt-2 text-xs font-medium text-[#8b2e2e]">
                    Please select a size to continue.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Delivery</p>
              <div className="rounded-2xl border border-bb-border bg-white px-3.5 py-3.5 text-left text-sm">
                <div className="flex items-start gap-2.5">
                  <Truck className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                  <div>
                    <span className="block font-semibold text-bb-text">
                      Normal delivery
                    </span>
                    <span className="mt-0.5 block text-xs text-bb-muted">
                      2–5 business days · Standard shipping only
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold">Qty</span>
              <div className="inline-flex items-center border border-bb-border bg-white">
                <button
                  type="button"
                  className="grid size-10 place-items-center"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button
                  type="button"
                  className="grid size-10 place-items-center"
                  onClick={() => setQty((q) => Math.min(8, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex">
              <button
                type="button"
                onClick={() => {
                  if (addQty()) openCart()
                }}
                className="hidden flex-1 touch-manipulation border border-bb-border bg-white py-3.5 text-xs font-semibold tracking-[0.16em] text-bb-text uppercase transition hover:bg-bb-gray sm:block"
              >
                Add to bag
              </button>
              <button
                type="button"
                onClick={() => {
                  if (addQty()) navigate('/cart')
                }}
                className="hidden flex-1 touch-manipulation bg-bb-blue py-3.5 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-bb-blue-dark sm:block"
              >
                Buy now
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => toggleWish(product.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-bb-border bg-white py-2.5 text-sm font-semibold hover:bg-bb-gray"
              >
                <Heart
                  className={`size-4 ${saved ? 'fill-bb-save text-bb-save' : ''}`}
                />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.location.href
                  if (navigator.share) {
                    void navigator.share({ title: product.name, url }).catch(() => {})
                  } else {
                    void navigator.clipboard?.writeText(url)
                  }
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-bb-border bg-white py-2.5 text-sm font-semibold hover:bg-bb-gray"
              >
                <Share2 className="size-4" />
                Share
              </button>
            </div>

            <ul className="mt-6 space-y-3 border-t border-bb-border pt-5 text-sm">
              <li className="flex gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                <span>
                  <strong>Purchase protection</strong> on eligible orders
                </span>
              </li>
              <li className="flex gap-2.5">
                <Truck className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                <span>
                  <strong>Delivery</strong> in 2–5 days
                </span>
              </li>
              <li className="flex gap-2.5">
                <RotateCcw className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                <span>
                  <strong>Easy returns</strong> within 15 days with receipt
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Highlights */}
        <section className="mt-10 border-t border-bb-border pt-10">
          <p className="text-[0.7rem] font-medium tracking-[0.28em] text-bb-muted uppercase">
            Why you’ll love it
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {details.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm leading-relaxed">
                <Check className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Tabs */}
        <section id="product-tabs" className="mt-10 scroll-mt-24 border-t border-bb-border pt-2">
          <div className="flex gap-1 overflow-x-auto border-b border-bb-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 px-4 py-4 text-xs font-semibold tracking-[0.14em] uppercase sm:px-5 ${
                  tab === t.id
                    ? 'border-b-2 border-bb-blue text-bb-blue'
                    : 'text-bb-muted hover:text-bb-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === 'overview' && (
              <div className="grid max-w-4xl gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h2 className="font-serif text-2xl text-bb-text">About this piece</h2>
                  <p className="mt-4 text-sm leading-relaxed text-bb-muted sm:text-base">
                    {details.overview}
                  </p>
                  <h3 className="mt-8 text-xs font-semibold tracking-[0.18em] text-bb-text uppercase">
                    Care
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {details.care.map((c) => (
                      <li
                        key={c}
                        className="flex gap-2 text-sm text-bb-muted"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-bb-blue" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-bb-gray/60 p-5 sm:p-6">
                  <h3 className="text-xs font-semibold tracking-[0.18em] text-bb-text uppercase">
                    Protection
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {details.protection.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-bb-muted"
                      >
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === 'specs' && (
              <div className="max-w-3xl">
                <h2 className="font-serif text-2xl text-bb-text">Product details</h2>
                <table className="mt-6 w-full text-left text-sm">
                  <tbody>
                    {details.specs.map((row, i) => (
                      <tr
                        key={row.label}
                        className={i % 2 === 0 ? 'bg-bb-gray/45' : ''}
                      >
                        <th className="w-[40%] px-4 py-3.5 font-semibold text-bb-text">
                          {row.label}
                        </th>
                        <td className="px-4 py-3.5 text-bb-muted">{row.value}</td>
                      </tr>
                    ))}
                    <tr>
                      <th className="px-4 py-3.5 font-semibold">Brand</th>
                      <td className="px-4 py-3.5 text-bb-muted">{product.brand}</td>
                    </tr>
                    <tr className="bg-bb-gray/45">
                      <th className="px-4 py-3.5 font-semibold">SKU</th>
                      <td className="px-4 py-3.5 text-bb-muted">{details.sku}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'sizechart' && details.sizeChart && (
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl text-bb-text">
                      {details.sizeChart.title}
                    </h2>
                    <p className="mt-1 text-sm text-bb-muted">
                      Measurements in {details.sizeChart.unit}
                    </p>
                  </div>
                  {needsSize && (
                    <p className="text-xs tracking-wide text-bb-muted uppercase">
                      Selected · {selectedSize ?? 'none'}
                    </p>
                  )}
                </div>

                <div className="mt-6 overflow-x-auto border border-bb-border">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="bg-bb-blue text-white">
                        {details.sizeChart.headers.map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-xs font-semibold tracking-[0.12em] uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {details.sizeChart.rows.map((row) => {
                        const isActive =
                          selectedSize != null && row[0] === selectedSize
                        return (
                          <tr
                            key={row.join('-')}
                            className={`border-t border-bb-border ${
                              isActive ? 'bg-bb-blue/8' : 'odd:bg-white even:bg-bb-gray'
                            }`}
                          >
                            {row.map((cell, idx) => (
                              <td
                                key={`${row[0]}-${idx}`}
                                className={`px-4 py-3 ${
                                  idx === 0
                                    ? 'font-semibold text-bb-text'
                                    : 'text-bb-muted'
                                }`}
                              >
                                {idx === 0 && needsSize ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedSize(cell)
                                      setSizeHint(false)
                                    }}
                                    className="hover:underline"
                                  >
                                    {cell}
                                  </button>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bb-muted">
                  {details.sizeChart.note}
                </p>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
                <div>
                  <h2 className="font-serif text-2xl text-bb-text">Customer reviews</h2>
                  <div className="mt-5 flex items-end gap-3">
                    <p className="font-serif text-5xl text-bb-text">
                      {details.rating}
                    </p>
                    <div className="pb-1">
                      <Stars value={details.rating} />
                      <p className="mt-1 text-sm text-bb-muted">
                        {details.reviewCount} ratings
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = details.ratingBreakdown[star - 1] ?? 0
                      const pct = Math.round((count / maxBreakdown) * 100)
                      return (
                        <li key={star} className="flex items-center gap-3 text-sm">
                          <span className="w-8 text-bb-muted">{star}★</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bb-gray">
                            <div
                              className="h-full rounded-full bg-[#c4a35a]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs text-bb-muted">
                            {count}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="space-y-4">
                  {details.reviews.map((r) => (
                    <article
                      key={r.id}
                      className="border-b border-bb-border pb-5 last:border-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-bb-text">
                            {r.name}
                          </p>
                          <p className="mt-0.5 text-xs text-bb-muted">
                            {r.date}
                            {r.verified ? ' · Verified purchase' : ''}
                          </p>
                        </div>
                        <Stars value={r.rating} size="size-3.5" />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-bb-text">
                        {r.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-bb-muted">
                        {r.text}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-bb-muted">
                        <ThumbsUp className="size-3.5" />
                        {r.helpful} found this helpful
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-4 mb-6 border-t border-bb-border pt-10">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-medium tracking-[0.28em] text-bb-muted uppercase">
                  You may also like
                </p>
                <h2 className="font-serif mt-2 text-3xl text-bb-text">
                  Similar pieces
                </h2>
              </div>
              <Link
                to={`/category/${product.tab}`}
                className="text-xs font-semibold tracking-[0.16em] text-bb-link uppercase hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="overflow-hidden bg-bb-gray">
                    <img
                      src={p.image}
                      alt=""
                      className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-bb-text">
                    {p.name}
                  </p>
                  <p className="mt-1 font-semibold">{formatMoney(p.price)}</p>
                  {p.was > p.price && (
                    <p className="text-xs text-bb-muted line-through">
                      {formatMoney(p.was)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-bb-border bg-fusora-ivory/98 px-3 pt-2.5 shadow-[0_-8px_24px_rgba(42,28,26,0.08)] backdrop-blur safe-pb lg:hidden">
        <div className="mx-auto max-w-[1400px]">
          {needsSize && (
            <div className="-mx-1 mb-2 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
              {details.sizes.map((size) => {
                const active = selectedSize === size
                return (
                  <button
                    key={`sticky-${size}`}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size)
                      setSizeHint(false)
                    }}
                    className={`min-h-9 shrink-0 touch-manipulation border px-3 text-xs font-semibold ${
                      active
                        ? 'border-bb-blue bg-bb-blue text-white'
                        : 'border-bb-border bg-white text-bb-text'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          )}
          {sizeHint && needsSize && !selectedSize && (
            <p className="mb-2 text-center text-[0.7rem] font-medium text-[#8b2e2e]">
              Select a size above, then tap Buy
            </p>
          )}
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-bb-muted">
                {selectedSize ? `Size ${selectedSize}` : product.brand}
              </p>
              <p className="font-serif text-lg leading-none text-bb-text">
                {formatMoney(product.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (addQty()) openCart()
              }}
              className="min-h-11 shrink-0 touch-manipulation border border-bb-border bg-white px-4 py-3 text-[0.65rem] font-semibold tracking-[0.12em] text-bb-text uppercase"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                if (addQty()) navigate('/cart')
              }}
              className="min-h-11 shrink-0 touch-manipulation bg-bb-blue px-5 py-3 text-[0.65rem] font-semibold tracking-[0.12em] text-white uppercase"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
