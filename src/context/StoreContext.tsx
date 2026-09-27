import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../data'

export type StoreLocation = {
  id: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
}

/** User's real GPS + reverse-geocoded place */
export type UserLocation = {
  lat: number
  lng: number
  city: string
  area: string
  state: string
  displayName: string
  nearestHubId: string
  updatedAt: number
}

export const STORES: StoreLocation[] = [
  { id: 'mumbai', name: 'Mumbai Hub', city: 'Mumbai', state: 'MH', lat: 19.076, lng: 72.8777 },
  { id: 'delhi', name: 'Delhi NCR Hub', city: 'Delhi', state: 'DL', lat: 28.6139, lng: 77.209 },
  { id: 'bengaluru', name: 'Bengaluru Hub', city: 'Bengaluru', state: 'KA', lat: 12.9716, lng: 77.5946 },
  { id: 'hyderabad', name: 'Hyderabad Hub', city: 'Hyderabad', state: 'TS', lat: 17.385, lng: 78.4867 },
  { id: 'pune', name: 'Pune Hub', city: 'Pune', state: 'MH', lat: 18.5204, lng: 73.8567 },
  { id: 'chennai', name: 'Chennai Hub', city: 'Chennai', state: 'TN', lat: 13.0827, lng: 80.2707 },
  { id: 'kolkata', name: 'Kolkata Hub', city: 'Kolkata', state: 'WB', lat: 22.5726, lng: 88.3639 },
  { id: 'ahmedabad', name: 'Ahmedabad Hub', city: 'Ahmedabad', state: 'GJ', lat: 23.0225, lng: 72.5714 },
]

const USER_LOC_KEY = 'fusora-user-location'
const STORE_KEY = 'fusora-store'
const CART_KEY = 'fusora-cart'
const WISH_KEY = 'fusora-wishlist'

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function nearestStore(lat: number, lng: number): StoreLocation {
  return STORES.reduce((best, store) => {
    const d = haversineKm({ lat, lng }, store)
    const bestD = haversineKm({ lat, lng }, best)
    return d < bestD ? store : best
  })
}

async function reverseGeocode(lat: number, lng: number): Promise<{
  city: string
  area: string
  state: string
  displayName: string
}> {
  // BigDataCloud — works from browser, no API key
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
  )
  if (!res.ok) throw new Error('geocode failed')
  const data = (await res.json()) as {
    city?: string
    locality?: string
    principalSubdivision?: string
    localityInfo?: { administrative?: { name: string; order: number }[] }
  }

  const city =
    data.city ||
    data.locality ||
    data.localityInfo?.administrative?.find((a) => a.order === 8)?.name ||
    'Your area'
  const area =
    data.locality && data.locality !== city
      ? data.locality
      : data.localityInfo?.administrative?.find((a) => a.order >= 9)?.name || ''
  const state = data.principalSubdivision || ''
  const displayName = [area, city].filter(Boolean).join(', ') || city

  return { city, area, state, displayName }
}

type StoreContextValue = {
  store: StoreLocation | null
  setStore: (store: StoreLocation) => void
  userLocation: UserLocation | null
  locationStatus: 'idle' | 'detecting' | 'ready' | 'denied' | 'error'
  locationLabel: string
  locationSubLabel: string
  locationModalOpen: boolean
  openLocationModal: () => void
  closeLocationModal: () => void
  detectLocation: () => void
  cart: CartItem[]
  cartCount: number
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product) => void
  setQty: (id: string, qty: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  wishlist: Set<string>
  toggleWish: (id: string) => void
  toast: string | null
}

const StoreContext = createContext<StoreContextValue | null>(null)

function readSavedUserLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem(USER_LOC_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserLocation
  } catch {
    return null
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() =>
    readSavedUserLocation(),
  )
  const [store, setStoreState] = useState<StoreLocation | null>(() => {
    const savedUser = readSavedUserLocation()
    if (savedUser) {
      return STORES.find((s) => s.id === savedUser.nearestHubId) ?? STORES[0]
    }
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as StoreLocation
      return STORES.find((s) => s.id === parsed.id) ?? parsed
    } catch {
      return null
    }
  })
  const [locationStatus, setLocationStatus] = useState<
    StoreContextValue['locationStatus']
  >(userLocation ? 'ready' : 'idle')
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as CartItem[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(WISH_KEY)
      if (!raw) return new Set()
      const parsed = JSON.parse(raw) as string[]
      return new Set(Array.isArray(parsed) ? parsed : [])
    } catch {
      return new Set()
    }
  })
  const [toast, setToast] = useState<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify([...wishlist]))
  }, [wishlist])

  const setStore = useCallback((next: StoreLocation) => {
    setStoreState(next)
    localStorage.setItem(STORE_KEY, JSON.stringify(next))
    setLocationModalOpen(false)
  }, [])

  const saveUserLocation = useCallback(
    (loc: UserLocation) => {
      setUserLocation(loc)
      localStorage.setItem(USER_LOC_KEY, JSON.stringify(loc))
      const hub = STORES.find((s) => s.id === loc.nearestHubId) ?? nearestStore(loc.lat, loc.lng)
      setStoreState(hub)
      localStorage.setItem(STORE_KEY, JSON.stringify(hub))
      setLocationStatus('ready')
      setLocationModalOpen(false)
    },
    [],
  )

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      setLocationModalOpen(true)
      setToast('Geolocation not supported on this browser')
      return
    }

    setLocationStatus('detecting')
    setLocationModalOpen(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const hub = nearestStore(lat, lng)

        try {
          const place = await reverseGeocode(lat, lng)
          const loc: UserLocation = {
            lat,
            lng,
            city: place.city,
            area: place.area,
            state: place.state,
            displayName: place.displayName,
            nearestHubId: hub.id,
            updatedAt: Date.now(),
          }
          saveUserLocation(loc)
          setToast(`Location set: ${place.displayName}`)
        } catch {
          // GPS mil gaya, geocode fail — still save coords + city from hub
          const loc: UserLocation = {
            lat,
            lng,
            city: hub.city,
            area: '',
            state: hub.state,
            displayName: hub.city,
            nearestHubId: hub.id,
            updatedAt: Date.now(),
          }
          saveUserLocation(loc)
          setToast(`Location set near ${hub.city}`)
        }
      },
      (err) => {
        setLocationStatus('denied')
        setLocationModalOpen(true)
        const msg =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied — allow location in browser settings'
            : err.code === err.TIMEOUT
              ? 'Location timed out — try again'
              : 'Could not get location — try again'
        setToast(msg)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    )
  }, [saveUserLocation])

  // On first open: always ask for real GPS location
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (userLocation) {
      setLocationStatus('ready')
      return
    }

    // Fresh visit — open modal + request GPS immediately
    setLocationModalOpen(true)
    detectLocation()
  }, [userLocation, detectLocation])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setToast('Added to cart')
  }, [])

  const locationLabel =
    locationStatus === 'detecting'
      ? 'Detecting…'
      : userLocation?.displayName || store?.city || 'Set location'

  const locationSubLabel = userLocation
    ? `Nearest: ${STORES.find((s) => s.id === userLocation.nearestHubId)?.name ?? 'Hub'}`
    : store?.name ?? 'Tap to detect'

  const value: StoreContextValue = {
    store,
    setStore,
    userLocation,
    locationStatus,
    locationLabel,
    locationSubLabel,
    locationModalOpen,
    openLocationModal: () => setLocationModalOpen(true),
    closeLocationModal: () => {
      setLocationModalOpen(false)
      // Don't fake Mumbai — keep prompting until real location or manual hub pick
      if (!userLocation && !store) {
        setStore(STORES[0])
      }
    },
    detectLocation,
    cart,
    cartCount,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    addToCart,
    setQty: (id, qty) =>
      setCart((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, qty } : i))
          .filter((i) => i.qty > 0),
      ),
    removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
    clearCart: () => setCart([]),
    wishlist,
    toggleWish: (id) =>
      setWishlist((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    toast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
