import { Link } from 'react-router-dom'
import { formatMoney } from '../../data'
import { useCatalog } from '../../hooks/useCatalog'
import { deleteAdminProduct, loadAdminProducts } from '../../lib/adminCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useState } from 'react'

export function AdminProductsPage() {
  usePageTitle('Admin products')
  const { refresh } = useCatalog()
  const [list, setList] = useState(() => loadAdminProducts())

  const reload = () => {
    setList(loadAdminProducts())
    refresh()
  }

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
                    {p.categoryName || p.tab}
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
    </div>
  )
}
