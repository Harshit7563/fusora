import { Clock, Mail, MapPin, Package, Truck } from 'lucide-react'
import { STORES } from '../context/StoreContext'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '../brand'

export function StoresPage() {
  const centre = STORES[0]

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold">Our fulfilment centre</h1>
      <p className="mt-2 text-bb-muted">
        Fusora is an online-first fashion store. Every order is packed and
        dispatched from the one centre below — we do not run walk-in retail
        stores, so there are no other hubs to pick from.
      </p>

      {centre && (
        <div className="mt-8 rounded-2xl border border-bb-border p-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-bb-blue" />
            <div>
              <p className="font-bold text-bb-text">{centre.name}</p>
              <p className="mt-1 text-sm text-bb-muted">{centre.address}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-bb-gray p-4">
              <Truck className="size-5 text-bb-blue" />
              <p className="mt-2 text-sm font-bold text-bb-text">
                Delivery in 1–7 days
              </p>
              <p className="mt-1 text-sm text-bb-muted">
                Dispatched from Maharashtra and delivered across India.
                Tracking is shared by email and SMS once your order ships.
              </p>
            </div>
            <div className="rounded-xl bg-bb-gray p-4">
              <Package className="size-5 text-bb-blue" />
              <p className="mt-2 text-sm font-bold text-bb-text">Pickup</p>
              <p className="mt-1 text-sm text-bb-muted">{centre.pickup}</p>
            </div>
            <div className="rounded-xl bg-bb-gray p-4">
              <Clock className="size-5 text-bb-blue" />
              <p className="mt-2 text-sm font-bold text-bb-text">
                Support hours
              </p>
              <p className="mt-1 text-sm text-bb-muted">
                Mon–Sat, 9 AM – 6 PM. For returns, email your Order ID and we
                will arrange a courier pickup from your address.
              </p>
            </div>
          </div>

          <a
            href={SUPPORT_MAILTO}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-bb-blue hover:underline"
          >
            <Mail className="size-4" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      )}
    </main>
  )
}
