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

const nav = [
  { label: 'New Arrivals', to: '/deals' },
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Women', to: '/category/women' },
  { label: 'Men', to: '/category/men' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'Sale', to: '/deals' },
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ebe6df] bg-white">
      <div className="bg-[#8b1538] text-center">
        <p className="truncate px-3 py-1.5 text-[0.68rem] tracking-wide text-white sm:text-[0.72rem]">
          Free shipping within India · Fresh weaves, added daily
        </p>
      </div>

      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-3 sm:h-16 sm:px-5 lg:px-8">
        <button
          type="button"
          className="grid size-9 place-items-center text-[#1a1a1a] lg:hidden"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" strokeWidth={1.4} />
        </button>

        <FusoraLogo compact className="shrink-0" />

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:gap-5 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to + item.label}
              to={item.to}
              className="whitespace-nowrap text-[0.68rem] font-medium tracking-[0.12em] text-[#1a1a1a] uppercase transition hover:text-[#8b1538]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            className="hidden items-center gap-1.5 px-1 text-[0.7rem] tracking-wide text-[#1a1a1a] lg:flex"
            aria-label="Currency"
          >
            <span className="text-base leading-none">🇮🇳</span>
            INR
            <ChevronDown className="size-3.5 opacity-60" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center text-[#1a1a1a]"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="size-[1.15rem]" strokeWidth={1.35} />
          </button>
          <Link
            to="/account"
            className="hidden size-9 place-items-center text-[#1a1a1a] sm:grid"
            aria-label="Account"
          >
            <User className="size-[1.15rem]" strokeWidth={1.35} />
          </Link>
          <Link
            to="/wishlist"
            className="relative grid size-9 place-items-center text-[#1a1a1a]"
            aria-label="Wishlist"
          >
            <Heart className="size-[1.15rem]" strokeWidth={1.35} />
            {wishlist.size > 0 && (
              <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-[#8b1538] text-[0.55rem] font-medium text-white">
                {wishlist.size > 9 ? '9+' : wishlist.size}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-9 place-items-center text-[#1a1a1a]"
            aria-label="Cart"
          >
            <ShoppingBag className="size-[1.15rem]" strokeWidth={1.35} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#8b1538] text-[0.55rem] font-medium text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#ebe6df] bg-white px-3 py-3 sm:px-6">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-xl overflow-hidden rounded-md border border-[#ebe6df]"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, jeans, jewellery…"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-[#1a1a1a] outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#8b1538] px-5 text-[0.68rem] font-medium tracking-[0.14em] text-white uppercase"
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
            <div className="flex h-14 items-center justify-between border-b border-[#ebe6df] px-4">
              <FusoraLogo compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center"
              >
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <div className="flex gap-2 border-b border-[#ebe6df] px-4 py-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md bg-[#8b1538] px-4 py-2 text-[0.68rem] tracking-wide text-white uppercase"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="rounded-md border border-[#ebe6df] px-4 py-2 text-[0.68rem] tracking-wide uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-[#8b1538] px-4 py-2 text-[0.68rem] tracking-wide text-white uppercase"
                >
                  Log in
                </Link>
              )}
            </div>
            <ul className="flex-1 overflow-y-auto py-2">
              {nav.map((item) => (
                <li key={item.to + item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3.5 text-sm tracking-[0.08em] uppercase"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="block px-5 py-3.5 text-sm tracking-[0.08em] uppercase"
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
