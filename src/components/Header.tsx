import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const { cartCount, openCart, wishlist } = useStore()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/deals')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-bb-blue text-center">
        <p className="px-3 py-2 text-[0.65rem] font-medium tracking-[0.16em] text-white uppercase sm:text-[0.7rem]">
          Free shipping above ₹2,999 · Easy returns · COD available
        </p>
      </div>

      <div className="border-b border-bb-border bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3.5 sm:px-5 sm:py-4 lg:px-8">
          <div className="flex items-center justify-start gap-0.5">
            <button
              type="button"
              className="grid size-10 place-items-center text-bb-text transition hover:opacity-70"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((v) => !v)
                setSearchOpen(false)
              }}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.5} />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} />
              )}
            </button>
            <Link
              to="/account"
              className="grid size-10 place-items-center text-bb-text transition hover:opacity-70"
              aria-label="Account"
            >
              <User className="size-[1.1rem]" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="min-w-0 justify-self-center px-1">
            <FusoraLogo centered compact />
          </div>

          <div className="flex items-center justify-end gap-1">
            <form
              onSubmit={onSearch}
              className="mr-1 hidden max-w-[220px] items-center border border-bb-border bg-[#f5f5f5] px-3 py-2 lg:flex"
            >
              <Search className="size-3.5 shrink-0 text-bb-muted" strokeWidth={1.5} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you looking for"
                className="min-w-0 flex-1 bg-transparent px-2 text-[0.72rem] text-bb-text outline-none placeholder:text-bb-muted"
              />
            </form>
            <button
              type="button"
              className="grid size-10 place-items-center text-bb-text transition hover:opacity-70 lg:hidden"
              aria-label="Search"
              onClick={() => {
                setSearchOpen((v) => !v)
                setMenuOpen(false)
              }}
            >
              <Search className="size-[1.1rem]" strokeWidth={1.5} />
            </button>
            <Link
              to="/wishlist"
              className="relative grid size-10 place-items-center text-bb-text transition hover:opacity-70"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.1rem]" strokeWidth={1.5} />
              {wishlist.size > 0 && (
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-bb-blue" />
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center text-bb-text transition hover:opacity-70"
              aria-label="Cart"
            >
              <ShoppingBag className="size-[1.1rem]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 grid min-w-[1rem] place-items-center rounded-full bg-bb-blue px-1 text-[0.55rem] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-bb-border bg-white lg:block">
          <ul className="mx-auto flex max-w-[1400px] items-center justify-center gap-8 px-4 py-3 lg:px-8">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="nav-link text-[0.72rem] font-medium tracking-[0.14em] text-bb-text uppercase transition hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {searchOpen && (
        <div className="border-b border-bb-border bg-white px-3 py-3 sm:px-5 lg:hidden">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-xl border border-bb-border bg-[#f5f5f5]"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What are you looking for"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
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
        <div className="border-b border-bb-border bg-white px-3 py-3 safe-pb sm:px-5 lg:px-8">
          <ul className="mx-auto grid max-h-[min(70svh,32rem)] max-w-[1400px] gap-0 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition hover:bg-[#f5f5f5]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition hover:bg-[#f5f5f5]"
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition hover:bg-[#f5f5f5]"
              >
                My orders
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition hover:bg-[#f5f5f5]"
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
