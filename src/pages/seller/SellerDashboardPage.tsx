import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { formatMoney } from '../../data'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  fetchMySellerProducts,
  getCachedSeller,
} from '../../lib/sellerApi'

export function SellerDashboardPage() {
  usePageTitle('Seller dashboard')
  const seller = getCachedSeller()
  const [count, setCount] = useState(0)
  const [value, setValue] = useState(0)

  useEffect(() => {
    void fetchMySellerProducts().then((list) => {
      setCount(list.length)
      setValue(list.reduce((s, p) => s + (p.price || 0), 0))
    })
  }, [])

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-[0.04em] uppercase">
        Welcome, {seller?.shopName || 'Seller'}
      </h1>
      <p className="mt-2 text-sm text-[#6a6667]">
        Manage your Fusora listings. Products go live on the shop as soon as you
        save them.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#d9d9d9] bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#6a6667] uppercase">
            Live products
          </p>
          <p className="mt-2 font-heading text-4xl text-[#cf2028]">{count}</p>
        </div>
        <div className="border border-[#d9d9d9] bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#6a6667] uppercase">
            Listed value
          </p>
          <p className="mt-2 font-heading text-4xl text-[#070001]">
            {formatMoney(value)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 bg-[#cf2028] px-5 py-3 text-xs font-semibold tracking-[0.14em] text-white uppercase"
        >
          <Plus size={16} /> Add product
        </Link>
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 border border-[#d9d9d9] bg-white px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase"
        >
          <Package size={16} /> Manage products
        </Link>
      </div>
    </div>
  )
}
