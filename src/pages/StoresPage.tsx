import { MapPin, Navigation } from 'lucide-react'
import { STORES, useStore } from '../context/StoreContext'

export function StoresPage() {
  const { store, setStore, detectLocation, locationStatus, openLocationModal } =
    useStore()

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold">Find a store</h1>
      <p className="mt-2 text-bb-muted">
        Pick a Fusora hub for pickup times and local stock.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={detectLocation}
          className="inline-flex items-center gap-2 rounded-full bg-bb-blue px-5 py-2.5 text-sm font-bold text-white"
        >
          <Navigation className="size-4" />
          {locationStatus === 'detecting'
            ? 'Detecting…'
            : 'Use my location'}
        </button>
        <button
          type="button"
          onClick={openLocationModal}
          className="rounded-full border border-bb-border px-5 py-2.5 text-sm font-bold"
        >
          Quick picker
        </button>
      </div>

      <ul className="mt-8 space-y-3">
        {STORES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setStore(s)}
              className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                store?.id === s.id
                  ? 'border-bb-blue bg-bb-blue/5'
                  : 'border-bb-border hover:border-bb-blue'
              }`}
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-bb-blue" />
              <span>
                <span className="block font-bold text-bb-text">{s.name}</span>
                <span className="text-sm text-bb-muted">
                  {s.city}, {s.state} · Open 10 AM – 9 PM
                </span>
                {store?.id === s.id && (
                  <span className="mt-1 block text-xs font-bold text-bb-blue">
                    Your selected store
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
