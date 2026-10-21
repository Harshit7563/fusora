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

      {/* Main bar - menu left, logo center, actions right */}
      <div className="relative bg-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-3 sm:h-[4.5rem] sm:px-5">
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center xl:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" strokeWidth={2} />
          </button>

          {/* Left menu (desktop) */}
          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`pb-1 text-[0.82rem] font-bold tracking-[0.06em] whitespace-nowrap uppercase transition hover:text-[#cf2028] text-[#262626] ${
                  location.pathname === item.to
                    ? 'border-b-2 border-[#141414]'
                    : 'border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo - centered on desktop */}
          <div className="xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
            <FusoraLogo compact className="shrink-0" />
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
            <form
              onSubmit={onSearch}
              className="hidden w-56 items-center gap-2 rounded-full border border-[#d9d9d9] bg-white px-4 py-2 transition focus-within:border-[#cf2028] lg:flex 2xl:w-72"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#96938b]"
              />
              <button type="submit" aria-label="Search" className="shrink-0">
                <Search className="size-4 text-[#262626]" strokeWidth={2.2} />
              </button>
            </form>
            <button
              type="button"
              className="grid size-9 place-items-center lg:hidden"
              aria-label="Search"
              onClick={() => navigate('/deals')}
            >
              <Search className="size-[1.25rem]" strokeWidth={1.9} />
            </button>
            <Link
              to="/account"
              className="relative hidden size-9 place-items-center text-[#141414] transition hover:text-[#cf2028] sm:grid"
              aria-label="Account"
            >
              <User className="size-[1.35rem]" strokeWidth={1.7} />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid size-9 place-items-center text-[#141414] transition hover:text-[#cf2028]"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.35rem]" strokeWidth={1.7} />
              {wishlist.size > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-[#cf2028] px-1 text-[0.55rem] font-bold text-white">
                  {wishlist.size}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-9 place-items-center text-[#141414] transition hover:text-[#cf2028]"
              aria-label="Cart"
            >
              <ShoppingBag className="size-[1.35rem]" strokeWidth={1.7} />
              <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-[#cf2028] px-1 text-[0.55rem] font-bold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Category strip (mobile / tablet) */}
        <nav className="border-t border-[#f0ecec] bg-white xl:hidden">
          <div className="hide-scrollbar flex items-center gap-6 overflow-x-auto px-3 py-2.5 sm:px-5">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-[0.8rem] font-bold tracking-[0.08em] whitespace-nowrap uppercase text-[#262626]`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
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
                    className="block px-5 py-3.5 text-sm font-bold tracking-[0.08em] uppercase text-[#262626]"
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
