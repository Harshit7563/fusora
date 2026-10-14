import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apparelSubtypes } from '../../data/apparel'
import { useCatalog } from '../../hooks/useCatalog'
import {
  defaultSizesForSubtype,
  getAdminProduct,
  upsertAdminProduct,
  type AdminProductInput,
} from '../../lib/adminCatalog'
import { filesToDataUrls } from '../../lib/imageUpload'
import { usePageTitle } from '../../hooks/usePageTitle'

const field =
  'mt-1.5 w-full border border-[#ececec] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#323232]'

const MAX_IMAGES = 5
const MIN_IMAGES = 3

export function AdminProductFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const existing = !isNew ? getAdminProduct(id) : undefined
  usePageTitle(isNew ? 'Add product' : 'Edit product')
  const navigate = useNavigate()
  const { refresh } = useCatalog()
  const fileRef = useRef<HTMLInputElement>(null)

  const initialGallery = (() => {
    if (!existing?.image) return [] as string[]
    const rest = (existing.images || []).filter((u) => u && u !== existing.image)
    return [existing.image, ...rest].slice(0, MAX_IMAGES)
  })()

  const [form, setForm] = useState<AdminProductInput>(() => ({
    name: existing?.name || '',
    price: existing?.price || 0,
    was: existing?.was || 0,
    tab: existing?.tab || existing?.gender || 'men',
    gender: existing?.gender === 'women' ? 'women' : 'men',
    subtype: existing?.subtype || '',
    collection: existing?.collection || '',
    categoryName: existing?.categoryName || '',
    brand: existing?.brand || 'Fusora',
    image: existing?.image || '',
    images: existing?.images || [],
    description: existing?.description || '',
    sizes: defaultSizesForSubtype(existing?.subtype),
    fabric: existing?.fabric || '',
    sku: existing?.sku || '',
    topDeal: existing?.topDeal || false,
  }))
  const [gallery, setGallery] = useState<string[]>(initialGallery)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isNew && !existing) {
    return (
      <div className="border border-[#ececec] bg-white p-8 text-center">
        <p>Product not found.</p>
        <Link to="/admin/products" className="mt-4 inline-block underline">
          Back to products
        </Link>
      </div>
    )
  }

  const onPickFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const room = MAX_IMAGES - gallery.length
    if (room <= 0) {
      setError(`Maximum ${MAX_IMAGES} images.`)
      return
    }
    setUploading(true)
    try {
      const added = await filesToDataUrls(files, room)
      setGallery((g) => [...g, ...added].slice(0, MAX_IMAGES))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeAt = (index: number) => {
    setGallery((g) => g.filter((_, i) => i !== index))
  }

  const makeMain = (index: number) => {
    setGallery((g) => {
      if (index <= 0 || index >= g.length) return g
      const next = [...g]
      const [picked] = next.splice(index, 1)
      next.unshift(picked)
      return next
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) {
      setError('Product name is required.')
      return
    }
    if (gallery.length < MIN_IMAGES) {
      setError(`Upload at least ${MIN_IMAGES} images (max ${MAX_IMAGES}).`)
      return
    }
    if (gallery.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }
    if (!form.price || form.price <= 0) {
      setError('Enter a valid price.')
      return
    }
    if (form.gender !== 'men' && form.gender !== 'women') {
      setError('Choose Men or Women category.')
      return
    }
    if (form.gender === 'men' && form.subtype === 'sarees') {
      setError('Sarees belong in Women — change gender or subtype.')
      return
    }

    const [main, ...rest] = gallery
    const product = upsertAdminProduct(
      {
        ...form,
        tab: form.gender,
        gender: form.gender,
        image: main,
        images: rest,
        was: form.was > 0 ? form.was : form.price,
        collection:
          form.collection ||
          (form.subtype === 'jeans'
            ? form.gender === 'men'
              ? 'mens-jeans'
              : 'womens-jeans'
            : form.collection),
        sizes: defaultSizesForSubtype(form.subtype),
        categoryName:
          form.categoryName || (form.gender === 'men' ? 'Men' : 'Women'),
      },
      existing?.id,
    )
    refresh()
    navigate(`/admin/products/${product.id}`)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-wide">
            {isNew ? 'Add product' : 'Edit product'}
          </h1>
          <p className="mt-1 text-sm text-[#787878]">
            Upload {MIN_IMAGES}–{MAX_IMAGES} photos from your device (no URL).
          </p>
        </div>
        <Link
          to="/admin/products"
          className="text-xs tracking-wide text-[#787878] uppercase hover:text-[#272727]"
        >
          ← All products
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-6 border border-[#ececec] bg-white p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-4">
          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Product name *
            <input
              required
              className={field}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Price (₹) *
              <input
                required
                type="number"
                min={1}
                className={field}
                value={form.price || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
              />
            </label>
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Compare at (₹)
              <input
                type="number"
                min={0}
                className={field}
                value={form.was || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, was: Number(e.target.value) }))
                }
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Gender category *
              <select
                className={field}
                value={form.gender}
                onChange={(e) => {
                  const gender = e.target.value as 'men' | 'women'
                  setForm((f) => ({
                    ...f,
                    gender,
                    tab: gender,
                    subtype:
                      gender === 'men' && f.subtype === 'sarees'
                        ? ''
                        : f.subtype,
                    collection:
                      f.subtype === 'jeans'
                        ? gender === 'men'
                          ? 'mens-jeans'
                          : 'womens-jeans'
                        : f.collection,
                  }))
                }}
              >
                <option value="men">Men — men products only</option>
                <option value="women">Women — women products only</option>
              </select>
            </label>
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Product type
              <select
                className={field}
                value={form.subtype || ''}
                onChange={(e) => {
                  const subtype = e.target.value as AdminProductInput['subtype']
                  setForm((f) => ({
                    ...f,
                    subtype,
                    sizes: defaultSizesForSubtype(subtype),
                    collection:
                      subtype === 'jeans'
                        ? f.gender === 'men'
                          ? 'mens-jeans'
                          : 'womens-jeans'
                        : f.collection,
                  }))
                }}
              >
                <option value="">— Select —</option>
                {apparelSubtypes
                  .filter((s) => form.gender !== 'men' || s.id !== 'sarees')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Brand
              <input
                className={field}
                value={form.brand}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand: e.target.value }))
                }
              />
            </label>
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              SKU
              <input
                className={field}
                value={form.sku || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sku: e.target.value }))
                }
              />
            </label>
          </div>

          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Sizes (auto — always in stock)
            </p>
            <p className="mt-1 text-xs text-[#787878]">
              Product type ke hisaab se saari sizes automatically add hoti hain.
              Koi size out of stock nahi hota.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {defaultSizesForSubtype(form.subtype).map((size) => (
                <span
                  key={size}
                  className="border border-[#323232] bg-[#fafafa] px-2.5 py-1.5 text-xs font-medium tracking-wide text-[#272727]"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Fabric
            <input
              className={field}
              value={form.fabric || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, fabric: e.target.value }))
              }
            />
          </label>

          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Description
            <textarea
              rows={4}
              className={field}
              value={form.description || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-[#272727]">
            <input
              type="checkbox"
              checked={Boolean(form.topDeal)}
              onChange={(e) =>
                setForm((f) => ({ ...f, topDeal: e.target.checked }))
              }
              className="size-4 accent-[#323232]"
            />
            Mark as top deal / new in
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Product photos * ({gallery.length}/{MAX_IMAGES})
            </p>
            <p className="mt-1 text-xs text-[#787878]">
              Minimum {MIN_IMAGES} images, maximum {MAX_IMAGES}. First photo is
              the main image.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => void onPickFiles(e.target.files)}
            />

            <button
              type="button"
              disabled={uploading || gallery.length >= MAX_IMAGES}
              onClick={() => fileRef.current?.click()}
              className="mt-3 w-full border border-dashed border-[#323232] bg-[#fafafa] px-4 py-8 text-center text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition hover:bg-[#f5f5f5] disabled:opacity-50"
            >
              {uploading
                ? 'Uploading…'
                : gallery.length >= MAX_IMAGES
                  ? 'Limit reached'
                  : 'Upload from device'}
            </button>
          </div>

          {gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {gallery.map((src, i) => (
                <div
                  key={`${i}-${src.slice(0, 24)}`}
                  className="relative aspect-[3/4] overflow-hidden border border-[#ececec] bg-[#f5f5f5]"
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[#323232] px-1.5 py-0.5 text-[0.55rem] font-semibold tracking-wide text-white uppercase">
                      Main
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/55 p-1">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => makeMain(i)}
                        className="flex-1 bg-white/90 py-1 text-[0.55rem] font-semibold tracking-wide uppercase"
                      >
                        Main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      className="flex-1 bg-white/90 py-1 text-[0.55rem] font-semibold tracking-wide text-[#b4232f] uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#b4232f]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#323232] py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-white uppercase disabled:opacity-60"
          >
            {isNew ? 'Create product' : 'Save changes'}
          </button>
          {!isNew && (
            <Link
              to={`/product/${existing?.id}`}
              className="block w-full border border-[#ececec] py-3 text-center text-[0.7rem] font-semibold tracking-[0.14em] uppercase"
            >
              View on store
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}
