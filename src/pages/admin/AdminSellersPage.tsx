import { useCallback, useEffect, useState } from 'react'
import { formatMoney, type Product } from '../../data'
import {
  fetchAdminSellerProducts,
  moderateSellerProduct,
  SELLER_COMMISSION_PERCENT,
} from '../../lib/sellerApi'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AdminSellersPage() {
  usePageTitle('Admin · Seller approvals')
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setProducts(await fetchAdminSellerProducts())
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load seller products',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const act = async (p: Product, action: 'approve' | 'reject') => {
    setBusyId(p.id)
    try {
      const data = await moderateSellerProduct(p.id, action)
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, ...data.product } : x)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setBusyId(null)
    }
  }

  const pending = products.filter((p) => (p.status || 'approved') === 'pending')
  const rest = products.filter((p) => (p.status || 'approved') !== 'pending')

  const row = (p: Product) => (
    <li
      key={p.id}
      className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
    >
      <img
        src={p.image}
        alt=""
        className="size-16 shrink-0 rounded-lg object-cover bg-gray-100"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{p.name}</p>
        <p className="text-xs text-gray-500">
          {p.sellerShop || 'Seller'} · {p.gender} · {p.subtype} ·{' '}
          {formatMoney(p.price)} · Commission {SELLER_COMMISSION_PERCENT}% ·
          Seller gets {formatMoney(Math.round(p.price * 0.9))}
        </p>
        <p className="text-xs font-bold uppercase">
          <span
            className={
              p.status === 'approved' || !p.status
                ? 'text-green-600'
                : p.status === 'rejected'
                  ? 'text-red-500'
                  : 'text-amber-600'
            }
          >
            {p.status || 'approved'}
          </span>
        </p>
      </div>
      <div className="flex gap-2">
        {(p.status || 'approved') !== 'approved' && (
          <button
            type="button"
            disabled={busyId === p.id}
            onClick={() => void act(p, 'approve')}
            className="rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            Approve
          </button>
        )}
        {(p.status || 'approved') !== 'rejected' && (
          <button
            type="button"
            disabled={busyId === p.id}
            onClick={() => void act(p, 'reject')}
            className="rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            Reject
          </button>
        )}
      </div>
    </li>
  )

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="text-xl font-bold sm:text-2xl">Seller approvals</h1>
      <p className="text-sm text-gray-500">
        Sirf approved products hi store pe live hote hain · Commission{' '}
        {SELLER_COMMISSION_PERCENT}% · Payout seller ke UPI pe delivery ke baad
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {loading ? (
        <p className="mt-8 text-sm text-gray-500">Loading…</p>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Abhi koi seller product nahi hai.
        </div>
      ) : (
        <>
          <h2 className="mt-6 mb-3 text-sm font-bold tracking-wide uppercase">
            Pending ({pending.length})
          </h2>
          <ul className="space-y-3">
            {pending.length ? pending.map(row) : (
              <li className="text-sm text-gray-500">Kuch pending nahi hai.</li>
            )}
          </ul>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-wide uppercase">
            Baaki listings ({rest.length})
          </h2>
          <ul className="space-y-3">{rest.map(row)}</ul>
        </>
      )}
    </div>
  )
}
