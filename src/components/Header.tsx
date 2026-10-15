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

const nav = [
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Women', to: '/category/women' },
  { label: 'Men', to: '/category/men' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'New Arrivals', to: '/deals' },
  { label: 'Sale', to: '/deals' },
  { label: 'Our Story', to: '/about' },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, openCart, wishlist, isLoggedIn, signOut } = useStore()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
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
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      {/* Promo bar — Taneira */}
      <div className="bg-[#6d1f2c] text-center">
        <p className="truncate px-3 py-2 text-[0.72rem] tracking-wide text-white sm:text-[0.78rem]">
          Free shipping within India · Fresh weaves, added daily
        </p>
      </div>

      {/* Logo + search + icons */}
      <div className="border-b border-[#e8e1d8]">
        <div className="mx-auto flex h-[3.75rem] max-w-[1280px] items-center gap-3 px-3 sm:h-16 sm:gap-5 sm:px-5 lg:px-8">
          <button
            type="button"
            className="grid size-9 place-items-center text-[#1c1c1c] lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>

          <FusoraLogo compact className="shrink-0" />

          <form
            onSubmit={onSearch}
            className="mx-auto hidden min-w-0 flex-1 max-w-xl items-center rounded-full bg-[#f3efe8] px-4 py-2.5 lg:flex"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for festive sarees"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#1c1c1c] outline-none placeholder:text-[#8a847c]"
            />
            <button type="submit" aria-label="Search" className="text-[#6d1f2c]">
              <Search className="size-[1.15rem]" strokeWidth={1.6} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              className="grid size-9 place-items-center text-[#1c1c1c] lg:hidden"
              aria-label="Search"
              onClick={() => navigate('/deals')}
            >
              <Search className="size-[1.15rem]" strokeWidth={1.5} />
            </button>
            <Link
              to="/account"
              className="grid size-9 place-items-center text-[#1c1c1c]"
              aria-label="Account"
            >
              <User className="size-[1.15rem]" strokeWidth={1.5} />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid size-9 place-items-center text-[#1c1c1c]"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.15rem]" strokeWidth={1.5} />
              <span className="absolute top-0.5 right-0.5 flex min-w-3.5 items-center justify-center rounded-full bg-[#6d1f2c] px-0.5 text-[0.55rem] font-semibold text-white">
                {wishlist.size}
              </span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-9 place-items-center text-[#1c1c1c]"
              aria-label="Cart"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
              <span className="absolute top-0.5 right-0.5 flex min-w-3.5 items-center justify-center rounded-full bg-[#6d1f2c] px-0.5 text-[0.55rem] font-semibold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav — Taneira */}
      <nav className="hidden border-b border-[#e8e1d8] lg:block">
        <ul className="mx-auto flex max-w-[1280px] items-center justify-center gap-6 px-4 py-3 xl:gap-8">
          {nav.map((item) => (
            <li key={item.to + item.label}>
              <Link
                to={item.to}
                className="text-[0.82rem] font-medium tracking-wide text-[#1c1c1c] transition hover:text-[#6d1f2c]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,19rem)] flex-col bg-white safe-pb">
            <div className="flex h-14 items-center justify-between border-b border-[#e8e1d8] px-4">
              <FusoraLogo compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center"
              >
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                onSearch(e)
                setMenuOpen(false)
              }}
              className="mx-3 mt-3 flex items-center rounded-full bg-[#f3efe8] px-3 py-2.5"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sarees…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <Search className="size-4 text-[#6d1f2c]" strokeWidth={1.6} />
            </form>
            <div className="mt-3 flex gap-2 border-b border-[#e8e1d8] px-4 pb-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-[#6d1f2c] px-4 py-2 text-[0.68rem] tracking-wide text-white uppercase"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="rounded-full border border-[#e8e1d8] px-4 py-2 text-[0.68rem] tracking-wide uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-[#6d1f2c] px-4 py-2 text-[0.68rem] tracking-wide text-white uppercase"
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
                    className="block px-5 py-3.5 text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
