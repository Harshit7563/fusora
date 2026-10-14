import { X } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const STORAGE_KEY = 'fusora-newsletter-popup'
const DELAY_MS = 20_000
const HIDE_FOR_MS = 7 * 24 * 60 * 60 * 1000

const POPUP_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'

function shouldShowPopup() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const data = JSON.parse(raw) as { hideUntil?: number }
    if (data.hideUntil && Date.now() < data.hideUntil) return false
    return true
  } catch {
    return true
  }
}

function dismissPopup() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ hideUntil: Date.now() + HIDE_FOR_MS }),
  )
}

export function NewsletterPopup() {
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldShowPopup()) return
    const t = window.setTimeout(() => setOpen(true), DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => {
    dismissPopup()
    setOpen(false)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const value = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter a valid email address.')
      return
    }
    try {
      const key = 'fusora-newsletter-emails'
      const prev = JSON.parse(localStorage.getItem(key) || '[]') as string[]
      if (!prev.includes(value)) {
        localStorage.setItem(key, JSON.stringify([value, ...prev].slice(0, 200)))
      }
    } catch {
      /* ignore */
    }
    setDone(true)
    dismissPopup()
    window.setTimeout(() => setOpen(false), 1600)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-bb-blue-deep/55 backdrop-blur-[2px]"
        aria-label="Close mailing list"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] grid w-full max-w-[820px] overflow-hidden border border-bb-border bg-white shadow-2xl md:grid-cols-2"
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-[2] grid size-9 place-items-center bg-white/90 text-bb-text transition hover:bg-white md:bg-transparent md:text-white md:hover:bg-white/15"
          aria-label="Close"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
          {done ? (
            <div className="text-center">
              <p
                id={titleId}
                className="font-serif text-3xl text-bb-text sm:text-4xl"
              >
                You’re on the list
              </p>
              <p className="mt-3 text-sm text-bb-muted">
                Exclusive updates are on the way.
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-[0.68rem] font-semibold tracking-[0.28em] text-bb-blue uppercase">
                Fusora edit
              </p>
              <h2
                id={titleId}
                className="font-serif mt-3 text-center text-[1.85rem] leading-tight text-bb-text sm:text-4xl"
              >
                Join our mailing list
              </h2>
              <p className="mt-3 text-center text-sm leading-relaxed text-bb-muted">
                Sign up for exclusive updates, new arrivals and insider-only
                discounts.
              </p>

              <form className="mt-8 space-y-3" onSubmit={onSubmit}>
                <label className="block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address *"
                    className="w-full border border-bb-border bg-fusora-ivory px-4 py-3.5 text-sm outline-none transition focus:border-bb-blue"
                    autoComplete="email"
                  />
                </label>
                {error && (
                  <p className="text-xs font-medium text-bb-save">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-bb-blue py-3.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition hover:bg-bb-blue-dark"
                >
                  Subscribe
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-bb-muted">
                We promise to only send you good things.
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <a
                  href={SUPPORT_MAILTO}
                  className="text-bb-muted transition hover:text-bb-blue"
                  aria-label={`Email ${SUPPORT_EMAIL}`}
                  title="Email"
                >
                  <span className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase">
                    Email
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-bb-muted transition hover:text-bb-blue"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </>
          )}
        </div>

        <div className="relative hidden min-h-[280px] md:block">
          <img
            src={POPUP_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bb-blue-deep/35 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  )
}
