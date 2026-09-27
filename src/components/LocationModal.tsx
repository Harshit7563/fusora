import { Loader2, MapPin, Navigation, X } from 'lucide-react'
import { STORES, useStore } from '../context/StoreContext'

export function LocationModal() {
  const {
    locationModalOpen,
    closeLocationModal,
    detectLocation,
    locationStatus,
    setStore,
    store,
    userLocation,
  } = useStore()

  if (!locationModalOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={closeLocationModal}
      />
      <div className="relative z-10 flex max-h-[88svh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-bb-blue">
              <MapPin className="size-5 shrink-0" />
              <h2 className="font-serif text-xl text-bb-text sm:text-2xl">
                Your location
              </h2>
            </div>
            <p className="text-sm text-bb-muted">
              Allow location access so we can show your real area and the nearest
              Fusora hub for pickup.
            </p>
          </div>
          <button
            type="button"
            onClick={closeLocationModal}
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-bb-gray"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 pt-4 pb-5 safe-pb sm:px-6 sm:pb-6">
          {userLocation && (
            <div className="mb-4 rounded-xl bg-bb-blue/8 px-3 py-3 text-sm">
              <p className="font-bold text-bb-text">{userLocation.displayName}</p>
              {userLocation.state && (
                <p className="text-xs text-bb-muted">{userLocation.state}</p>
              )}
              <p className="mt-1 text-xs text-bb-muted">
                GPS: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={detectLocation}
            disabled={locationStatus === 'detecting'}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-bb-blue px-4 py-3 text-xs font-semibold tracking-[0.14em] text-[#f7f3ec] uppercase hover:bg-bb-blue-dark disabled:opacity-70"
          >
            {locationStatus === 'detecting' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Getting your GPS location…
              </>
            ) : (
              <>
                <Navigation className="size-4" />
                {userLocation
                  ? 'Update my location'
                  : 'Allow & detect my location'}
              </>
            )}
          </button>

          {locationStatus === 'denied' && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-bb-save">
              Location blocked. Chrome → site settings → Location → Allow, then
              tap detect again. Or pick a hub below.
            </p>
          )}
          {locationStatus === 'error' && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-bb-save">
              This browser cannot access GPS. Pick a hub manually.
            </p>
          )}

          <p className="mb-2 text-xs font-bold tracking-wide text-bb-muted uppercase">
            Or select a hub manually
          </p>
          <ul className="space-y-1">
            {STORES.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setStore(s)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition hover:bg-bb-gray ${
                    store?.id === s.id
                      ? 'bg-bb-blue/8 ring-1 ring-bb-blue'
                      : ''
                  }`}
                >
                  <span>
                    <span className="block font-semibold text-bb-text">
                      {s.name}
                    </span>
                    <span className="text-xs text-bb-muted">
                      {s.city}, {s.state}
                    </span>
                  </span>
                  {store?.id === s.id && (
                    <span className="text-xs font-bold text-bb-blue">
                      Selected
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
