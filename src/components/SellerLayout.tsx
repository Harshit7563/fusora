import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, Package, X } from 'lucide-react'
import {
  clearSellerSession,
  fetchSellerMe,
  getCachedSeller,
  isSellerLoggedIn,
} from '../lib/sellerApi'

const NAV = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/seller/products', label: 'My products', icon: Package },
]

export function SellerLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [shop, setShop] = useState(() => getCachedSeller()?.shopName || 'Seller')

  useEffect(() => {
    if (!isSellerLoggedIn()) {
      navigate('/sell', { replace: true })
      return
    }
    void fetchSellerMe()
      .then((s) => setShop(s.shopName))
      .catch(() => {
        clearSellerSession()
        navigate('/sell', { replace: true })
      })
  }, [navigate])

  if (!isSellerLoggedIn()) return null

  return (
    <div className="flex min-h-svh bg-[#f8f6ee] text-[#070001]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#cf2028] text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/15 p-5">
          <p className="font-logo text-lg font-extrabold tracking-[0.08em] uppercase">
            Fusora
          </p>
          <p className="mt-1 truncate text-xs text-white/80">{shop}</p>
          <p className="text-[0.65rem] tracking-wide text-[#ffc462] uppercase">
            Seller panel
          </p>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            clearSellerSession()
            navigate('/sell')
          }}
          className="mt-4 flex items-center gap-3 px-7 py-3 text-sm text-white/75 hover:text-white"
        >
          <LogOut size={18} /> Logout
        </button>
        <div className="absolute bottom-4 left-0 right-0 px-5">
          <Link to="/" className="block text-xs text-white/60 hover:text-white">
            ← View store
          </Link>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e9e1db] bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
          <span className="font-semibold">{shop}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto hidden"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
