import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminLogout, isAdminLoggedIn } from '../lib/adminCatalog'
import { FusoraLogo } from './FusoraLogo'
import { useEffect } from 'react'

const nav = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
]

export function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdminLoggedIn()) navigate('/admin/login', { replace: true })
  }, [navigate])

  if (!isAdminLoggedIn()) return null

  return (
    <div className="min-h-svh bg-[#f5f5f5] text-[#272727]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <FusoraLogo compact />
            <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-[#787878] uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs tracking-wide text-[#787878] uppercase hover:text-[#272727]"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={() => {
                adminLogout()
                navigate('/admin/login')
              }}
              className="border border-[#ececec] px-3 py-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shrink-0 px-3 py-2 text-[0.7rem] font-semibold tracking-[0.12em] uppercase ${
                  isActive
                    ? 'bg-[#323232] text-white'
                    : 'bg-white text-[#272727] hover:bg-[#f5f5f5]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/admin/products/new"
            className="ml-auto shrink-0 bg-[#323232] px-3 py-2 text-[0.7rem] font-semibold tracking-[0.12em] text-white uppercase"
          >
            + Add product
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
