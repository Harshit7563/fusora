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
import { fetchMyServerOrders, syncOrderToServer } from '../lib/ordersApi'

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
const AUTH_KEY = 'fusora-auth'
const ACCOUNTS_KEY = 'fusora-accounts'
const ORDERS_KEY = 'fusora-orders'

export type AuthUser = {
  name: string
  email: string
  phone: string
  picture?: string
  provider?: 'local' | 'google'
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type OrderItem = {
  id: string
  name: string
  image: string
  price: number
  qty: number
  selectedSize?: string
  sellerId?: string
}

export type Order = {
  id: string
  userEmail: string
  createdAt: number
  status: OrderStatus
  payment: 'cod' | 'upi' | 'card' | 'netbanking'
  /** Razorpay payment id once verified on the server */
  paymentId?: string
  /** UPI transaction reference submitted by customer */
  utr?: string
  /** UPI payments wait for manual verification */
  paymentPending?: boolean
  total: number
  name: string
  phone: string
  email: string
  address: string
  hub: string
  locationLabel: string
  items: OrderItem[]
}

type StoredAccount = AuthUser & {
  password: string
  googleSub?: string
}

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
  user: AuthUser | null
  isLoggedIn: boolean
  registerAccount: (input: {
    name: string
    email: string
    phone?: string
    password?: string
  }) => { ok: true } | { ok: false; message: string }
  signIn: (input: {
    email: string
    password: string
  }) => { ok: true } | { ok: false; message: string }
  /** Passwordless sign-in after email OTP is verified */
  signInWithEmail: (email: string) =>
    | { ok: true }
    | { ok: false; message: string }
  signInWithGoogle: (input: {
    email: string
    name: string
    picture?: string
    sub?: string
  }) => { ok: true } | { ok: false; message: string }
  signOut: () => void
  orders: Order[]
  placeOrder: (input: {
    name: string
    phone: string
    email: string
    address: string
    payment: 'cod' | 'upi' | 'card' | 'netbanking'
    utr?: string
    paymentId?: string
  }) => Order | null
  getOrder: (id: string) => Order | undefined
  cart: CartItem[]
  cartCount: number
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product, selectedSize?: string) => void
  setQty: (id: string, qty: number, selectedSize?: string) => void
  removeFromCart: (id: string, selectedSize?: string) => void
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

function readSavedAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredAccount[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.length > 10 ? digits.slice(-10) : digits
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Order[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  confirmed: 'Confirmed',
  packing: 'Packing at hub',
  ready: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_TRACK_STEPS: OrderStatus[] = [
  'placed',
  'confirmed',
  'packing',
  'ready',
  'out_for_delivery',
  'delivered',
]

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
  const [user, setUser] = useState<AuthUser | null>(() => readSavedAuth())
  const [orders, setOrders] = useState<Order[]>(() => readOrders())
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

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  // Merge server-side orders for the signed-in user (cross-device history)
  useEffect(() => {
    if (!user) return
    let cancelled = false
    fetchMyServerOrders({ email: user.email, phone: user.phone })
      .then((serverOrders) => {
        if (cancelled || serverOrders.length === 0) return
        setOrders((prev) => {
          const byId = new Map(prev.map((o) => [o.id, o]))
          for (const so of serverOrders) {
            const local = byId.get(so.id)
            byId.set(so.id, {
              ...so,
              userEmail: local?.userEmail || so.email || user.email,
              locationLabel: local?.locationLabel || '',
              // Server status wins — admin may have shipped/delivered it
              status: so.status,
            })
          }
          return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt)
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

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

  // Restore saved location status only — never auto-prompt GPS on open
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    if (userLocation) setLocationStatus('ready')
  }, [userLocation])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])

  const addToCart = useCallback((product: Product, selectedSize?: string) => {
    const sizeKey = selectedSize?.trim() || undefined
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && (i.selectedSize || undefined) === sizeKey,
      )
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && (i.selectedSize || undefined) === sizeKey
            ? { ...i, qty: i.qty + 1 }
            : i,
        )
      }
      return [...prev, { ...product, qty: 1, selectedSize: sizeKey }]
    })
    setToast(
      sizeKey ? `Added · size ${sizeKey}` : 'Added to cart',
    )
  }, [])

  const registerAccount = useCallback(
    (input: {
      name: string
      email: string
      phone?: string
      password?: string
    }): { ok: true } | { ok: false; message: string } => {
      const email = normalizeEmail(input.email)
      const phone = input.phone ? normalizePhone(input.phone) : ''
      const name = input.name.trim()
      const password =
        input.password && input.password.length >= 6
          ? input.password
          : `otp-${crypto.randomUUID()}`
      if (!name || !email) {
        return { ok: false, message: 'Please enter your name and email.' }
      }
      const accounts = readAccounts()
      if (accounts.some((a) => normalizeEmail(a.email) === email)) {
        return { ok: false, message: 'An account with this email already exists. Sign in.' }
      }
      if (
        phone.length === 10 &&
        accounts.some((a) => a.phone && normalizePhone(a.phone) === phone)
      ) {
        return {
          ok: false,
          message: 'An account with this mobile already exists. Sign in.',
        }
      }
      const nextAccount: StoredAccount = {
        name,
        email,
        phone,
        password,
        provider: 'local',
      }
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, nextAccount]))
      const session: AuthUser = { name, email, phone, provider: 'local' }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setUser(session)
      setToast('Account created — you are signed in')
      return { ok: true }
    },
    [],
  )

  const signInWithEmail = useCallback(
    (emailRaw: string): { ok: true } | { ok: false; message: string } => {
      const email = normalizeEmail(emailRaw)
      if (!email) {
        return { ok: false, message: 'Enter your email address.' }
      }
      const accounts = readAccounts()
      const match = accounts.find((a) => normalizeEmail(a.email) === email)
      if (!match) {
        return {
          ok: false,
          message: 'No account found for this email. Create an account first.',
        }
      }
      const session: AuthUser = {
        name: match.name,
        email: match.email,
        phone: match.phone,
        picture: match.picture,
        provider: match.provider || 'local',
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setUser(session)
      setToast(`Signed in as ${session.name.split(' ')[0] || 'member'}`)
      return { ok: true }
    },
    [],
  )

  const signIn = useCallback(
    (input: {
      email: string
      password: string
    }): { ok: true } | { ok: false; message: string } => {
      const email = normalizeEmail(input.email)
      const accounts = readAccounts()
      const match = accounts.find((a) => normalizeEmail(a.email) === email)
      if (!match) {
        return {
          ok: false,
          message: 'No account found. Create an account first.',
        }
      }
      if (match.provider === 'google' && !match.password) {
        return {
          ok: false,
          message: 'This account uses Google Sign-In. Continue with Google.',
        }
      }
      if (match.password !== input.password) {
        return { ok: false, message: 'Incorrect password.' }
      }
      const session: AuthUser = {
        name: match.name,
        email: match.email,
        phone: match.phone,
        picture: match.picture,
        provider: match.provider || 'local',
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setUser(session)
      setToast(`Signed in as ${session.name.split(' ')[0] || 'member'}`)
      return { ok: true }
    },
    [],
  )

  const signInWithGoogle = useCallback(
    (input: {
      email: string
      name: string
      picture?: string
      sub?: string
    }): { ok: true } | { ok: false; message: string } => {
      const email = normalizeEmail(input.email)
      const name = input.name.trim() || email.split('@')[0] || 'Google user'
      if (!email) {
        return { ok: false, message: 'Google account email is required.' }
      }

      const accounts = readAccounts()
      const existing = accounts.find((a) => normalizeEmail(a.email) === email)
      let nextAccounts = accounts

      if (existing) {
        nextAccounts = accounts.map((a) =>
          normalizeEmail(a.email) === email
            ? {
                ...a,
                name: a.name || name,
                picture: input.picture || a.picture,
                provider: a.provider === 'local' ? 'local' : 'google',
                googleSub: input.sub || a.googleSub,
              }
            : a,
        )
      } else {
        nextAccounts = [
          ...accounts,
          {
            name,
            email,
            phone: '',
            password: '',
            picture: input.picture,
            provider: 'google',
            googleSub: input.sub,
          },
        ]
      }

      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts))
      const session: AuthUser = {
        name: existing?.name || name,
        email,
        phone: existing?.phone || '',
        picture: input.picture || existing?.picture,
        provider: existing?.provider === 'local' ? 'local' : 'google',
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setUser(session)
      setToast(`Signed in with Google as ${session.name.split(' ')[0] || 'member'}`)
      return { ok: true }
    },
    [],
  )

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
    setToast('Signed out')
  }, [])

  const locationLabel =
    locationStatus === 'detecting'
      ? 'Detecting…'
      : userLocation?.displayName || store?.city || 'Set location'

  const locationSubLabel = userLocation
    ? `Nearest: ${STORES.find((s) => s.id === userLocation.nearestHubId)?.name ?? 'Hub'}`
    : store?.name ?? 'Tap to detect'

  const placeOrder = useCallback(
    (input: {
      name: string
      phone: string
      email: string
      address: string
      payment: 'cod' | 'upi' | 'card' | 'netbanking'
      utr?: string
      paymentId?: string
    }): Order | null => {
      if (!user || cart.length === 0) return null
      const utr = input.utr?.replace(/\s+/g, '').toUpperCase() || undefined
      const order: Order = {
        id: `FUS${Date.now().toString().slice(-8)}`,
        userEmail: user.email,
        createdAt: Date.now(),
        status: 'placed',
        payment: input.payment,
        paymentId: input.paymentId,
        utr: input.payment === 'upi' ? utr : undefined,
        paymentPending: input.payment === 'upi' && !input.paymentId,
        total: cart.reduce((s, i) => s + i.price * i.qty, 0),
        name: input.name.trim(),
        phone: normalizePhone(input.phone),
        email: normalizeEmail(input.email),
        address: input.address.trim(),
        hub: store?.name ?? 'Fusora hub',
        locationLabel,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          qty: i.qty,
          selectedSize: i.selectedSize,
          sellerId: i.sellerId,
        })),
      }
      setOrders((prev) => [order, ...prev])
      // Server-side store: admin can see it, customer gets it on any device
      syncOrderToServer(order)
      setCart([])
      setToast(
        input.payment === 'upi'
          ? `Order ${order.id} received · UTR under verification`
          : `Order ${order.id} placed`,
      )
      return order
    },
    [user, cart, store, locationLabel],
  )

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  )

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
    user,
    isLoggedIn: Boolean(user),
    registerAccount,
    signIn,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    orders,
    placeOrder,
    getOrder,
    cart,
    cartCount,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    addToCart,
    setQty: (id, qty, selectedSize) =>
      setCart((prev) =>
        prev
          .map((i) =>
            i.id === id && (i.selectedSize || undefined) === (selectedSize || undefined)
              ? { ...i, qty }
              : i,
          )
          .filter((i) => i.qty > 0),
      ),
    removeFromCart: (id, selectedSize) =>
      setCart((prev) =>
        prev.filter(
          (i) =>
            !(
              i.id === id &&
              (i.selectedSize || undefined) === (selectedSize || undefined)
            ),
        ),
      ),
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
