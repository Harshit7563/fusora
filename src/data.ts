import {
  dealTabs,
  shopCategories,
  type CategoryId,
  type DealTab,
} from './categories'
import dyntraSarees from './data/dyntraSarees.json'
import modcartProducts from './data/modcartProducts.json'
import denimforgeProducts from './data/denimforgeProducts.json'
import saltyJewellery from './data/saltyJewellery.json'
import { type ApparelSubtype } from './data/apparel'
import { loadAdminProducts } from './lib/adminCatalog'

export type { CategoryId, DealTab }
export { dealTabs, shopCategories }
export type { ApparelSubtype }

export type ProductGender = 'men' | 'women' | 'unisex'

export type Product = {
  id: string
  rank: number
  name: string
  price: number
  was: number
  topDeal?: boolean
  tab: CategoryId
  /** Apparel & Clothes only */
  subtype?: ApparelSubtype
  /** men | women | unisex — used for Men/Women category pages */
  gender?: ProductGender
  /** Source collection slug (e.g. mens-jeans, silk-sarees) */
  collection?: string
  categoryName?: string
  categorySlug?: string
  image: string
  /** Extra gallery photos — duplicates are stripped at display time */
  images?: string[]
  brand: string
  description?: string
  sizes?: string[]
  fit?: string
  wash?: string
  fabric?: string
  sku?: string
  source?: string
}

/** Strip supplier brand prefixes from product titles (Dyntra / Denim Forge). */
export function cleanSupplierName(name: string): string {
  let s = String(name || '')
  s = s
    .replace(/\bthe\s+denim\s+forge\b/gi, '')
    .replace(/\bdenim\s+forge\b/gi, '')
    .replace(/\bdenim\s+foege\b/gi, '')
    .replace(/denim\s*forge/gi, '')
    .replace(/\bdyntra\b/gi, '')
    .replace(/dyntra/gi, '')
    .replace(/\bMa\s+terial\b/gi, 'Material')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s\-–—:,.]+|[\s\-–—:,.]+$/g, '')
    .trim()
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
  return s.replace(/\s{2,}/g, ' ').trim()
}

function fusoraBrand(raw: unknown, fallback = 'Fusora'): string {
  const b = String(raw || fallback)
  if (/dyntra|denim\s*forge/i.test(b)) return 'Fusora'
  return b || 'Fusora'
}

/** Keep order, drop exact duplicate URLs (and empty). */
export function uniqueImages(...groups: Array<string | string[] | undefined>): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const group of groups) {
    const list = Array.isArray(group) ? group : group ? [group] : []
    for (const raw of list) {
      const url = String(raw || '').trim()
      if (!url || seen.has(url)) continue
      seen.add(url)
      out.push(url)
    }
  }
  return out
}

export type CartItem = Product & { qty: number; selectedSize?: string }

const sareeProducts: Product[] = (
  dyntraSarees as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image || '')
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: cleanSupplierName(String(p.name)),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'apparel-accessories' as CategoryId,
    subtype: 'sarees' as ApparelSubtype,
    gender: 'women',
    collection: p.categorySlug ? String(p.categorySlug) : undefined,
    categoryName: p.categoryName ? String(p.categoryName) : undefined,
    categorySlug: p.categorySlug ? String(p.categorySlug) : undefined,
    brand: fusoraBrand(p.brand),
    image,
    images: uniqueImages(image),
    description: p.description
      ? cleanSupplierName(String(p.description))
      : undefined,
    source: 'dyntra',
  }
})

const modcartCatalog: Product[] = (
  modcartProducts as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image)
  const images = uniqueImages(
    image,
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  const name = String(p.name)
  const cats = Array.isArray(p.categories)
    ? (p.categories as string[]).join(' ')
    : ''
  const genderBlob = `${name} ${cats}`.toLowerCase()
  const gender: ProductGender = /women|ladies|kurti|saree|dupatta|lehenga/.test(
    genderBlob,
  )
    ? 'women'
    : /men|boy/.test(genderBlob)
      ? 'men'
      : 'unisex'
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name,
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: (String(p.tab) || 'apparel-accessories') as CategoryId,
    subtype: (p.subtype as ApparelSubtype | undefined) || undefined,
    gender,
    brand: String(p.brand || 'Modcart'),
    image: images[0] || image,
    images,
    description: p.description ? String(p.description) : undefined,
  }
})

const denimforgeCatalog: Product[] = (
  denimforgeProducts as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image || '')
  const images = uniqueImages(
    image,
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  const collection = String(p.collection || p.categorySlug || 'mens-jeans')
  const gender: ProductGender = collection.startsWith('womens')
    ? 'women'
    : collection.startsWith('mens')
      ? 'men'
      : 'unisex'
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: cleanSupplierName(String(p.name)),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'apparel-accessories' as CategoryId,
    subtype: 'jeans' as ApparelSubtype,
    gender,
    collection,
    categoryName: p.categoryName ? String(p.categoryName) : undefined,
    categorySlug: collection,
    brand: fusoraBrand(p.brand),
    image: images[0] || image,
    images,
    description: p.description
      ? cleanSupplierName(String(p.description))
      : undefined,
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]).map(String) : undefined,
    fit: p.fit ? String(p.fit) : undefined,
    wash: p.wash ? String(p.wash) : undefined,
    fabric: p.fabric ? String(p.fabric) : undefined,
    sku: p.sku ? String(p.sku) : undefined,
    source: 'thedenimforge',
  }
})

/** Normalize image URL for duplicate detection (ignore query/hash). */
function imageDedupeKey(url: string): string {
  const raw = String(url || '').trim()
  if (!raw) return ''
  try {
    const u = new URL(raw)
    return `${u.host}${u.pathname}`.toLowerCase()
  } catch {
    return raw.split('?')[0].toLowerCase()
  }
}

function isStockPlaceholderImage(url: string): boolean {
  return /pexels\.com|unsplash\.com|picsum\.photos/i.test(url)
}

/** Drop stock placeholders + keep first product per unique photo. */
function dedupeByImage(list: Product[]): Product[] {
  const seen = new Set<string>()
  const out: Product[] = []
  for (const p of list) {
    const img = String(p.image || '').trim()
    // Skip Unsplash / Pexels / dummy stock photos site-wide
    if (!img || isStockPlaceholderImage(img)) continue
    // Skip leftover BigBasket CDN junk
    if (/bbassets\.com/i.test(img)) continue
    const key = imageDedupeKey(img)
    if (key) {
      if (seen.has(key)) continue
      seen.add(key)
    }
    out.push(p)
  }
  return out
}

const jewelleryCatalog: Product[] = (
  saltyJewellery as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image || '')
  const images = uniqueImages(
    image,
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  const disclaimer =
    'Artificial / fashion jewellery only — not real gold, not real diamond, not precious metal.'
  const rawDesc = p.description ? String(p.description) : ''
  const description = /artificial|not real gold/i.test(rawDesc)
    ? rawDesc
    : `${disclaimer} ${rawDesc}`.trim()
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: String(p.name),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'jewelry-eyewear-watches' as CategoryId,
    gender: 'women' as ProductGender,
    categoryName: p.productType ? String(p.productType) : 'Artificial Jewellery',
    categorySlug: 'artificial-jewellery',
    brand: 'Fusora',
    image: images[0] || image,
    images,
    description,
    sku: p.sku ? String(p.sku) : undefined,
    source: 'salty',
  }
})

/** Real supplier catalogues only — no demo tees / stock photos / BB leftovers. */
export const staticProducts: Product[] = dedupeByImage([
  ...sareeProducts,
  ...denimforgeCatalog,
  ...modcartCatalog,
  ...jewelleryCatalog,
])

/** Built-in catalog + products created in /admin (IndexedDB cache). */
export function getProducts(): Product[] {
  const admin = loadAdminProducts()
  if (!Array.isArray(admin) || admin.length === 0) return staticProducts
  return dedupeByImage([...admin, ...staticProducts])
}

/** @deprecated Prefer getProducts() so admin-added items are included */
export const products: Product[] = staticProducts

export const promoCards = [
  {
    id: 'iphone',
    title: 'New iPhone 16 Pro',
    body: 'Save with qualified activation and trade-in on iPhone 16 Pro.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #1a6dff 0%, #0046be 55%, #00308a 100%)',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mac',
    title: 'MacBook deals',
    body: 'MacBook Air & Pro — limited-time savings for work and creativity.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #3d8bff 0%, #1a5fd4 50%, #0046be 100%)',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'watch',
    title: 'Smartwatches',
    body: 'Apple Watch & Galaxy Watch — fitness and style that keep up.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #2f78f0 0%, #0046be 60%, #002f8a 100%)',
    image:
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'audio',
    title: 'Premium audio',
    body: 'Sony, Bose, AirPods — noise canceling deals this week.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #4a95ff 0%, #1a66d9 55%, #0046be 100%)',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
]

export const navLinks: { label: string; to: string }[] = [
  { label: 'Shop', to: '/deals' },
  { label: 'Apparel', to: '/category/apparel-accessories' },
  { label: 'Memberships', to: '/memberships' },
  { label: 'Our Story', to: '/about' },
  { label: 'Support', to: '/support' },
]

export function formatMoney(n: number) {
  return n.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
}
