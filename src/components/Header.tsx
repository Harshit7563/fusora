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
  { label: 'Men', to: '/category/men' },
  { label: 'Women', to: '/category/women' },
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'New In', to: '/deals' },
  { label: 'Our Story', to: '/about' },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, openCart, wishlist, isLoggedIn, signOut } = useStore()
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
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const prev = document.body.style.overflow
    if (!isDesktop) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/deals')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-bb-blue text-center">
        <p className="truncate px-2 py-1.5 text-[0.6rem] font-medium tracking-[0.12em] text-white uppercase sm:px-3 sm:py-2 sm:text-[0.7rem] sm:tracking-[0.16em]">
          Free shipping above ₹2,999 · Easy returns · COD
        </p>
      </div>

      <div className="border-b border-bb-border bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-1 px-2 py-2.5 sm:grid-cols-[1fr_auto_1fr] sm:gap-2 sm:px-5 sm:py-4 lg:px-8">
          <div className="flex items-center justify-start">
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
              className="hidden size-10 place-items-center text-bb-text transition hover:opacity-70 sm:grid"
              aria-label="Account"
            >
              <User className="size-[1.1rem]" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="min-w-0 justify-self-center px-1">
            <FusoraLogo centered compact />
          </div>

          <div className="flex items-center justify-end gap-0 sm:gap-1">
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
          <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 lg:px-8">
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
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none sm:px-4"
              autoFocus
            />
            <button
              type="submit"
              className="bg-bb-blue px-4 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase sm:px-5 sm:text-xs"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,19.5rem)] flex-col bg-white shadow-xl safe-pb">
            <div className="flex items-center justify-between border-b border-bb-border px-4 py-3">
              <p className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
                Menu
              </p>
              <button
                type="button"
                onClick={closeMenu}
                className="grid size-10 place-items-center"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-bb-border px-4 py-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="bg-[#323232] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                  >
                    My account
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="border border-bb-border px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      closeMenu()
                    }}
                    className="border border-bb-border px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="bg-[#323232] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="border border-bb-border px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <ul className="flex-1 overflow-y-auto px-2 py-2">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={closeMenu}
                    className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition active:bg-[#f5f5f5]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition active:bg-[#f5f5f5]"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  onClick={closeMenu}
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition active:bg-[#f5f5f5]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Desktop dropdown menu */}
      {menuOpen && (
        <div className="hidden border-b border-bb-border bg-white px-3 py-3 sm:px-5 lg:block lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-2 flex flex-wrap gap-2 border-b border-bb-border pb-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="bg-[#323232] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                  >
                    My account
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="border border-bb-border px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      closeMenu()
                    }}
                    className="border border-bb-border px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="bg-[#323232] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="border border-bb-border px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <ul className="grid max-h-[min(70svh,32rem)] gap-0 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={closeMenu}
                    className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition hover:bg-[#f5f5f5]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/support"
                  onClick={closeMenu}
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.1em] text-bb-text uppercase transition hover:bg-[#f5f5f5]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
