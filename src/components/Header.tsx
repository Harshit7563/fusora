import {
  ChevronDown,
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

const leftNav = [
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Women', to: '/category/women' },
  { label: 'Men', to: '/category/men' },
]

const rightNav = [
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'Sale', to: '/deals' },
]

const mobileNav = [...leftNav, ...rightNav, { label: 'New In', to: '/deals' }]

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
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/deals')
    setSearchOpen(false)
  }

  const ink = overHero ? 'text-white' : 'text-[#121212]'
  const barBg = overHero
    ? 'bg-transparent'
    : 'border-b border-[#e5ddd6] bg-white'

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${barBg}`}>
      {/* Announcement — Kankatala style */}
      <div className="bg-[#6b161d] text-center">
        <p className="truncate px-3 py-1.5 text-[0.68rem] tracking-wide text-white sm:text-[0.72rem]">
          Free Shipping within India*
        </p>
      </div>

      <div
        className={`mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:h-[3.75rem] sm:px-6 lg:px-8 ${ink}`}
      >
        {/* Mobile menu */}
        <button
          type="button"
          className="grid size-9 place-items-center lg:hidden"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" strokeWidth={1.4} />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[0.7rem] tracking-wide"
            aria-label="Currency"
          >
            <span className="text-base leading-none">🇮🇳</span>
            INR
            <ChevronDown className="size-3.5 opacity-70" strokeWidth={1.5} />
          </button>
          <Link to="/wishlist" className="relative grid size-9 place-items-center" aria-label="Wishlist">
            <Heart className="size-[1.15rem]" strokeWidth={1.35} />
            {wishlist.size > 0 && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#d48c45]" />
            )}
          </Link>
        </div>

        {/* Desktop nav + logo */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-5 lg:gap-7">
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {leftNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-0.5 text-[0.78rem] tracking-wide transition hover:opacity-70"
              >
                {item.label}
                <ChevronDown className="size-3 opacity-60" strokeWidth={1.5} />
              </Link>
            ))}
          </nav>

          <FusoraLogo compact onDark={overHero} centered />

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {rightNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-0.5 text-[0.78rem] tracking-wide transition hover:opacity-70"
              >
                {item.label}
                <ChevronDown className="size-3 opacity-60" strokeWidth={1.5} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            className="grid size-9 place-items-center"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="size-[1.15rem]" strokeWidth={1.35} />
          </button>
          <Link
            to="/account"
            className="hidden size-9 place-items-center sm:grid"
            aria-label="Account"
          >
            <User className="size-[1.15rem]" strokeWidth={1.35} />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-9 place-items-center"
            aria-label="Cart"
          >
            <ShoppingBag className="size-[1.15rem]" strokeWidth={1.35} />
            <span className="absolute top-1 right-0.5 text-[0.6rem] font-medium">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#e5ddd6] bg-white px-3 py-3 sm:px-6">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-xl border border-[#e5ddd6]"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, jeans, jewellery…"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-[#121212] outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#6b161d] px-5 text-[0.68rem] font-medium tracking-[0.14em] text-white uppercase"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,19rem)] flex-col bg-white safe-pb">
            <div className="flex h-14 items-center justify-between border-b border-[#e5ddd6] px-4">
              <FusoraLogo compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center"
              >
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <div className="flex gap-2 border-b border-[#e5ddd6] px-4 py-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#6b161d] px-4 py-2 text-[0.68rem] tracking-wide text-white uppercase"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="border border-[#e5ddd6] px-4 py-2 text-[0.68rem] tracking-wide uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#6b161d] px-4 py-2 text-[0.68rem] tracking-wide text-white uppercase"
                >
                  Log in
                </Link>
              )}
            </div>
            <ul className="flex-1 overflow-y-auto py-2">
              {mobileNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3.5 text-sm tracking-wide"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="block px-5 py-3.5 text-sm tracking-wide"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
