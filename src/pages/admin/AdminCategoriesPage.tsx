import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../hooks/useCatalog'
import {
  deleteAdminCategory,
  slugify,
  upsertAdminCategory,
} from '../../lib/adminCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'

const field =
  'mt-1.5 w-full border border-[#ececec] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#323232]'

export function AdminCategoriesPage() {
  usePageTitle('Admin categories')
  const { adminCategories, refresh } = useCatalog()
  const [label, setLabel] = useState('')
  const [emoji, setEmoji] = useState('🛍️')
  const [image, setImage] = useState('')
  const [blurb, setBlurb] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return
    const cat = upsertAdminCategory({
      id: slugify(label),
      label: label.trim(),
      emoji: emoji.trim() || '🛍️',
      image: image.trim() || undefined,
      blurb: blurb.trim() || undefined,
    })
    setLabel('')
    setImage('')
    setBlurb('')
    setEmoji('🛍️')
    setMessage(`Saved category “${cat.label}” — shop URL: /category/${cat.id}`)
    refresh()
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-wide">Categories</h1>
      <p className="mt-1 text-sm text-[#787878]">
        Create custom categories, then assign them when adding products.
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
          Emoji
          <input
            className={field}
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </label>
        <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
          Cover image URL
          <input
            className={field}
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>
        <label className="block text-[0.7rem] font-semibold tracking-[0.12em] uppercase sm:col-span-2">
          Short blurb
          <input
            className={field}
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
          />
        </label>
        {message && (
          <p className="border border-[#ececec] bg-[#f5f5f5] px-3 py-2 text-sm sm:col-span-2">
            {message}
          </p>
        )}
        <button
          type="submit"
          className="bg-[#323232] px-5 py-3 text-[0.7rem] font-semibold tracking-[0.14em] text-white uppercase sm:col-span-2 sm:justify-self-start"
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
                className="flex flex-wrap items-center justify-between gap-3 border border-[#ececec] bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {c.emoji} {c.label}
                  </p>
                  <p className="text-xs text-[#787878]">
                    /category/{c.id}
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
