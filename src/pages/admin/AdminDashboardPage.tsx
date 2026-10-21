import { Link } from 'react-router-dom'
import { useCatalog } from '../../hooks/useCatalog'
import { uploadByTag } from '../../data'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Package, Tags, ShoppingBag, Plus } from 'lucide-react'

export function AdminDashboardPage() {
  usePageTitle('Admin')
  const { products, adminCategories } = useCatalog()
  const byG = products.filter((p) => uploadByTag(p) === 'G').length
  const byHS = products.filter((p) => uploadByTag(p) === 'HS').length

  const cards = [
    {
      label: 'Upload by G (Admin)',
      value: byG,
      icon: Package,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Upload by HS (AI)',
      value: byHS,
      icon: Package,
      color: 'bg-red-50 text-[#cf2028]',
    },
    {
      label: 'Categories',
      value: adminCategories.length,
      icon: Tags,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Total catalog',
      value: products.length,
      icon: ShoppingBag,
      color: 'bg-green-50 text-green-600',
    },
  ]

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[#e8e8e8] bg-white p-4 sm:p-5"
          >
            <div
              className={`mb-3 flex size-10 items-center justify-center rounded-lg ${color}`}
            >
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
        >
          <Plus size={16} /> Add Product
        </Link>
        <Link
          to="/admin/categories"
          className="rounded-lg border border-[#e8e8e8] bg-white px-5 py-2.5 text-sm font-medium hover:bg-[#fafafa]"
        >
          Manage categories
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-[#e8e8e8] bg-white p-5">
        <h2 className="mb-2 font-semibold">Live Site</h2>
        <p className="text-sm text-gray-600">
          Website:{' '}
          <a
            href="https://fusora.shop"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            fusora.shop
          </a>
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Admin: <code className="text-[#272727]">fusora.shop/admin</code>
        </p>
      </div>
    </div>
  )
}
