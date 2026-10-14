import type { CategoryId, Product, ProductGender } from '../data'
import type { ApparelSubtype } from '../data/apparel'

const PRODUCTS_KEY = 'fusora-admin-products'
const CATEGORIES_KEY = 'fusora-admin-categories'
const AUTH_KEY = 'fusora-admin-auth'

/** One-off removals — purged from every browser on next catalog load. */
const PURGED_ADMIN_PRODUCT_IDS = new Set(['admin-xjxjxj-mv7x6k16'])

export type AdminCategory = {
  id: string
  label: string
  emoji: string
  image?: string
  blurb?: string
  /** Parent shop gender for Men/Women browsing */
  gender?: ProductGender
  createdAt: string
}

export type AdminProductInput = {
  name: string
  price: number
  was: number
  tab: string
  gender: ProductGender
  subtype?: ApparelSubtype | ''
  collection?: string
  categoryName?: string
  brand: string
  image: string
  images?: string[]
  description?: string
  sizes?: string[]
  fabric?: string
  fit?: string
  wash?: string
  sku?: string
  topDeal?: boolean
}

export function nextAdminSku() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `FS-${n}`
}

/** Full size run for admin products — always in stock, never partial. */
export function defaultSizesForSubtype(
  subtype?: ApparelSubtype | '' | null,
): string[] {
  switch (subtype) {
    case 'jeans':
      return ['28', '30', '32', '34', '36', '38', '40', '42']
    case 'sarees':
      return ['Free Size']
    case 'tshirts':
    case 'shirts':
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    default:
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event('fusora-catalog-change'))
}

export function loadAdminProducts(): Product[] {
  const list = readJson<Product[]>(PRODUCTS_KEY, [])
  if (!Array.isArray(list)) return []
  const cleaned = list.filter((p) => !PURGED_ADMIN_PRODUCT_IDS.has(p.id))
  if (cleaned.length !== list.length) saveAdminProducts(cleaned)
  return cleaned
}

export function saveAdminProducts(list: Product[]) {
  writeJson(PRODUCTS_KEY, list)
}

export function loadAdminCategories(): AdminCategory[] {
  const list = readJson<AdminCategory[]>(CATEGORIES_KEY, [])
  return Array.isArray(list) ? list : []
}

export function saveAdminCategories(list: AdminCategory[]) {
  writeJson(CATEGORIES_KEY, list)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

export function upsertAdminCategory(
  input: Omit<AdminCategory, 'createdAt'> & { createdAt?: string },
) {
  const list = loadAdminCategories()
  const id = input.id || slugify(input.label)
  const next: AdminCategory = {
    id,
    label: input.label.trim(),
    emoji: input.emoji || '🛍️',
    image: input.image?.trim() || undefined,
    blurb: input.blurb?.trim() || undefined,
    gender: input.gender,
    createdAt: input.createdAt || new Date().toISOString(),
  }
  const idx = list.findIndex((c) => c.id === id)
  if (idx >= 0) list[idx] = { ...list[idx], ...next }
  else list.push(next)
  saveAdminCategories(list)
  return next
}

export function deleteAdminCategory(id: string) {
  saveAdminCategories(loadAdminCategories().filter((c) => c.id !== id))
}

export function upsertAdminProduct(
  input: AdminProductInput,
  existingId?: string,
): Product {
  const list = loadAdminProducts()
  const id = existingId || `admin-${slugify(input.name)}-${Date.now().toString(36)}`
  const images = (input.images || [])
    .map((u) => u.trim())
    .filter(Boolean)
  const gender: ProductGender =
    input.gender === 'men' || input.gender === 'women' ? input.gender : 'unisex'
  const tab =
    input.tab === 'men' || input.tab === 'women'
      ? input.tab
      : gender === 'men' || gender === 'women'
        ? gender
        : input.tab

  const existing = existingId
    ? list.find((p) => p.id === existingId)
    : undefined
  const product: Product = {
    id,
    rank: 1,
    name: input.name.trim(),
    price: Number(input.price) || 0,
    was: Number(input.was) || Number(input.price) || 0,
    topDeal: Boolean(input.topDeal),
    tab: tab as CategoryId,
    gender,
    subtype: input.subtype || undefined,
    collection: input.collection?.trim() || undefined,
    categoryName: input.categoryName?.trim() || undefined,
    brand: input.brand.trim() || 'Fusora',
    image: input.image.trim(),
    images: images.length ? images : undefined,
    description: input.description?.trim() || undefined,
    // Always persist the full size run — never leave a product partially sized / OOS.
    sizes: defaultSizesForSubtype(input.subtype),
    fabric: input.fabric?.trim() || undefined,
    fit: input.fit?.trim() || undefined,
    wash: input.wash?.trim() || undefined,
    sku: input.sku?.trim() || existing?.sku || nextAdminSku(),
    source: 'admin',
  }
  const idx = list.findIndex((p) => p.id === id)
  if (idx >= 0) list[idx] = product
  else list.unshift(product)
  saveAdminProducts(list)
  return product
}

export function deleteAdminProduct(id: string) {
  saveAdminProducts(loadAdminProducts().filter((p) => p.id !== id))
}

export function getAdminProduct(id: string) {
  return loadAdminProducts().find((p) => p.id === id)
}

type FusoraConfig = {
  adminPassword?: string
}

function getAdminPassword() {
  const cfg = (window as Window & { __FUSORA__?: FusoraConfig }).__FUSORA__
  return cfg?.adminPassword || 'fusora-admin'
}

export function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1'
  } catch {
    return false
  }
}

export function adminLogin(password: string) {
  if (password === getAdminPassword()) {
    sessionStorage.setItem(AUTH_KEY, '1')
    return { ok: true as const }
  }
  return { ok: false as const, message: 'Wrong password' }
}

export function adminLogout() {
  sessionStorage.removeItem(AUTH_KEY)
}
