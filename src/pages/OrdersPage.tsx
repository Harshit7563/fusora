import {
  ChevronRight,
  MapPin,
  Package,
  Search,
  Truck,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatMoney } from '../data'
import {
  ORDER_STATUS_LABEL,
  ORDER_TRACK_STEPS,
  useStore,
  type Order,
  type OrderStatus,
} from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'

function formatOrderDate(ts: number) {
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function stepIndex(status: OrderStatus) {
  if (status === 'cancelled') return -1
  const i = ORDER_TRACK_STEPS.indexOf(status)
  return i < 0 ? 0 : i
}

function OrderTrackTimeline({ order }: { order: Order }) {
  const active = stepIndex(order.status)
  if (order.status === 'cancelled') {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-bb-save">
        This order was cancelled. Write to{' '}
        <a href={SUPPORT_MAILTO} className="underline">
          {SUPPORT_EMAIL}
        </a>{' '}
        for help.
      </p>
    )
  }

  return (
    <ol className="space-y-0">
      {ORDER_TRACK_STEPS.map((status, i) => {
        const done = i <= active
        const current = i === active
        return (
          <li key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full ${
                  done ? 'bg-bb-blue' : 'bg-bb-border'
                } ${current ? 'ring-4 ring-bb-blue/20' : ''}`}
              />
              {i < ORDER_TRACK_STEPS.length - 1 && (
                <span
                  className={`w-px flex-1 min-h-8 ${
                    i < active ? 'bg-bb-blue' : 'bg-bb-border'
                  }`}
                />
              )}
            </div>
            <div className={`pb-6 ${current ? 'text-bb-text' : 'text-bb-muted'}`}>
              <p
                className={`text-sm ${
                  current ? 'font-semibold' : done ? 'font-medium' : ''
                }`}
              >
                {ORDER_STATUS_LABEL[status]}
              </p>
              {current && (
                <p className="mt-0.5 text-xs text-bb-muted">
                  Current status · {order.hub}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function OrdersPage() {
  usePageTitle('My orders')
  const navigate = useNavigate()
  const { isLoggedIn, user, orders } = useStore()
  const [trackId, setTrackId] = useState('')

  const mine = useMemo(
    () =>
      user
        ? orders.filter(
            (o) => o.userEmail.toLowerCase() === user.email.toLowerCase(),
          )
        : [],
    [orders, user],
  )

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-bb-text">My orders</h1>
        <p className="mt-3 text-sm text-bb-muted">
          Sign in to view and track your Fusora orders.
        </p>
        <Link
          to="/account?next=/orders"
          className="mt-8 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
        >
          Sign in
        </Link>
      </main>
    )
  }

  const onTrack = (e: FormEvent) => {
    e.preventDefault()
    const id = trackId.trim().toUpperCase()
    if (!id) return
    navigate(`/orders/${id}`)
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 py-8 sm:py-10 lg:px-6">
      <h1 className="font-serif text-3xl text-bb-text sm:text-4xl">My orders</h1>
      <p className="mt-2 text-sm text-bb-muted">
        Track pickup and delivery for orders on your Fusora account.
      </p>

      <form
        onSubmit={onTrack}
        className="mt-6 flex gap-2 rounded-2xl border border-bb-border bg-white p-2"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bb-muted" />
          <input
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="Track by order ID (e.g. FUS12345678)"
            className="w-full rounded-xl bg-transparent py-2.5 pr-3 pl-10 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 bg-bb-blue px-4 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase"
        >
          Track
        </button>
      </form>

      {mine.length === 0 ? (
        <div className="mt-10 border border-dashed border-bb-border px-6 py-16 text-center">
          <Package className="mx-auto size-10 text-bb-muted" />
          <p className="mt-4 font-serif text-2xl text-bb-text">No orders yet</p>
          <p className="mt-2 text-sm text-bb-muted">
            When you place an order, it will show up here for tracking.
          </p>
          <Link
            to="/deals"
            className="mt-6 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {mine.map((order) => (
            <li key={order.id}>
              <Link
                to={`/orders/${order.id}`}
                className="flex gap-3 rounded-2xl border border-bb-border bg-white p-4 transition hover:border-bb-blue"
              >
                <img
                  src={order.items[0]?.image}
                  alt=""
                  className="size-16 shrink-0 rounded-lg object-cover bg-bb-gray"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-bb-text">
                        {order.id}
                      </p>
                      <p className="mt-0.5 text-xs text-bb-muted">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 size-4 shrink-0 text-bb-muted" />
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm text-bb-muted">
                    {order.items.map((i) => i.name).join(', ')}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-semibold text-bb-blue">
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                    <span className="text-bb-muted">
                      {formatMoney(order.total)}
                    </span>
                    <span className="text-bb-muted">{order.hub}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export function OrderDetailPage() {
  const { id = '' } = useParams()
  const { isLoggedIn, getOrder, user } = useStore()
  const order = getOrder(id.toUpperCase()) || getOrder(id)
  usePageTitle(order ? `Order ${order.id}` : 'Track order')

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Track order</h1>
        <p className="mt-3 text-sm text-bb-muted">Sign in to track this order.</p>
        <Link
          to={`/account?next=/orders/${encodeURIComponent(id)}`}
          className="mt-8 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
        >
          Sign in
        </Link>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Order not found</h1>
        <p className="mt-3 text-sm text-bb-muted">
          We couldn’t find <strong>{id}</strong> on this account.
        </p>
        <Link
          to="/orders"
          className="mt-8 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
        >
          My orders
        </Link>
      </main>
    )
  }

  if (
    user &&
    order.userEmail.toLowerCase() !== user.email.toLowerCase()
  ) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Order not found</h1>
        <p className="mt-3 text-sm text-bb-muted">
          This order belongs to a different account.
        </p>
        <Link
          to="/orders"
          className="mt-8 inline-flex bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase"
        >
          My orders
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 py-8 sm:py-10 lg:px-6">
      <nav className="mb-4 text-xs tracking-wide text-bb-muted uppercase">
        <Link to="/account" className="hover:text-bb-text">
          Account
        </Link>
        {' / '}
        <Link to="/orders" className="hover:text-bb-text">
          Orders
        </Link>
        {' / '}
        <span className="text-bb-text">{order.id}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-bb-text sm:text-4xl">
            {order.id}
          </h1>
          <p className="mt-2 text-sm text-bb-muted">
            Placed {formatOrderDate(order.createdAt)} ·{' '}
            {ORDER_STATUS_LABEL[order.status]}
          </p>
        </div>
        <p className="font-serif text-2xl text-bb-text">
          {formatMoney(order.total)}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-bb-border bg-white p-5">
          <div className="mb-5 flex items-center gap-2">
            <Truck className="size-5 text-bb-blue" />
            <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
              Track order
            </h2>
          </div>
          <OrderTrackTimeline order={order} />
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-bb-border bg-white p-5">
            <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
              Items
            </h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 text-sm">
                  <img
                    src={item.image}
                    alt=""
                    className="size-14 rounded-lg object-cover bg-bb-gray"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="line-clamp-2 font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-bb-muted">
                      {item.selectedSize
                        ? `Size ${item.selectedSize} · `
                        : ''}
                      Qty {item.qty} · {formatMoney(item.price * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-bb-border bg-white p-5 text-sm">
            <h2 className="text-sm font-semibold tracking-[0.14em] uppercase">
              Delivery details
            </h2>
            <ul className="mt-4 space-y-3 text-bb-muted">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-bb-blue" />
                <span>
                  <span className="block font-semibold text-bb-text">
                    {order.hub}
                  </span>
                  {order.locationLabel}
                  <span className="mt-1 block">{order.address}</span>
                </span>
              </li>
              <li>
                <span className="font-semibold text-bb-text">Contact</span>
                <span className="mt-0.5 block">
                  {order.name} · {order.phone}
                </span>
              </li>
              <li>
                <span className="font-semibold text-bb-text">Payment</span>
                <span className="mt-0.5 block uppercase">
                  {order.payment === 'cod'
                    ? 'Cash on delivery'
                    : order.payment === 'card'
                      ? 'Debit / Credit card'
                      : order.payment === 'netbanking'
                        ? 'Net banking'
                        : 'UPI'}
                </span>
                {order.payment === 'upi' && order.utr && (
                  <span className="mt-1 block text-xs normal-case text-bb-muted">
                    UTR: <strong className="text-bb-text">{order.utr}</strong>
                    {order.paymentPending
                      ? ' · Verification in 2–3 hours'
                      : ''}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/orders"
          className="border border-bb-border px-5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase"
        >
          All orders
        </Link>
        <a
          href={SUPPORT_MAILTO}
          className="bg-bb-blue px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase"
        >
          Need help?
        </a>
      </div>
    </main>
  )
}
