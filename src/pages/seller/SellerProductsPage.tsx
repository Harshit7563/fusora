import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Pencil, Plus, Trash2, Upload, X } from 'lucide-react'
import { formatMoney, type Product } from '../../data'
import { apparelSubtypes, type ApparelSubtype } from '../../data/apparel'
import { useCatalog } from '../../hooks/useCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'
import { filesToDataUrls } from '../../lib/imageUpload'
import {
  deleteSellerProduct,
  fetchMySellerProducts,
  upsertSellerProduct,
} from '../../lib/sellerApi'
import { refreshSellerProducts } from '../../lib/sellerCatalog'
import { defaultSizesForSubtype } from '../../lib/adminCatalog'

const MAX_PHOTOS = 4

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
  'w-full h-11 border border-[#d9d9d9] px-3 text-sm focus:outline-none focus:border-[#cf2028] bg-white'

export function SellerProductsPage() {
  usePageTitle('My products')
  const { refresh } = useCatalog()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>(
    Array(MAX_PHOTOS).fill(null),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [okMsg, setOkMsg] = useState('')

  const filledPhotos = photoSlots.filter(Boolean).length
  const subtypeOptions = useMemo(
    () =>
      apparelSubtypes.filter(
        (s) =>
          form.gender !== 'men' || (s.id !== 'sarees' && s.id !== 'dresses'),
      ),
    [form.gender],
  )

  const reload = async () => {
    const list = await fetchMySellerProducts()
    setProducts(list)
    await refreshSellerProducts()
    refresh()
  }

  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const field = (label: string, child: ReactNode) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#070001]">
        {label}
      </span>
      {child}
    </label>
  )

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
    resetPhotos([p.image, ...(p.images || [])].filter(Boolean))
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
        const old = next[slotIndex]
        if (old?.kind === 'new') URL.revokeObjectURL(old.preview)
        next[slotIndex] = {
          kind: 'new',
          file: files[0],
          preview: URL.createObjectURL(files[0]),
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

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete “${name}”?`)) return
    await deleteSellerProduct(id)
    setOkMsg(`Deleted “${name}”`)
    await reload()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Product name required')
    if (!form.subtype) return setError('Product type select karo')
    if (form.gender === 'men' && (form.subtype === 'sarees' || form.subtype === 'dresses')) {
      return setError('Sarees belong in Women')
    }
    if (!form.price || Number(form.price) <= 0) {
      return setError('Price required')
    }
    if (filledPhotos < 1) return setError('Kam se kam 1 photo upload karo')

    setSaving(true)
    try {
      const newFiles = photoSlots
        .filter(
          (s): s is Extract<PhotoSlot, { kind: 'new' }> => s?.kind === 'new',
        )
        .map((s) => s.file)
      const uploaded =
        newFiles.length > 0
          ? await filesToDataUrls(newFiles, newFiles.length)
          : []

      let uploadIdx = 0
      const images = photoSlots
        .filter(Boolean)
        .map((s) => {
          if (s!.kind === 'existing') return s!.url
          return uploaded[uploadIdx++] || ''
        })
        .filter(Boolean)
        .slice(0, MAX_PHOTOS)

      const price = Number(form.price)
      const was = form.was ? Number(form.was) : price
      const { product } = await upsertSellerProduct({
        id: editingId || undefined,
        name: form.name.trim(),
        price,
        was,
        gender: form.gender,
        subtype: form.subtype as ApparelSubtype,
        description: form.description.trim(),
        fabric: form.fabric.trim(),
        fit: form.subtype === 'jeans' ? form.fit : undefined,
        wash: form.subtype === 'jeans' ? form.wash : undefined,
        topDeal: form.topDeal,
        images,
      })

      setOkMsg(
        editingId
          ? `“${product.name}” update ho gaya`
          : `“${product.name}” live ho gaya`,
      )
      setShowForm(false)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl tracking-[0.04em] uppercase">
            My products
          </h1>
          <p className="mt-0.5 text-sm text-[#6a6667]">
            {products.length} listed · sizes:{' '}
            {defaultSizesForSubtype(form.subtype || 'shirts').join(', ')}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-[#cf2028] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      {okMsg && !showForm && (
        <p className="mb-4 border border-[#ffc462] bg-[#fff8e8] px-3 py-2 text-sm">
          {okMsg}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="mb-8 border border-[#d9d9d9] bg-white p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit product' : 'New product'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {field(
              'Product name',
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />,
            )}
            {field(
              'Category',
              <select
                className={inputClass}
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    gender: e.target.value as 'men' | 'women',
                    subtype:
                      e.target.value === 'men' && (f.subtype === 'sarees' || f.subtype === 'dresses')
                        ? ''
                        : f.subtype,
                  }))
                }
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>,
            )}
            {field(
              'Type',
              <select
                className={inputClass}
                value={form.subtype}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    subtype: e.target.value as ApparelSubtype | '',
                  }))
                }
              >
                <option value="">Select type</option>
                {subtypeOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>,
            )}
            {field(
              'Price (₹)',
              <input
                className={inputClass}
                inputMode="numeric"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />,
            )}
            {field(
              'MRP / Was (₹)',
              <input
                className={inputClass}
                inputMode="numeric"
                value={form.was}
                onChange={(e) =>
                  setForm((f) => ({ ...f, was: e.target.value }))
                }
              />,
            )}
            {field(
              'Fabric',
              <input
                className={inputClass}
                value={form.fabric}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fabric: e.target.value }))
                }
                placeholder="Cotton, silk…"
              />,
            )}
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium">Description</span>
            <textarea
              className={`${inputClass} h-24 py-2`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">
              Photos ({filledPhotos}/{MAX_PHOTOS}) — min 1
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photoSlots.map((slot, i) => {
                const preview =
                  slot?.kind === 'existing'
                    ? slot.url
                    : slot?.kind === 'new'
                      ? slot.preview
                      : ''
                return (
                  <div
                    key={i}
                    className="relative aspect-square border border-dashed border-[#d9d9d9] bg-[#f7f5f5]"
                  >
                    {preview ? (
                      <>
                        <img
                          src={preview}
                          alt=""
                          className="size-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => clearSlot(i)}
                          className="absolute top-1 right-1 bg-white/90 p-1"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="flex size-full cursor-pointer flex-col items-center justify-center gap-1 text-xs text-[#6a6667]">
                        <Upload size={18} />
                        Add
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onPickSlot(i, e)}
                        />
                      </label>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.topDeal}
              onChange={(e) =>
                setForm((f) => ({ ...f, topDeal: e.target.checked }))
              }
              className="accent-[#cf2028]"
            />
            Mark as deal / highlight
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[#cf2028]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 w-full bg-[#cf2028] py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId ? 'Update product' : 'Publish product'}
          </button>
        </form>
      )}

      <ul className="space-y-3">
        {products.length === 0 && !showForm && (
          <li className="border border-dashed border-[#d9d9d9] bg-white px-4 py-10 text-center text-sm text-[#6a6667]">
            No products yet. Click Add product to list your first item.
          </li>
        )}
        {products.map((p) => (
          <li
            key={p.id}
            className="flex gap-3 border border-[#d9d9d9] bg-white p-3"
          >
            <img
              src={p.image}
              alt=""
              className="size-20 shrink-0 object-cover bg-[#f7f5f5]"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-[#6a6667]">
                {p.gender} · {p.subtype} · {formatMoney(p.price)}{' '}
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    p.status === 'approved' || !p.status
                      ? 'bg-green-100 text-green-700'
                      : p.status === 'rejected'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {p.status || 'approved'}
                </span>
              </p>
              {p.status === 'pending' && (
                <p className="mt-1 text-xs text-amber-700">
                  Admin approval ke baad hi ye product customers ko dikhega.
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="inline-flex items-center gap-1 border border-[#d9d9d9] px-2.5 py-1.5 text-xs font-semibold"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(p.id, p.name)}
                  className="inline-flex items-center gap-1 border border-[#d9d9d9] px-2.5 py-1.5 text-xs font-semibold text-[#cf2028]"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
