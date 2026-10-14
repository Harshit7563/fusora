import { Link } from 'react-router-dom'
import { useCatalog } from '../../hooks/useCatalog'
import { loadAdminProducts } from '../../lib/adminCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AdminDashboardPage() {
  usePageTitle('Admin')
  const { products, adminCategories } = useCatalog()
  const adminProducts = loadAdminProducts()

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-wide">Dashboard</h1>
      <p className="mt-1 text-sm text-[#787878]">
        Manage store catalog. Changes show on the live site after refresh.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-[#ececec] bg-white p-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[#787878] uppercase">
            Admin products
          </p>
          <p className="mt-2 text-3xl font-medium">{adminProducts.length}</p>
        </div>
        <div className="border border-[#ececec] bg-white p-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[#787878] uppercase">
            Custom categories
          </p>
          <p className="mt-2 text-3xl font-medium">{adminCategories.length}</p>
        </div>
        <div className="border border-[#ececec] bg-white p-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[#787878] uppercase">
            Total catalog
          </p>
          <p className="mt-2 text-3xl font-medium">{products.length}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/admin/products/new"
          className="bg-[#323232] px-5 py-3 text-[0.7rem] font-semibold tracking-[0.14em] text-white uppercase"
        >
          Add product
        </Link>
        <Link
          to="/admin/categories"
          className="border border-[#ececec] bg-white px-5 py-3 text-[0.7rem] font-semibold tracking-[0.14em] uppercase"
        >
          Manage categories
        </Link>
        <Link
          to="/admin/products"
          className="border border-[#ececec] bg-white px-5 py-3 text-[0.7rem] font-semibold tracking-[0.14em] uppercase"
        >
          All products
        </Link>
      </div>

      <p className="mt-10 text-xs text-[#787878]">
        Admin URL:{' '}
        <code className="bg-white px-1.5 py-0.5 text-[#272727]">
          https://fusora.shop/admin
        </code>
      </p>
    </div>
  )
}
