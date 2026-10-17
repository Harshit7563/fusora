import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { FusoraLogo } from './FusoraLogo'

const nav = [
  { label: 'Shop All', to: '/deals' },
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Women', to: '/category/women' },
  { label: 'Men', to: '/category/men' },
  { label: 'T-shirts', to: '/category/men/tshirts' },
  { label: 'Shirts', to: '/category/men/shirts' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
]

const chips = [
  { label: 'New Arrivals', to: '/deals' },
  { label: 'Bestsellers', to: '/deals' },
  { label: 'Sale', to: '/deals' },
  { label: 'Sarees', to: '/category/women/sarees' },
  { label: 'Women', to: '/category/women' },
  { label: 'Men', to: '/category/men' },
  { label: 'Jeans', to: '/category/men/jeans' },
  { label: 'Jewellery', to: '/category/jewelry-eyewear-watches' },
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
      <div className="bg-[#e30613] text-center">
        <p className="truncate px-3 py-2 text-[0.68rem] font-semibold tracking-[0.08em] text-white uppercase sm:text-[0.72rem]">
          Express delivery across India · Fresh styles every week
        </p>
      </div>

      <div className="border-b border-[#eee]">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-3 sm:h-16 sm:px-5 lg:px-8">
          <button
            type="button"
            className="grid size-9 place-items-center lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" strokeWidth={2} />
          </button>

          <FusoraLogo compact className="shrink-0" />

          <nav className="ml-4 hidden flex-1 items-center justify-center gap-5 xl:gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to + item.label}
                to={item.to}
                className="text-[0.72rem] font-bold tracking-[0.06em] text-[#111] uppercase transition hover:text-[#e30613]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <form
              onSubmit={onSearch}
              className="hidden items-center overflow-hidden rounded-full border border-[#ddd] bg-white sm:flex"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-28 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#999] md:w-40"
              />
              <button
                type="submit"
                aria-label="Search"
                className="m-0.5 grid size-8 place-items-center rounded-full bg-[#e30613] text-white"
              >
                <Search className="size-3.5" strokeWidth={2.5} />
              </button>
            </form>
            <button
              type="button"
              className="grid size-9 place-items-center sm:hidden"
              aria-label="Search"
              onClick={() => navigate('/deals')}
            >
              <Search className="size-[1.15rem]" strokeWidth={2} />
            </button>
            <Link
              to="/account"
              className="hidden size-9 place-items-center sm:grid"
              aria-label="Account"
            >
              <User className="size-[1.15rem]" strokeWidth={2} />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid size-9 place-items-center"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.15rem]" strokeWidth={2} />
              {wishlist.size > 0 && (
                <span className="absolute top-0 right-0 flex min-w-4 items-center justify-center rounded-full bg-[#e30613] px-1 text-[0.55rem] font-bold text-white">
                  {wishlist.size}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-9 place-items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={2} />
              <span className="absolute top-0 right-0 flex min-w-4 items-center justify-center rounded-full bg-[#e30613] px-1 text-[0.55rem] font-bold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-[#eee] bg-white">
        <div className="hide-scrollbar mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-3 py-2.5 sm:px-5 lg:justify-center lg:px-8">
          {chips.map((c, i) => (
            <Link
              key={c.label}
              to={c.to}
              className="chip"
              data-active={
                i === 0 &&
                (location.pathname === '/deals' || location.pathname === '/')
              }
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

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
                    className="rounded-full bg-[#e30613] px-4 py-2 text-[0.68rem] font-bold tracking-wide text-white uppercase"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="rounded-full border border-[#ddd] px-4 py-2 text-[0.68rem] font-bold tracking-wide uppercase"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-[#e30613] px-4 py-2 text-[0.68rem] font-bold tracking-wide text-white uppercase"
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
                    className="block px-5 py-3.5 text-sm font-semibold uppercase tracking-wide"
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
