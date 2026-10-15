import {
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Ruler,
  Share2,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCategory } from '../categories'
import { formatMoney } from '../data'
import { useStore } from '../context/StoreContext'
import { getProductDetails } from '../productDetails'
import { usePageTitle } from '../hooks/usePageTitle'
import { useCatalog } from '../hooks/useCatalog'
import { SafeImage } from '../components/SafeImage'
import { ProductCard } from '../components/ProductCard'

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, wishlist, toggleWish, openCart } = useStore()

  const { products } = useCatalog()
  const product = products.find((p) => p.id === id)
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeHint, setSizeHint] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(
    () => new Set(['description']),
  )
  const sizeSectionRef = useRef<HTMLDivElement>(null)

  const details = useMemo(
    () => (product ? getProductDetails(product) : null),
    [product],
  )

  usePageTitle(product?.name)

  useEffect(() => {
    setQty(1)
    setSizeHint(false)
    setOpenAccordions(new Set(['description']))
    if (!product) {
      setSelectedSize(null)
      return
    }
    const sizes = getProductDetails(product).sizes
    setSelectedSize(sizes.length === 1 ? sizes[0] : null)
  }, [product?.id])

  if (!product || !details) {
    return (
      <main className="mx-auto max-w-[900px] px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-[#8b1538]">Product not found</h1>
        <Link
          to="/deals"
          className="mt-4 inline-block text-sm tracking-wide text-[#8b1538] uppercase hover:underline"
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
  const saved = wishlist.has(product.id)
  const needsSize = details.sizes.length > 0
  const gallery =
    details.gallery.length > 0 ? details.gallery : [product.image]

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

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <main className="bg-white pb-28 lg:pb-0">
      <div className="mx-auto max-w-[1280px] px-3 py-5 sm:px-6 lg:px-10 lg:py-10">
        <nav className="mb-6 text-xs text-[#6e6a65]">
          <Link to="/" className="hover:text-[#8b1538]">
            Home
          </Link>
          <span className="mx-2">|</span>
          <Link
            to={`/category/${product.tab}`}
            className="hover:text-[#8b1538]"
          >
            {category.label}
          </Link>
          {product.subtype && (
            <>
              <span className="mx-2">|</span>
              <Link
                to={`/category/${product.tab}/${product.subtype}`}
                className="hover:text-[#8b1538] capitalize"
              >
                {product.subtype}
              </Link>
            </>
          )}
          <span className="mx-2">|</span>
          <span className="text-[#1a1a1a]">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Multi-image gallery */}
          <section
            className={
              gallery.length === 1
                ? 'overflow-hidden bg-[#f7f5f2]'
                : 'grid grid-cols-2 gap-2 sm:gap-3'
            }
          >
            {gallery.slice(0, 4).map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="overflow-hidden bg-[#f7f5f2]"
              >
                <SafeImage
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  className="aspect-[3/4] w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </section>

          {/* Buy box */}
          <section className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-serif text-2xl leading-snug tracking-wide text-[#8b1538] uppercase sm:text-3xl lg:text-[2rem]">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <p className="text-xl font-medium text-[#1a1a1a] sm:text-2xl">
                {formatMoney(product.price)}
              </p>
              {saveAmt > 0 && (
                <>
                  <p className="text-sm text-[#6e6a65] line-through">
                    {formatMoney(product.was)}
                  </p>
                  <p className="text-sm text-[#8b1538]">
                    Save {formatMoney(saveAmt)}
                  </p>
                </>
              )}
            </div>

            <p className="mt-3 text-xs tracking-[0.08em] text-[#6e6a65]">
              SKU: {details.sku}
            </p>

            {needsSize && (
              <div
                ref={sizeSectionRef}
                id="product-size"
                className={`mt-7 scroll-mt-28 ${
                  sizeHint && !selectedSize
                    ? 'rounded ring-2 ring-[#8b1538]/30 ring-offset-2'
                    : ''
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    Size
                    {selectedSize ? (
                      <span className="ml-2 font-normal text-[#6e6a65]">
                        · {selectedSize}
                      </span>
                    ) : null}
                  </p>
                  {details.sizeChart && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenAccordions((prev) => new Set(prev).add('sizechart'))
                        document
                          .getElementById('pdp-accordions')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="inline-flex items-center gap-1.5 text-xs tracking-[0.12em] text-[#8b1538] uppercase hover:underline"
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
                        className={`min-h-11 min-w-12 touch-manipulation border px-3.5 py-2.5 text-sm transition ${
                          active
                            ? 'border-[#8b1538] bg-[#8b1538] text-white'
                            : 'border-[#ebe6df] bg-white text-[#1a1a1a] hover:border-[#8b1538]'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                {sizeHint && !selectedSize && (
                  <p className="mt-2 text-xs font-medium text-[#8b1538]">
                    Please select a size to continue.
                  </p>
                )}
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              <span className="text-sm text-[#6e6a65]">Quantity</span>
              <div className="inline-flex items-center border border-[#ebe6df]">
                <button
                  type="button"
                  className="grid size-10 place-items-center text-[#1a1a1a]"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-9 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  className="grid size-10 place-items-center text-[#1a1a1a]"
                  onClick={() => setQty((q) => Math.min(8, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  if (addQty()) openCart()
                }}
                className="hidden flex-1 touch-manipulation border border-[#8b1538] bg-white py-3.5 text-xs font-medium tracking-[0.16em] text-[#8b1538] uppercase transition hover:bg-[#8b1538] hover:text-white sm:block"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => toggleWish(product.id)}
                className="hidden flex-1 touch-manipulation border border-[#ebe6df] bg-white py-3.5 text-xs font-medium tracking-[0.16em] text-[#1a1a1a] uppercase transition hover:border-[#8b1538] sm:inline-flex sm:items-center sm:justify-center sm:gap-2"
              >
                <Heart
                  className={`size-4 ${saved ? 'fill-[#8b1538] text-[#8b1538]' : ''}`}
                  strokeWidth={1.4}
                />
                {saved ? 'Wishlisted' : 'Add to wishlist'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (addQty()) navigate('/cart')
              }}
              className="mt-3 hidden w-full touch-manipulation bg-[#8b1538] py-3.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition hover:bg-[#6f102c] sm:block"
            >
              Buy it now
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
              className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.12em] text-[#6e6a65] uppercase hover:text-[#8b1538]"
            >
              <Share2 className="size-3.5" />
              Share
            </button>

            {/* Accordion */}
            <div id="pdp-accordions" className="mt-10 scroll-mt-24 border-t border-[#ebe6df]">
              <Accordion
                title="Description"
                open={openAccordions.has('description')}
                onToggle={() => toggleAccordion('description')}
              >
                <p className="text-sm leading-relaxed text-[#6e6a65]">
                  {details.overview}
                </p>
                {details.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {details.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2 text-sm text-[#6e6a65]"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[#8b1538]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </Accordion>

              <Accordion
                title="Product details"
                open={openAccordions.has('details')}
                onToggle={() => toggleAccordion('details')}
              >
                <dl className="space-y-2 text-sm">
                  {details.specs.map((row) => (
                    <div key={row.label} className="flex gap-3">
                      <dt className="w-28 shrink-0 font-medium text-[#1a1a1a]">
                        {row.label}
                      </dt>
                      <dd className="text-[#6e6a65]">{row.value}</dd>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 font-medium text-[#1a1a1a]">
                      Brand
                    </dt>
                    <dd className="text-[#6e6a65]">{product.brand}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 font-medium text-[#1a1a1a]">
                      Color
                    </dt>
                    <dd className="text-[#6e6a65]">{details.color}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 font-medium text-[#1a1a1a]">
                      Material
                    </dt>
                    <dd className="text-[#6e6a65]">{details.material}</dd>
                  </div>
                </dl>
              </Accordion>

              {details.sizeChart && (
                <Accordion
                  title="Size chart"
                  open={openAccordions.has('sizechart')}
                  onToggle={() => toggleAccordion('sizechart')}
                >
                  <p className="mb-3 text-xs text-[#6e6a65]">
                    Measurements in {details.sizeChart.unit}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#ebe6df]">
                          {details.sizeChart.headers.map((h) => (
                            <th
                              key={h}
                              className="px-2 py-2 text-xs font-medium tracking-wide text-[#1a1a1a] uppercase"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {details.sizeChart.rows.map((row) => (
                          <tr
                            key={row.join('-')}
                            className="border-b border-[#f0ebe6]"
                          >
                            {row.map((cell, idx) => (
                              <td
                                key={`${row[0]}-${idx}`}
                                className={`px-2 py-2.5 ${
                                  idx === 0
                                    ? 'font-medium text-[#1a1a1a]'
                                    : 'text-[#6e6a65]'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#6e6a65]">
                    {details.sizeChart.note}
                  </p>
                </Accordion>
              )}

              <Accordion
                title="Care instructions"
                open={openAccordions.has('care')}
                onToggle={() => toggleAccordion('care')}
              >
                <ul className="space-y-2">
                  {details.care.map((c) => (
                    <li
                      key={c}
                      className="flex gap-2 text-sm text-[#6e6a65]"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#8b1538]" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Accordion>

              <Accordion
                title="Shipping & returns"
                open={openAccordions.has('shipping')}
                onToggle={() => toggleAccordion('shipping')}
              >
                <ul className="space-y-2 text-sm text-[#6e6a65]">
                  {details.protection.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#8b1538]" />
                      {p}
                    </li>
                  ))}
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-[#8b1538]" />
                    Delivery in 2–5 business days
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-[#8b1538]" />
                    Easy returns within 15 days with receipt
                  </li>
                </ul>
              </Accordion>
            </div>
          </section>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-[#ebe6df] pt-12 sm:mt-20">
            <h2 className="mb-8 text-center font-serif text-3xl tracking-wide text-[#8b1538] sm:text-4xl">
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ebe6df] bg-white/98 px-3 pt-2.5 shadow-[0_-8px_24px_rgba(42,28,26,0.08)] backdrop-blur safe-pb lg:hidden">
        <div className="mx-auto max-w-[1280px]">
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
                    className={`min-h-9 shrink-0 touch-manipulation border px-3 text-xs font-medium ${
                      active
                        ? 'border-[#8b1538] bg-[#8b1538] text-white'
                        : 'border-[#ebe6df] bg-white text-[#1a1a1a]'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          )}
          {sizeHint && needsSize && !selectedSize && (
            <p className="mb-2 text-center text-[0.7rem] font-medium text-[#8b1538]">
              Select a size above, then tap Buy
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWish(product.id)}
              className="grid size-11 shrink-0 place-items-center border border-[#ebe6df]"
              aria-label="Wishlist"
            >
              <Heart
                className={`size-4 ${saved ? 'fill-[#8b1538] text-[#8b1538]' : ''}`}
                strokeWidth={1.4}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                if (addQty()) openCart()
              }}
              className="min-h-11 flex-1 touch-manipulation border border-[#8b1538] bg-white px-3 py-3 text-[0.65rem] font-medium tracking-[0.12em] text-[#8b1538] uppercase"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                if (addQty()) navigate('/cart')
              }}
              className="min-h-11 flex-1 touch-manipulation bg-[#8b1538] px-3 py-3 text-[0.65rem] font-medium tracking-[0.12em] text-white uppercase"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border-b border-[#ebe6df]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium tracking-wide text-[#1a1a1a]">
          {title}
        </span>
        <ChevronDown
          className={`size-4 text-[#6e6a65] transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}
