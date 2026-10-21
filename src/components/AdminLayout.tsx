import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout, isAdminLoggedIn } from '../lib/adminCatalog'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Tags,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isAdminLoggedIn()) navigate('/admin/login', { replace: true })
  }, [navigate])

  if (!isAdminLoggedIn()) return null

  return (
    <div className="flex min-h-svh bg-[#f5f5f5] text-[#272727]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1a1a1a] text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 p-5">
          <p className="text-lg font-bold">Fusora</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
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
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
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
            adminLogout()
            navigate('/admin/login')
          }}
          className="mt-4 flex items-center gap-3 px-7 py-3 text-sm text-gray-400 hover:text-white"
        >
          <LogOut size={18} /> Logout
        </button>
        <div className="absolute bottom-4 left-0 right-0 px-5">
          <Link
            to="/"
            className="block text-xs text-gray-500 hover:text-white"
          >
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
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e8e8e8] bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
          <span className="font-semibold">Admin</span>
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
