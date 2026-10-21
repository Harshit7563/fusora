import { useCallback, useEffect, useState } from 'react'
import { formatMoney } from '../../data'
import {
  ORDER_STATUS_LABEL,
  type Order,
  type OrderStatus,
} from '../../context/StoreContext'
import {
  fetchAllOrdersAdmin,
  updateOrderStatusAdmin,
} from '../../lib/ordersApi'
import { usePageTitle } from '../../hooks/usePageTitle'

const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]

export function AdminOrdersPage() {
  usePageTitle('Admin · Orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setOrders(await fetchAllOrdersAdmin())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const changeStatus = async (order: Order, status: OrderStatus) => {
    setBusyId(order.id)
    try {
      await updateOrderStatusAdmin(order.id, status)
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed')
    } finally {
      setBusyId(null)
    }
  }

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0)

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Orders</h1>
          <p className="text-sm text-gray-500">
            Server orders · {orders.length} total · Revenue{' '}
            {formatMoney(revenue)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-gray-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No orders on the server yet. New checkout orders will appear here
          automatically.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((o) => (
            <article
              key={o.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {o.id}{' '}
                    <span className="ml-1 rounded-full bg-[#fff3d6] px-2 py-0.5 text-[11px] font-bold text-[#8a6100] uppercase">
                      {o.payment}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleString('en-IN')} ·{' '}
                    {o.items.reduce((s, i) => s + i.qty, 0)} items
                    {o.paymentId ? ` · Razorpay ${o.paymentId}` : ''}
                  </p>
                  <p className="mt-1 text-sm">
                    {o.name} · {o.phone}
                    {o.email ? ` · ${o.email}` : ''}
                  </p>
                  <p className="text-xs text-gray-500">{o.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatMoney(o.total)}</p>
                  <select
                    value={o.status}
                    disabled={busyId === o.id}
                    onChange={(e) =>
                      void changeStatus(o, e.target.value as OrderStatus)
                    }
                    className="mt-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-semibold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
                {o.items.map((it, idx) => (
                  <li
                    key={`${it.id}-${idx}`}
                    className="flex justify-between py-1.5 text-xs"
                  >
                    <span>
                      {it.name} × {it.qty}
                      {it.selectedSize ? ` · Size ${it.selectedSize}` : ''}
                    </span>
                    <span>{formatMoney(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
