import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { shopCategories } from '../../categories'
import { apparelSubtypes } from '../../data/apparel'
import { useCatalog } from '../../hooks/useCatalog'
import {
  getAdminProduct,
  upsertAdminProduct,
  type AdminProductInput,
} from '../../lib/adminCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'

const field =
  'mt-1.5 w-full border border-[#ececec] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#323232]'

export function AdminProductFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const existing = !isNew ? getAdminProduct(id) : undefined
  usePageTitle(isNew ? 'Add product' : 'Edit product')
  const navigate = useNavigate()
  const { adminCategories, refresh } = useCatalog()

  const categoryOptions = useMemo(() => {
    const custom = adminCategories.map((c) => ({
      id: c.id,
      label: `${c.emoji} ${c.label}`,
    }))
    const builtIn = shopCategories.map((c) => ({
      id: c.id,
      label: `${c.emoji} ${c.label}`,
    }))
    return [...custom, ...builtIn]
  }, [adminCategories])

  const [form, setForm] = useState<AdminProductInput>(() => ({
    name: existing?.name || '',
    price: existing?.price || 0,
    was: existing?.was || 0,
    tab: existing?.tab || 'apparel-accessories',
    subtype: existing?.subtype || '',
    collection: existing?.collection || '',
    categoryName: existing?.categoryName || '',
    brand: existing?.brand || 'Fusora',
    image: existing?.image || '',
    images: existing?.images || [],
    description: existing?.description || '',
    sizes: existing?.sizes || [],
    fabric: existing?.fabric || '',
    sku: existing?.sku || '',
    topDeal: existing?.topDeal || false,
  }))
  const [sizesText, setSizesText] = useState(
    (existing?.sizes || []).join(', '),
  )
  const [extraImages, setExtraImages] = useState(
    (existing?.images || []).join('\n'),
  )
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim() || !form.image.trim()) {
      setError('Name and main image URL are required.')
      return
    }
    if (!form.price || form.price <= 0) {
      setError('Enter a valid price.')
      return
    }
    const product = upsertAdminProduct(
      {
        ...form,
        was: form.was > 0 ? form.was : form.price,
        sizes: sizesText
          .split(/[,|\n]/)
          .map((s) => s.trim())
          .filter(Boolean),
        images: extraImages
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean),
        categoryName:
          form.categoryName ||
          categoryOptions.find((c) => c.id === form.tab)?.label.replace(/^.\s/, '') ||
          form.tab,
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
            Fill details and save — product goes live on the store.
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
        className="grid gap-6 border border-[#ececec] bg-white p-4 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]"
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
              Category *
              <select
                className={field}
                value={form.tab}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tab: e.target.value }))
                }
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
              Apparel subtype
              <select
                className={field}
                value={form.subtype || ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    subtype: e.target.value as AdminProductInput['subtype'],
                  }))
                }
              >
                <option value="">— None —</option>
                {apparelSubtypes.map((s) => (
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

          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Collection slug (optional)
            <input
              className={field}
              placeholder="e.g. banarasi-sarees"
              value={form.collection || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, collection: e.target.value }))
              }
            />
          </label>

          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Sizes (comma separated)
            <input
              className={field}
              placeholder="S, M, L, XL or Free Size"
              value={sizesText}
              onChange={(e) => setSizesText(e.target.value)}
            />
          </label>

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
          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Main image URL *
            <input
              required
              className={field}
              placeholder="https://..."
              value={form.image}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
            />
          </label>
          {form.image && (
            <img
              src={form.image}
              alt=""
              className="aspect-[3/4] w-full max-w-xs object-cover bg-[#f5f5f5]"
            />
          )}
          <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Extra image URLs (one per line)
            <textarea
              rows={5}
              className={field}
              value={extraImages}
              onChange={(e) => setExtraImages(e.target.value)}
            />
          </label>

          {error && (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#b4232f]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#323232] py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-white uppercase"
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
