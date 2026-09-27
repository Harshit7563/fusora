import {
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { FusoraLogo } from './FusoraLogo'

const primaryNav = [
  { label: 'Shop', to: '/deals' },
  { label: 'Apparel & Clothes', to: '/category/apparel-accessories' },
  { label: 'Luggage', to: '/category/luggage-bags-cases' },
  {
    label: 'Artificial Jewellery',
    to: '/category/jewelry-eyewear-watches',
  },
  { label: 'Memberships', to: '/memberships' },
  { label: 'Our Story', to: '/about' },
  { label: 'Reach Us', to: '/support' },
]

export function Header() {
  const navigate = useNavigate()
  const {
    cart,
    cartCount,
    openCart,
    wishlist,
    locationLabel,
    openLocationModal,
  } = useStore()
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/deals')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-bb-blue text-[#f7f3ec]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-1 px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3.5 lg:px-8">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full hover:bg-white/10 sm:size-10 lg:hidden"
              aria-label="Menu"
              onClick={() => {
                setMenuOpen((v) => !v)
                setSearchOpen(false)
              }}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <button
              type="button"
              className="hidden size-10 place-items-center rounded-full hover:bg-white/10 sm:grid lg:grid"
              aria-label="Search"
              onClick={() => {
                setSearchOpen((v) => !v)
                setMenuOpen(false)
              }}
            >
              <Search className="size-5" />
            </button>
          </div>

          <div className="min-w-0 justify-self-center px-1">
            <FusoraLogo onDark centered />
          </div>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full hover:bg-white/10 sm:hidden"
              aria-label="Search"
              onClick={() => {
                setSearchOpen((v) => !v)
                setMenuOpen(false)
              }}
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={openLocationModal}
              className="hidden items-center gap-1.5 rounded-full px-2 py-2 text-xs tracking-wide uppercase hover:bg-white/10 md:inline-flex"
              title={locationLabel}
            >
              <MapPin className="size-4 opacity-80" />
              <span className="max-w-[9rem] truncate">{locationLabel}</span>
            </button>
            <Link
              to="/account"
              className="hidden size-10 place-items-center rounded-full hover:bg-white/10 sm:grid"
              aria-label="Account"
            >
              <User className="size-5" />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid size-9 place-items-center rounded-full hover:bg-white/10 sm:size-10"
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              {wishlist.size > 0 && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#e8dfd0]" />
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center gap-1.5 rounded-full px-1.5 py-2 hover:bg-white/10 sm:px-3"
              aria-label="Cart"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 grid min-w-4 place-items-center rounded-full bg-[#e8dfd0] px-1 text-[0.6rem] font-bold text-bb-text sm:hidden">
                  {cartCount}
                </span>
              )}
              <span className="hidden text-xs tracking-wide sm:inline">
                {cartCount} · ₹{Math.round(cartTotal).toLocaleString('en-IN')}
              </span>
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-white/10 lg:block">
          <ul className="mx-auto flex max-w-[1400px] items-center justify-center gap-1 px-4 py-2.5 lg:px-8">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="rounded-full px-3.5 py-2 text-[0.72rem] font-medium tracking-[0.14em] text-[#f7f3ec]/90 uppercase transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {searchOpen && (
        <div className="border-b border-bb-border bg-fusora-ivory px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-xl overflow-hidden rounded-full border border-bb-border bg-white"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Fusora…"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none sm:px-5"
              autoFocus
            />
            <button
              type="submit"
              className="bg-bb-blue px-4 text-xs font-semibold tracking-wide text-[#f7f3ec] uppercase sm:px-5 sm:text-sm"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="max-h-[70svh] overflow-y-auto border-b border-bb-border bg-fusora-ivory px-3 py-3 safe-pb lg:hidden">
          <ul className="space-y-0.5">
            <li>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium tracking-wide text-bb-text uppercase"
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium tracking-wide text-bb-text uppercase"
              >
                My orders
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openLocationModal()
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium tracking-wide text-bb-text uppercase"
              >
                <MapPin className="size-4" />
                Location · {locationLabel}
              </button>
            </li>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium tracking-wide text-bb-text uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
