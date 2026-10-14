import { useEffect, useState } from 'react'
import { getAllShopCategories, type ShopCategory } from '../categories'
import { getProducts, type Product } from '../data'
import {
  ensureAdminProductsLoaded,
  loadAdminCategories,
  type AdminCategory,
} from '../lib/adminCatalog'

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(() => getProducts())
  const [categories, setCategories] = useState<ShopCategory[]>(() =>
    getAllShopCategories(),
  )
  const [adminCategories, setAdminCategories] = useState<AdminCategory[]>(() =>
    loadAdminCategories(),
  )

  const refresh = () => {
    setProducts(getProducts())
    setCategories(getAllShopCategories())
    setAdminCategories(loadAdminCategories())
  }

  useEffect(() => {
    void ensureAdminProductsLoaded().then(() => refresh())
    window.addEventListener('fusora-catalog-change', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('fusora-catalog-change', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return { products, categories, adminCategories, refresh }
}
