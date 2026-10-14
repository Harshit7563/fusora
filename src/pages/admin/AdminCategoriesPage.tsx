import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../hooks/useCatalog'
import {
  deleteAdminCategory,
  slugify,
  upsertAdminCategory,
} from '../../lib/adminCatalog'
import { readImageAsDataUrl } from '../../lib/imageUpload'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { ProductGender } from '../../data'

const field =
  'mt-1.5 w-full border border-[#ececec] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#323232]'

export function AdminCategoriesPage() {
  usePageTitle('Admin categories')
  const { adminCategories, refresh } = useCatalog()
  const fileRef = useRef<HTMLInputElement>(null)
  const [label, setLabel] = useState('')
  const [emoji, setEmoji] = useState('🛍️')
  const [image, setImage] = useState('')
  const [blurb, setBlurb] = useState('')
  const [gender, setGender] = useState<ProductGender>('women')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const onPickCover = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const dataUrl = await readImageAsDataUrl(file)
      setImage(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!label.trim()) {
      setError('Category name is required.')
      return
    }
    if (!image) {
      setError('Upload a cover image from your device.')
      return
    }
    const cat = upsertAdminCategory({
      id: slugify(label),
      label: label.trim(),
      emoji: emoji.trim() || '🛍️',
      image,
      blurb: blurb.trim() || undefined,
      gender,
    })
    setLabel('')
    setImage('')
    setBlurb('')
    setEmoji('🛍️')
    setGender('women')
    setMessage(
      `Saved “${cat.label}” · /category/${cat.id}${gender ? ` (${gender})` : ''}`,
    )
    refresh()
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-wide">Categories</h1>
      <p className="mt-1 text-sm text-[#787878]">
        Create categories with a cover photo uploaded from your device.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-4 border border-[#ececec] bg-white p-4 sm:grid-cols-2 sm:p-6"
      >
        <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase sm:col-span-2">
          Category name *
          <input
            required
            className={field}
            placeholder="e.g. Festive Kurtis"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>

        <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
          For gender *
          <select
            className={field}
            value={gender}
            onChange={(e) => setGender(e.target.value as ProductGender)}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>

        <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
          Emoji
          <input
            className={field}
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </label>

        <div className="sm:col-span-2">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
            Cover image * (upload)
          </p>
          <p className="mt-1 text-xs text-[#787878]">
            No URL — pick a photo from your phone or computer.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void onPickCover(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="mt-3 w-full border border-dashed border-[#323232] bg-[#fafafa] px-4 py-8 text-center text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition hover:bg-[#f5f5f5] disabled:opacity-50"
          >
            {uploading
              ? 'Uploading…'
              : image
                ? 'Change cover photo'
                : 'Upload cover from device'}
          </button>
          {image && (
            <div className="relative mt-3 aspect-[16/10] max-w-md overflow-hidden border border-[#ececec] bg-[#f5f5f5]">
              <img src={image} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute top-2 right-2 bg-white/95 px-2 py-1 text-[0.6rem] font-semibold tracking-wide text-[#b4232f] uppercase"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase sm:col-span-2">
          Short blurb
          <input
            className={field}
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
          />
        </label>

        {error && (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#b4232f] sm:col-span-2">
            {error}
          </p>
        )}
        {message && (
          <p className="border border-[#ececec] bg-[#f5f5f5] px-3 py-2 text-sm sm:col-span-2">
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="bg-[#323232] px-5 py-3 text-[0.7rem] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
        >
          Save category
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
          Your categories ({adminCategories.length})
        </h2>
        {adminCategories.length === 0 ? (
          <p className="mt-3 text-sm text-[#787878]">No custom categories yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {adminCategories.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-3 border border-[#ececec] bg-white p-3 sm:p-4"
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt=""
                    className="size-16 shrink-0 object-cover bg-[#f5f5f5]"
                  />
                ) : (
                  <div className="grid size-16 shrink-0 place-items-center bg-[#f5f5f5] text-xl">
                    {c.emoji}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {c.emoji} {c.label}
                  </p>
                  <p className="text-xs text-[#787878]">
                    /category/{c.id}
                    {c.gender ? ` · ${c.gender}` : ''}
                    {c.blurb ? ` · ${c.blurb}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/category/${c.id}`}
                    className="border border-[#ececec] px-3 py-2 text-[0.65rem] font-semibold tracking-wide uppercase"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(`Delete category “${c.label}”?`)) return
                      deleteAdminCategory(c.id)
                      refresh()
                    }}
                    className="border border-red-200 px-3 py-2 text-[0.65rem] font-semibold tracking-wide text-[#b4232f] uppercase"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
