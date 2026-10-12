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
  { label: 'Sarees', to: '/category/apparel-accessories/sarees' },
  { label: 'Jeans', to: '/category/apparel-accessories/jeans' },
  { label: 'Apparel', to: '/category/apparel-accessories' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'Luggage', to: '/category/luggage-bags-cases' },
  { label: 'New In', to: '/deals' },
  { label: 'Our Story', to: '/about' },
]

export function Header() {
  const navigate = useNavigate()
  const {
    cartCount,
    openCart,
    wishlist,
    locationLabel,
    openLocationModal,
  } = useStore()
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
    <header className="sticky top-0 z-50 bg-fusora-ivory">
      <div className="bg-bb-blue text-center">
        <p className="px-3 py-2.5 text-[0.68rem] font-medium tracking-[0.18em] text-[#fbf7f2] uppercase sm:text-[0.72rem]">
          Festive edit live · Free shipping above ₹2,999 · COD available
        </p>
      </div>

      <div className="border-b border-bb-border bg-fusora-ivory">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3.5 sm:px-5 sm:py-4 lg:px-8">
          <div className="flex items-center justify-start gap-0.5">
            <button
              type="button"
              className="grid size-10 place-items-center text-bb-text transition hover:text-bb-blue lg:hidden"
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
              className="hidden size-10 place-items-center text-bb-text transition hover:text-bb-blue sm:grid"
              aria-label="Search"
              onClick={() => {
                setSearchOpen((v) => !v)
                setMenuOpen(false)
              }}
            >
              <Search className="size-[1.15rem]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="min-w-0 justify-self-center px-1">
            <FusoraLogo centered />
          </div>

          <div className="flex items-center justify-end gap-0.5">
            <button
              type="button"
              className="grid size-10 place-items-center text-bb-text transition hover:text-bb-blue sm:hidden"
              aria-label="Search"
              onClick={() => {
                setSearchOpen((v) => !v)
                setMenuOpen(false)
              }}
            >
              <Search className="size-[1.15rem]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={openLocationModal}
              className="hidden items-center gap-1.5 px-2 py-2 text-[0.7rem] tracking-[0.1em] text-bb-muted uppercase transition hover:text-bb-blue md:inline-flex"
              title={locationLabel}
            >
              <MapPin className="size-3.5" strokeWidth={1.5} />
              <span className="max-w-[8rem] truncate">{locationLabel}</span>
            </button>
            <Link
              to="/account"
              className="hidden size-10 place-items-center text-bb-text transition hover:text-bb-blue sm:grid"
              aria-label="Account"
            >
              <User className="size-[1.15rem]" strokeWidth={1.5} />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid size-10 place-items-center text-bb-text transition hover:text-bb-blue"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.15rem]" strokeWidth={1.5} />
              {wishlist.size > 0 && (
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-bb-blue" />
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center text-bb-text transition hover:text-bb-blue"
              aria-label="Cart"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 grid min-w-[1rem] place-items-center rounded-full bg-bb-blue px-1 text-[0.55rem] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-bb-border/80 lg:block">
          <ul className="mx-auto flex max-w-[1440px] items-center justify-center gap-7 px-4 py-3.5 lg:px-8">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="nav-link text-[0.75rem] font-medium tracking-[0.16em] text-bb-text uppercase transition hover:text-bb-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {searchOpen && (
        <div className="border-b border-bb-border bg-white px-3 py-4 sm:px-5 lg:px-8">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-xl overflow-hidden border border-bb-border bg-fusora-ivory"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, jeans, jewellery…"
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none sm:px-5"
              autoFocus
            />
            <button
              type="submit"
              className="bg-bb-blue px-5 text-xs font-semibold tracking-[0.14em] text-white uppercase"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="max-h-[70svh] overflow-y-auto border-b border-bb-border bg-white px-3 py-4 safe-pb lg:hidden">
          <ul className="space-y-0.5">
            <li>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3.5 text-sm font-medium tracking-[0.12em] text-bb-text uppercase"
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3.5 text-sm font-medium tracking-[0.12em] text-bb-text uppercase"
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
                className="flex w-full items-center gap-2 px-3 py-3.5 text-left text-sm font-medium tracking-[0.12em] text-bb-text uppercase"
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
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.12em] text-bb-text uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/support"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3.5 text-sm font-medium tracking-[0.12em] text-bb-text uppercase"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
