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
  { label: 'Sale', to: '/deals', hot: true },
  { label: 'Our Story', to: '/about' },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, openCart, wishlist, isLoggedIn, signOut } = useStore()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = location.pathname === '/'
  const overHero = isHome && !scrolled && !menuOpen && !searchOpen

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
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
  const ink = overHero ? 'text-white' : 'text-[#1a1a1a]'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero
          ? 'bg-transparent'
          : 'border-b border-[#e8e0d8] bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 sm:px-6 sm:py-3.5 lg:px-10">
        <div className={`flex items-center gap-3 sm:gap-5 ${ink}`}>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.16em] uppercase transition hover:opacity-70"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v)
              setSearchOpen(false)
            }}
          >
            {menuOpen ? (
              <X className="size-4" strokeWidth={1.5} />
            ) : (
              <Menu className="size-4" strokeWidth={1.5} />
            )}
            <span className="hidden sm:inline">Menu</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.16em] uppercase transition hover:opacity-70"
            aria-label="Search"
            onClick={() => {
              setSearchOpen((v) => !v)
              setMenuOpen(false)
            }}
          >
            <Search className="size-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="justify-self-center">
          <FusoraLogo compact onDark={overHero} centered />
        </div>

        <div className={`flex items-center justify-end gap-1 sm:gap-2 ${ink}`}>
          <Link
            to="/account"
            className="hidden size-10 place-items-center transition hover:opacity-70 sm:grid"
            aria-label="Account"
          >
            <User className="size-[1.15rem]" strokeWidth={1.4} />
          </Link>
          <Link
            to="/wishlist"
            className="relative grid size-10 place-items-center transition hover:opacity-70"
            aria-label="Wishlist"
          >
            <Heart className="size-[1.15rem]" strokeWidth={1.4} />
            {wishlist.size > 0 && (
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#e8c84a]" />
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-10 place-items-center transition hover:opacity-70"
            aria-label="Cart"
          >
            <ShoppingBag className="size-[1.15rem]" strokeWidth={1.4} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 grid min-w-[1rem] place-items-center rounded-full bg-[#5c2a2a] px-1 text-[0.55rem] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#e8e0d8] bg-white px-3 py-3 sm:px-6">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-xl overflow-hidden rounded-full border border-[#e8e0d8] bg-[#f7f5f3]"
          >
            <Search
              className="ml-4 size-4 shrink-0 self-center text-[#776865]"
              strokeWidth={1.5}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, jeans, jewellery…"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#5c2a2a] px-5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl safe-pb">
            <div className="flex items-center justify-between border-b border-[#e8e0d8] px-4 py-3">
              <FusoraLogo compact />
              <button
                type="button"
                onClick={closeMenu}
                className="grid size-10 place-items-center"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-[#e8e0d8] px-4 py-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="rounded-md bg-[#5c2a2a] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                  >
                    My account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      closeMenu()
                    }}
                    className="rounded-md border border-[#e8e0d8] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="rounded-md bg-[#5c2a2a] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-md border border-[#e8e0d8] px-4 py-2.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <ul className="flex-1 overflow-y-auto px-2 py-2">
              {primaryNav.map((item) => (
                <li key={item.to + item.label}>
                  <Link
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-3 py-3.5 text-sm font-medium tracking-[0.08em] text-[#1a1a1a] uppercase transition active:bg-[#f7f5f3]"
                  >
                    {item.label}
                    {item.hot && (
                      <span className="rounded bg-[#5c2a2a] px-1.5 py-0.5 text-[0.55rem] font-bold tracking-wide text-[#e8c84a]">
                        HOT
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.08em] uppercase"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  onClick={closeMenu}
                  className="block px-3 py-3.5 text-sm font-medium tracking-[0.08em] uppercase"
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
