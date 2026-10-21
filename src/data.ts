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
import fusoraDresses from './data/fusoraDresses.json'
import tenaxTshirts from './data/tenaxTshirts.json'
import { type ApparelSubtype } from './data/apparel'
import { loadAdminProducts } from './lib/adminCatalog'
import { loadSellerProducts } from './lib/sellerCatalog'

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
  /** Marketplace seller id when source === 'seller' */
  sellerId?: string
  /** Marketplace moderation state (seller products need admin approval) */
  status?: 'pending' | 'approved' | 'rejected' | string
  sellerShop?: string
  /** Who uploaded it: G = admin panel, HS = AI/catalog import */
  uploadedBy?: 'G' | 'HS' | 'Seller'
  /** Upload date (ISO yyyy-mm-dd or timestamp) */
  uploadedAt?: string
  /** Verified colour name when product is colour-split */
  color?: string
}

/** Upload-by label for admin log: G = admin, HS = AI */
export function uploadByLabel(p: Product): string {
  if (p.uploadedBy) return `Upload by ${p.uploadedBy}`
  if (p.source === 'admin') return 'Upload by G'
  if (p.source === 'seller') return 'Upload by Seller'
  return 'Upload by HS'
}

/** Short tag: G / HS / Seller */
export function uploadByTag(p: Product): 'G' | 'HS' | 'Seller' {
  if (p.uploadedBy) return p.uploadedBy
  if (p.source === 'admin') return 'G'
  if (p.source === 'seller') return 'Seller'
  return 'HS'
}

/** Display upload date as DD/MM/YYYY */
export function uploadDateLabel(p: Product): string {
  const raw = String(p.uploadedAt || '').trim()
  if (!raw) return '—'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
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
    uploadedBy: 'HS' as const,
    uploadedAt: '2026-09-27',
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
    uploadedBy: 'HS' as const,
    uploadedAt: '2026-09-27',
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
    uploadedBy: 'HS' as const,
    uploadedAt: '2026-09-27',
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

function isSaltyBrandedImage(url: string): boolean {
  // Drop lifestyle / packaging shots that carry the Salty brand mark in the file name
  return /salty/i.test(url)
}

const jewelleryCatalog: Product[] = (
  saltyJewellery as Array<Record<string, unknown>>
)
  .flatMap((p, i): Product[] => {
    const raw = uniqueImages(
      String(p.image || ''),
      Array.isArray(p.images) ? (p.images as string[]) : undefined,
    ).filter((u) => !isSaltyBrandedImage(u))
    // Prefer model / main product photos as hero
    const images = [...raw].sort((a, b) => {
      const score = (u: string) => {
        const f = u.toLowerCase()
        let s = 0
        if (/model|main|_hero/.test(f)) s += 5
        if (/\.png(\?|$)/.test(f)) s += 1
        return s
      }
      return score(b) - score(a)
    })
    if (!images.length) return []
    const disclaimer =
      'Artificial / fashion jewellery only — not real gold, not real diamond, not precious metal.'
    const rawDesc = p.description ? String(p.description) : ''
    const description = /artificial|not real gold/i.test(rawDesc)
      ? rawDesc
      : `${disclaimer} ${rawDesc}`.trim()
    return [
      {
        id: String(p.id),
        rank: i + 1,
        name: String(p.name),
        price: Number(p.price),
        was: Number(p.was) || Number(p.price),
        topDeal: Boolean(p.topDeal),
        tab: 'jewelry-eyewear-watches' as CategoryId,
        gender: 'women' as ProductGender,
        categoryName: p.productType
          ? String(p.productType)
          : 'Artificial Jewellery',
        categorySlug: 'artificial-jewellery',
        brand: 'Fusora',
        image: images[0],
        images,
        description,
        sku: p.sku ? String(p.sku) : undefined,
        source: 'salty',
        uploadedBy: 'HS' as const,
        uploadedAt: '2026-10-18',
      },
    ]
  })
  .map((p, i) => ({ ...p, rank: i + 1 }))

const tshirtCatalog: Product[] = (
  tenaxTshirts as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image || '')
  let images = uniqueImages(
    image,
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  // Every uploaded t-shirt must expose at least 2 gallery images
  if (images.length === 1) images = [images[0], images[0]]
  if (images.length === 0 && image) images = [image, image]
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: String(p.name),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'apparel-accessories' as CategoryId,
    subtype: 'tshirts' as ApparelSubtype,
    gender: 'men' as ProductGender,
    collection: 'mens-tshirts',
    categoryName: p.categoryName ? String(p.categoryName) : 'T-Shirts',
    categorySlug: 'mens-tshirts',
    brand: 'Fusora',
    image: images[0] || image,
    images,
    description: p.description ? String(p.description) : undefined,
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]).map(String) : undefined,
    sku: p.sku ? String(p.sku) : undefined,
    color: p.color ? String(p.color) : undefined,
    source: 'tenaxtees',
    uploadedBy: 'HS' as const,
    uploadedAt: '2026-10-18',
  }
})

/** Fusora's own original women's dresses line. */
const fusoraDressesCatalog: Product[] = (
  fusoraDresses as Array<Record<string, unknown>>
).map((p, i) => {
  const images = uniqueImages(
    String(p.image || ''),
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: String(p.name),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'apparel-accessories' as CategoryId,
    subtype: 'dresses' as ApparelSubtype,
    gender: 'women' as ProductGender,
    collection: 'womens-dresses',
    categoryName: 'Dresses',
    categorySlug: 'womens-dresses',
    brand: 'Fusora',
    image: images[0] || String(p.image || ''),
    images,
    description: p.description ? String(p.description) : undefined,
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]).map(String) : undefined,
    sku: p.sku ? String(p.sku) : undefined,
    color: p.color ? String(p.color) : undefined,
    source: 'fusora-dresses',
    uploadedBy: 'HS' as const,
    uploadedAt: '2026-10-20',
  }
})

/** Real supplier catalogues only — no demo tees / stock photos / BB leftovers. */
export const staticProducts: Product[] = dedupeByImage([
  ...sareeProducts,
  ...denimforgeCatalog,
  ...modcartCatalog,
  ...jewelleryCatalog,
  ...tshirtCatalog,
  ...fusoraDressesCatalog,
])

/** Built-in catalog + admin (IndexedDB) + marketplace seller listings. */
export function getProducts(): Product[] {
  const admin = loadAdminProducts()
  const sellers = loadSellerProducts()
  return dedupeByImage([
    ...(Array.isArray(admin) ? admin : []),
    ...(Array.isArray(sellers) ? sellers : []),
    ...staticProducts,
  ])
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
