import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <main className="mx-auto max-w-[640px] px-4 py-20 text-center">
      <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
        404
      </p>
      <h1 className="font-serif mt-3 text-4xl text-bb-text">Page not found</h1>
      <p className="mt-3 text-sm text-bb-muted">
        This link doesn’t exist in the Fusora edit.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
        >
          Home
        </Link>
        <Link
          to="/deals"
          className="rounded-full border border-bb-border px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
        >
          Shop
        </Link>
      </div>
    </main>
  )
}
