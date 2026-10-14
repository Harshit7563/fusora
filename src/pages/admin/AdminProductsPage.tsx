import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatMoney } from '../../data'
import { useCatalog } from '../../hooks/useCatalog'
import { deleteAdminProduct, loadAdminProducts } from '../../lib/adminCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useEffect, useState } from 'react'

type LocationState = {
  addedName?: string
  savedName?: string
}

export function AdminProductsPage() {
  usePageTitle('Admin products')
  const { refresh } = useCatalog()
  const location = useLocation()
  const navigate = useNavigate()
  const [list, setList] = useState(() => loadAdminProducts())
  const [notice, setNotice] = useState<string | null>(null)

  const reload = () => {
    setList(loadAdminProducts())
    refresh()
  }

  useEffect(() => {
    const state = (location.state || {}) as LocationState
    if (state.addedName) {
      setNotice(`Joyti Beti — “${state.addedName}” Add ho gya product`)
      navigate(location.pathname, { replace: true, state: {} })
    } else if (state.savedName) {
      setNotice(`Joyti Beti — “${state.savedName}” update ho gaya`)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    if (!notice) return
    const t = window.setTimeout(() => setNotice(null), 4500)
    return () => window.clearTimeout(t)
  }, [notice])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-wide">Products</h1>
          <p className="mt-1 text-sm text-[#787878]">
            Products you add here appear on the shop immediately.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-[#323232] px-4 py-2.5 text-[0.7rem] font-semibold tracking-[0.14em] text-white uppercase"
        >
          + Add product
        </Link>
      </div>

      {notice && (
        <div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-900">
          {notice}
        </div>
      )}

      {list.length === 0 ? (
        <div className="mt-8 border border-[#ececec] bg-white p-8 text-center">
          <p className="text-sm text-[#787878]">No admin products yet.</p>
          <Link
            to="/admin/products/new"
            className="mt-4 inline-flex bg-[#323232] px-5 py-3 text-[0.7rem] font-semibold tracking-[0.14em] text-white uppercase"
          >
            Create first product
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-[#ececec] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#ececec] bg-[#fafafa] text-[0.65rem] tracking-[0.12em] uppercase">
              <tr>
                <th className="px-3 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Price</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-[#ececec] last:border-0">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="size-12 object-cover bg-[#f5f5f5]"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-medium">{p.name}</p>
                        <p className="text-xs text-[#787878]">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#787878]">
                    {(p.gender || p.tab || '').toString().toUpperCase()}
                    {p.subtype ? ` / ${p.subtype}` : ''}
                  </td>
                  <td className="px-3 py-3 font-medium">{formatMoney(p.price)}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="border border-[#ececec] px-2.5 py-1.5 text-[0.65rem] font-semibold tracking-wide uppercase"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/product/${p.id}`}
                        className="border border-[#ececec] px-2.5 py-1.5 text-[0.65rem] font-semibold tracking-wide uppercase"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm(`Delete “${p.name}”?`)) return
                          deleteAdminProduct(p.id)
                          reload()
                        }}
                        className="border border-red-200 px-2.5 py-1.5 text-[0.65rem] font-semibold tracking-wide text-[#b4232f] uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/admin/products/new"
          className="flex w-full items-center justify-center bg-[#323232] px-4 py-4 text-[0.75rem] font-semibold tracking-[0.16em] text-white uppercase"
        >
          + Add product
        </Link>
      </div>

      {notice && (
        <div className="pointer-events-none fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 bg-[#323232] px-5 py-3 text-center text-sm font-medium tracking-wide text-white shadow-lg">
          {notice}
        </div>
      )}
    </div>
  )
}
