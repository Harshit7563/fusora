import type { Product } from '../data'
import { fetchAllSellerProducts } from './sellerApi'

let memory: Product[] = []
let ready: Promise<Product[]> | null = null

function notify() {
  window.dispatchEvent(new Event('fusora-catalog-change'))
}

export function getCachedSellerProducts(): Product[] {
  return memory
}

export function loadSellerProducts(): Product[] {
  return memory
}

/** Fetch marketplace seller listings into memory (safe to call many times). */
export function ensureSellerProductsLoaded(): Promise<Product[]> {
  if (!ready) {
    ready = fetchAllSellerProducts()
      .then((list) => {
        memory = Array.isArray(list) ? list : []
        notify()
        return memory
      })
      .catch(() => {
        memory = []
        return memory
      })
  }
  return ready
}

/** Force refresh after a seller edits their catalogue. */
export async function refreshSellerProducts(): Promise<Product[]> {
  ready = null
  return ensureSellerProductsLoaded()
}
