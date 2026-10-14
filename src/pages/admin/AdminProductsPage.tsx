import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Star, Trash2, Upload, X } from 'lucide-react'
import { formatMoney, type Product } from '../../data'
import { apparelSubtypes, type ApparelSubtype } from '../../data/apparel'
import { useCatalog } from '../../hooks/useCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  defaultSizesForSubtype,
  deleteAdminProduct,
  ensureAdminProductsLoaded,
  loadAdminProducts,
  upsertAdminProduct,
} from '../../lib/adminCatalog'
import { filesToDataUrls } from '../../lib/imageUpload'

const MAX_PHOTOS = 4
const FIT_OPTIONS = [
  'Slim',
  'Regular',
  'Straight',
  'Bootcut',
  'Tapered',
  'Skinny',
  'Relaxed',
  'Wide Leg',
  'Mom Fit',
  'Boyfriend',
  'Cargo',
]
const WASH_OPTIONS = [
  'Dark Indigo',
  'Mid Blue',
  'Light Wash',
  'Black',
  'Grey',
  'Vintage',
  'Raw',
  'Stone Wash',
  'Acid Wash',
  'Faded Blue',
  'Charcoal',
  'Olive',
]

type PhotoSlot =
  | { kind: 'existing'; url: string }
  | { kind: 'new'; file: File; preview: string }
  | null

type FormState = {
  name: string
  description: string
  gender: 'men' | 'women'
  subtype: ApparelSubtype | ''
  price: string
  was: string
  fabric: string
  fit: string
  wash: string
  topDeal: boolean
}

const emptyForm: FormState = {
  name: '',
  description: '',
  gender: 'men',
  subtype: '',
  price: '',
  was: '',
  fabric: '',
  fit: 'Regular',
  wash: 'Mid Blue',
  topDeal: false,
}

const inputClass =
  'w-full h-11 border border-[#e8e8e8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#1a1a1a] bg-white'

export function AdminProductsPage() {
  usePageTitle('Admin products')
  const { refresh } = useCatalog()
  const [products, setProducts] = useState<Product[]>([])
  const [filterGender, setFilterGender] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(
    Array(MAX_PHOTOS).fill(null),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [okMsg, setOkMsg] = useState('')

  useEffect(() => {
    void ensureAdminProductsLoaded().then(() => {
      setProducts(loadAdminProducts())
      refresh()
    })
    // hydrate once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filledPhotos = photoSlots.filter(Boolean).length
  const enabledSizes = defaultSizesForSubtype(form.subtype || undefined)
  const subtypeOptions = useMemo(
    () =>
      apparelSubtypes.filter(
        (s) => form.gender !== 'men' || s.id !== 'sarees',
      ),
    [form.gender],
  )

  const filtered = useMemo(() => {
    if (!filterGender) return products
    return products.filter(
      (p) => p.gender === filterGender || p.tab === filterGender,
    )
  }, [products, filterGender])

  const field = (label: string, child: ReactNode) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {child}
    </label>
  )

  const reload = () => {
    setProducts(loadAdminProducts())
    refresh()
  }

  const resetPhotos = (urls: string[] = []) => {
    const slots: PhotoSlot[] = Array(MAX_PHOTOS).fill(null)
    urls.slice(0, MAX_PHOTOS).forEach((url, i) => {
      slots[i] = { kind: 'existing', url }
    })
    setPhotoSlots(slots)
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    resetPhotos()
    setError('')
    setOkMsg('')
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    setForm({
      name: p.name || '',
      description: p.description || '',
      gender: p.gender === 'women' ? 'women' : 'men',
      subtype: (p.subtype as ApparelSubtype) || '',
      price: String(p.price || ''),
      was: String(p.was || ''),
      fabric: p.fabric || '',
      fit: p.fit || 'Regular',
      wash: p.wash || 'Mid Blue',
      topDeal: Boolean(p.topDeal),
    })
    const gallery = [p.image, ...(p.images || [])].filter(Boolean)
    resetPhotos(gallery)
    setError('')
    setOkMsg('')
    setShowForm(true)
  }

  const onPickSlot = (slotIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    e.target.value = ''

    setPhotoSlots((prev) => {
      const next = [...prev]
      if (files.length === 1) {
        const file = files[0]
        const old = next[slotIndex]
        if (old?.kind === 'new') URL.revokeObjectURL(old.preview)
        next[slotIndex] = {
          kind: 'new',
          file,
          preview: URL.createObjectURL(file),
        }
        return next
      }
      let i = next.findIndex((s) => !s)
      if (i < 0) i = slotIndex
      for (const file of files) {
        while (i < MAX_PHOTOS && next[i]) i += 1
        if (i >= MAX_PHOTOS) break
        next[i] = {
          kind: 'new',
          file,
          preview: URL.createObjectURL(file),
        }
        i += 1
      }
      return next
    })
  }

  const clearSlot = (slotIndex: number) => {
    setPhotoSlots((prev) => {
      const next = [...prev]
      const old = next[slotIndex]
      if (old?.kind === 'new') URL.revokeObjectURL(old.preview)
      next[slotIndex] = null
      return next
    })
  }

  const makeMainPhoto = (slotIndex: number) => {
    if (slotIndex === 0) return
    setPhotoSlots((prev) => {
      const next = [...prev]
      const [picked] = next.splice(slotIndex, 1)
      next.unshift(picked)
      while (next.length < MAX_PHOTOS) next.push(null)
      return next.slice(0, MAX_PHOTOS)
    })
  }

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete “${name}”?`)) return
    await deleteAdminProduct(id)
    reload()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Product name required')
    if (form.gender !== 'men' && form.gender !== 'women') {
      return setError('Category select karo (Men / Women)')
    }
    if (!form.subtype) return setError('Product type select karo')
    if (form.gender === 'men' && form.subtype === 'sarees') {
      return setError('Sarees belong in Women')
    }
    if (!form.price || Number(form.price) <= 0) {
      return setError('Price required')
    }
    if (filledPhotos < MAX_PHOTOS) {
      return setError(`4 photos upload karo (${filledPhotos}/4)`)
    }

    setSaving(true)
    try {
      const newFiles = photoSlots
        .filter(
          (s): s is Extract<PhotoSlot, { kind: 'new' }> => s?.kind === 'new',
        )
        .map((s) => s.file)
      const uploaded =
        newFiles.length > 0 ? await filesToDataUrls(newFiles, newFiles.length) : []

      let uploadIdx = 0
      const images = photoSlots
        .filter(Boolean)
        .map((s) => {
          if (s!.kind === 'existing') return s!.url
          return uploaded[uploadIdx++] || ''
        })
        .filter(Boolean)
        .slice(0, MAX_PHOTOS)

      const [main, ...rest] = images
      const price = Number(form.price)
      const was = form.was ? Number(form.was) : price
      const collection =
        form.subtype === 'jeans'
          ? form.gender === 'men'
            ? 'mens-jeans'
            : 'womens-jeans'
          : undefined

      const product = await upsertAdminProduct(
        {
          name: form.name.trim(),
          price,
          was,
          tab: form.gender,
          gender: form.gender,
          subtype: form.subtype,
          collection,
          categoryName: form.gender === 'men' ? 'Men' : 'Women',
          brand: 'Fusora',
          image: main,
          images: rest,
          description: form.description.trim(),
          fabric: form.fabric.trim(),
          fit: form.subtype === 'jeans' ? form.fit : undefined,
          wash: form.subtype === 'jeans' ? form.wash : undefined,
          topDeal: form.topDeal,
          sizes: defaultSizesForSubtype(form.subtype),
        },
        editingId || undefined,
      )

      setOkMsg(
        editingId
          ? `Joyti Beti — “${product.name}” update ho gaya`
          : `Joyti Beti — “${product.name}” Add ho gya product`,
      )
      setShowForm(false)
      reload()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Save failed. Photos check karke dubara try karo.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Products</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {products.length} products · Men / Women · sizes always unlimited
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className={`${inputClass} sm:w-44`}
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {okMsg && !showForm && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {okMsg}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#e8e8e8] bg-white">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-[#faf9f7]">
            <tr>
              <th className="p-3 text-left font-semibold">Product</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Sizes</th>
              <th className="p-3 text-left font-semibold">Price</th>
              <th className="p-3 text-left font-semibold">Stock</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const imgs = [p.image, ...(p.images || [])].filter(Boolean)
              const sizes = p.sizes?.length
                ? p.sizes
                : defaultSizesForSubtype(p.subtype)
              return (
                <tr key={p.id} className="border-t border-[#f0f0f0]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={imgs[0]}
                          alt=""
                          className="h-14 w-12 rounded-md bg-gray-100 object-cover"
                        />
                        {imgs[0] && (
                          <span className="absolute -top-1 -left-1 rounded bg-[#c41e3a] px-1 text-[8px] font-bold text-white">
                            MAIN
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku || p.id}</p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {imgs.length}/{MAX_PHOTOS} photos
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">
                    {(p.gender || p.tab || '—').toString().toUpperCase()}
                    {p.subtype ? ` / ${p.subtype}` : ''}
                  </td>
                  <td className="max-w-[200px] p-3 text-xs text-gray-600">
                    {sizes.join(', ')}
                  </td>
                  <td className="p-3">{formatMoney(p.price)}</td>
                  <td className="p-3 font-medium text-green-700">Unlimited</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="p-1 text-gray-500 hover:text-[#1a1a1a]"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <Link
                        to={`/product/${p.id}`}
                        className="p-1 text-xs text-gray-500 hover:text-[#1a1a1a]"
                        title="View"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => void remove(p.id, p.name)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No products yet. Click Add Product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={openAdd}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-4 text-sm font-medium text-white hover:bg-[#333]"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-[#e8e8e8] bg-white px-5 py-4">
              <h2 className="text-lg font-bold">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => void submit(e)} className="space-y-6 p-5">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <section className="space-y-4">
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Basic info
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field(
                    'Category * (Men / Women)',
                    <select
                      required
                      value={form.gender}
                      onChange={(e) => {
                        const gender = e.target.value as 'men' | 'women'
                        setForm((f) => ({
                          ...f,
                          gender,
                          subtype:
                            gender === 'men' && f.subtype === 'sarees'
                              ? ''
                              : f.subtype,
                        }))
                      }}
                      className={inputClass}
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>,
                  )}
                  {field(
                    'Product type *',
                    <select
                      required
                      value={form.subtype}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          subtype: e.target.value as ApparelSubtype | '',
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="">Select type</option>
                      {subtypeOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>,
                  )}
                </div>
                {field(
                  'Product Name *',
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="e.g. Slim Fit Stretch Jeans - Mid Blue"
                  />,
                )}
                {field(
                  'Description',
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className={inputClass}
                  />,
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {field(
                    'Price ₹ *',
                    <input
                      required
                      type="number"
                      min={1}
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className={inputClass}
                    />,
                  )}
                  {field(
                    'Compare at ₹',
                    <input
                      type="number"
                      min={0}
                      value={form.was}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, was: e.target.value }))
                      }
                      className={inputClass}
                    />,
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  SKU automatic generate hoga (jaise FS-482913).
                </p>
              </section>

              {form.subtype === 'jeans' && (
                <section className="space-y-4">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Fit & wash
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {field(
                      'Fit',
                      <select
                        value={form.fit}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, fit: e.target.value }))
                        }
                        className={inputClass}
                      >
                        {FIT_OPTIONS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>,
                    )}
                    {field(
                      'Wash',
                      <select
                        value={form.wash}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, wash: e.target.value }))
                        }
                        className={inputClass}
                      >
                        {WASH_OPTIONS.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>,
                    )}
                    {field(
                      'Fabric',
                      <input
                        value={form.fabric}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, fabric: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="98% Cotton, 2% Elastane"
                      />,
                    )}
                  </div>
                </section>
              )}

              {form.subtype && form.subtype !== 'jeans' && (
                <section className="space-y-4">
                  {field(
                    'Fabric',
                    <input
                      value={form.fabric}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fabric: e.target.value }))
                      }
                      className={inputClass}
                    />,
                  )}
                </section>
              )}

              <section className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Size & stock
                  </h3>
                  <p className="mt-1 text-xs font-medium text-green-700">
                    Automatic · all sizes unlimited (no pieces fill karna)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 rounded-xl border border-green-200 bg-green-50/50 p-3">
                  {enabledSizes.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm font-medium"
                    >
                      Size {s}
                      <span className="text-[10px] font-bold tracking-wide text-green-700 uppercase">
                        Unlimited
                      </span>
                    </span>
                  ))}
                  {!form.subtype && (
                    <span className="text-xs text-gray-500">
                      Product type select karo — sizes auto set ho jayenge
                    </span>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Photos * ({filledPhotos}/{MAX_PHOTOS})
                </h3>
                <p className="mb-3 text-xs text-gray-500">
                  Exactly 4 photos.{' '}
                  <strong>Photo 1 = Main pic</strong> (product card & listing pe
                  yahi dikhegi). Baaki gallery me.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {photoSlots.map((slot, i) => {
                    const src =
                      slot?.kind === 'existing'
                        ? slot.url
                        : slot?.kind === 'new'
                          ? slot.preview
                          : null
                    const fileName =
                      slot?.kind === 'new' ? slot.file.name : null
                    const isMain = i === 0 && Boolean(src)
                    return (
                      <div
                        key={i}
                        className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 bg-[#fafafa] ${
                          isMain
                            ? 'border-[#c41e3a]'
                            : 'border-dashed border-[#e8e8e8]'
                        }`}
                      >
                        {src ? (
                          <>
                            <img
                              src={src}
                              alt={fileName || `Photo ${i + 1}`}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-1.5">
                              {isMain ? (
                                <span className="inline-flex items-center gap-0.5 rounded bg-[#c41e3a] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                                  <Star size={10} fill="currentColor" /> Main
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => makeMainPhoto(i)}
                                  className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white hover:bg-[#c41e3a]"
                                >
                                  Set main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => clearSlot(i)}
                                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow"
                              >
                                ×
                              </button>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-black/65 px-1.5 py-1.5 text-white">
                              <p className="text-[10px] font-semibold">
                                Photo {i + 1}
                                {isMain ? ' · Main' : ''}
                              </p>
                              {fileName && (
                                <p
                                  className="truncate text-[9px] text-white/80"
                                  title={fileName}
                                >
                                  {fileName}
                                </p>
                              )}
                              {slot?.kind === 'existing' && (
                                <p className="text-[9px] text-white/70">
                                  Uploaded
                                </p>
                              )}
                              {slot?.kind === 'new' && (
                                <p className="text-[9px] text-amber-200">
                                  New · will save on submit
                                </p>
                              )}
                            </div>
                            <label className="absolute inset-0 cursor-pointer">
                              <span className="sr-only">
                                Change photo {i + 1}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => onPickSlot(i, e)}
                              />
                            </label>
                          </>
                        ) : (
                          <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1.5 p-2 text-center transition hover:bg-[#f0f0f0]">
                            <Upload size={18} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">
                              {i === 0 ? 'Main photo' : `Photo ${i + 1}`}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Tap to upload
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple={i === 0}
                              className="hidden"
                              onChange={(e) => onPickSlot(i, e)}
                            />
                          </label>
                        )}
                      </div>
                    )
                  })}
                </div>
                {filledPhotos > 0 && photoSlots[0] && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#e4e7ec] bg-[#f7f8fa] p-3">
                    <img
                      src={
                        photoSlots[0].kind === 'existing'
                          ? photoSlots[0].url
                          : photoSlots[0].preview
                      }
                      alt="Main preview"
                      className="h-16 w-14 rounded-md object-cover ring-2 ring-[#c41e3a]"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-[#0f1724]">
                        Main pic preview
                      </p>
                      <p className="text-xs text-gray-500">
                        Listing cards aur product page pe pehli photo dikhegi.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.topDeal}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, topDeal: e.target.checked }))
                  }
                />
                Highlight as New / Top deal
              </label>

              <div className="flex justify-end gap-3 border-t border-[#f0f0f0] pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#e8e8e8] px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#1a1a1a] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Product'
                      : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
