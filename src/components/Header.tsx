import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { FusoraLogo } from './FusoraLogo'

const offers = [
  'Free shipping on orders above ₹999',
  'Extra 5% off on prepaid orders · Pay via Razorpay',
  'Easy 7-day returns · COD available above ₹2,000',
]

const nav = [
  { label: 'Men', to: '/category/men' },
  { label: 'Women', to: '/category/women' },
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Dresses', to: '/category/women/dresses' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
  { label: 'New In', to: '/deals' },
  { label: 'Sale', to: '/deals', hot: true },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, openCart, wishlist, isLoggedIn, signOut } = useStore()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [offerIdx, setOfferIdx] = useState(0)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const id = window.setInterval(
      () => setOfferIdx((i) => (i + 1) % offers.length),
      4000,
    )
    return () => window.clearInterval(id)
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
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      {/* Offer bar */}
      <div className="bg-[#141414] text-center">
        <p
          key={offerIdx}
          className="truncate px-3 py-2 text-[0.7rem] font-semibold tracking-[0.14em] text-white uppercase sm:text-xs"
        >
          {offers[offerIdx]}
        </p>
      </div>

      {/* Main bar */}
      <div className="bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-3 sm:h-[4.5rem] sm:px-5">
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" strokeWidth={2} />
          </button>

          <FusoraLogo compact className="shrink-0" />

          <form
            onSubmit={onSearch}
            className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-full bg-[#f2f2f2] px-4 py-2.5 transition focus-within:bg-white focus-within:ring-1 focus-within:ring-[#cf2028] md:flex"
          >
            <Search className="size-4 shrink-0 text-[#6a6667]" strokeWidth={2.2} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for tees, sarees, dresses & more"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#96938b]"
            />
          </form>

          <div className="ml-auto flex items-start gap-3 sm:gap-5 md:ml-0">
            <button
              type="button"
              className="grid size-9 place-items-center md:hidden"
              aria-label="Search"
              onClick={() => navigate('/deals')}
            >
              <Search className="size-[1.15rem]" strokeWidth={2} />
            </button>
            <Link
              to="/account"
              className="hidden flex-col items-center gap-0.5 text-[#070001] transition hover:text-[#cf2028] sm:flex"
              aria-label="Account"
            >
              <User className="size-[1.3rem]" strokeWidth={1.8} />
              <span className="text-[0.6rem] font-semibold tracking-wide uppercase">
                {isLoggedIn ? 'Account' : 'Login'}
              </span>
            </Link>
            <Link
              to="/wishlist"
              className="relative flex flex-col items-center gap-0.5 text-[#070001] transition hover:text-[#cf2028]"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.3rem]" strokeWidth={1.8} />
              <span className="hidden text-[0.6rem] font-semibold tracking-wide uppercase sm:block">
                Wishlist
              </span>
              {wishlist.size > 0 && (
                <span className="absolute -top-1.5 right-0 flex min-w-4 items-center justify-center rounded-full bg-[#cf2028] px-1 text-[0.55rem] font-bold text-white">
                  {wishlist.size}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex flex-col items-center gap-0.5 text-[#070001] transition hover:text-[#cf2028]"
              aria-label="Cart"
            >
              <ShoppingBag className="size-[1.3rem]" strokeWidth={1.8} />
              <span className="hidden text-[0.6rem] font-semibold tracking-wide uppercase sm:block">
                Cart
              </span>
              <span className="absolute -top-1.5 right-0 flex min-w-4 items-center justify-center rounded-full bg-[#cf2028] px-1 text-[0.55rem] font-bold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className="border-t border-[#f0ecec] bg-white">
        <div className="hide-scrollbar mx-auto flex max-w-[1280px] items-center gap-6 overflow-x-auto px-3 py-2.5 sm:px-5 lg:justify-center lg:gap-9">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`text-[0.8rem] font-bold tracking-[0.08em] whitespace-nowrap uppercase transition hover:text-[#cf2028] ${
                item.hot ? 'text-[#cf2028]' : 'text-[#262626]'
              } ${
                location.pathname === item.to
                  ? 'underline decoration-[#cf2028] decoration-2 underline-offset-4'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
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
            <div className="flex h-14 items-center justify-between border-b border-[#eee] px-4">
              <FusoraLogo compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex gap-2 border-b border-[#eee] px-4 py-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#cf2028] px-4 py-2 font-heading text-[0.95rem] tracking-wide text-white"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="border border-[#d9d9d9] px-4 py-2 font-heading text-[0.95rem] tracking-wide"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#cf2028] px-4 py-2 font-heading text-[0.95rem] tracking-wide text-white"
                >
                  Log in
                </Link>
              )}
            </div>
            <ul className="flex-1 overflow-y-auto py-2">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-5 py-3.5 text-sm font-bold tracking-[0.08em] uppercase ${
                      item.hot ? 'text-[#cf2028]' : 'text-[#262626]'
                    }`}
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
