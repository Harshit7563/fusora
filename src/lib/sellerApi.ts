import type { Product } from '../data'
import type { ApparelSubtype } from '../data/apparel'
import { getAdminToken } from './adminCatalog'

export type SellerProfile = {
  id: string
  shopName: string
  ownerName: string
  email: string
  phone: string
  /** UPI id where marketplace payouts are sent */
  payoutUpi?: string
  createdAt: number
}

/** Marketplace commission charged on seller orders */
export const SELLER_COMMISSION_PERCENT = 10

export type SellerProductInput = {
  id?: string
  name: string
  price: number
  was: number
  gender: 'men' | 'women'
  subtype: ApparelSubtype
  description?: string
  fabric?: string
  fit?: string
  wash?: string
  topDeal?: boolean
  images: string[]
}

const TOKEN_KEY = 'fusora-seller-token'
const SELLER_KEY = 'fusora-seller-profile'

export function getSellerToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getCachedSeller(): SellerProfile | null {
  try {
    const raw = sessionStorage.getItem(SELLER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SellerProfile
  } catch {
    return null
  }
}

export function setSellerSession(token: string, seller: SellerProfile) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(SELLER_KEY, JSON.stringify(seller))
}

export function clearSellerSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(SELLER_KEY)
}

export function isSellerLoggedIn() {
  return Boolean(getSellerToken())
}

async function api<T>(
  path: string,
  init: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(init.headers || {})
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (auth) {
    const token = getSellerToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  // Prefer .php on production Apache/nginx; Vite plugin accepts both
  let url = path
  if (!path.includes('uploads/') && !/\.php(\?|$)/.test(path)) {
    const q = path.indexOf('?')
    url = q >= 0 ? `${path.slice(0, q)}.php${path.slice(q)}` : `${path}.php`
  }
  const res = await fetch(url, { ...init, headers })
  const data = (await res.json().catch(() => ({}))) as T & {
    ok?: boolean
    message?: string
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}

export async function registerSeller(input: {
  shopName: string
  ownerName: string
  email: string
  phone: string
  password: string
  payoutUpi?: string
}) {
  const data = await api<{
    token: string
    seller: SellerProfile
    message: string
  }>('/api/seller/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  setSellerSession(data.token, data.seller)
  return data
}

export async function loginSeller(input: {
  email: string
  password: string
}) {
  const data = await api<{
    token: string
    seller: SellerProfile
    message: string
  }>('/api/seller/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  setSellerSession(data.token, data.seller)
  return data
}

export async function fetchSellerMe() {
  const data = await api<{ seller: SellerProfile }>(
    '/api/seller/me',
    { method: 'GET' },
    true,
  )
  setSellerSession(getSellerToken() || '', data.seller)
  return data.seller
}

export async function fetchAllSellerProducts(): Promise<Product[]> {
  try {
    const data = await api<{ products: Product[] }>('/api/seller/products', {
      method: 'GET',
    })
    return Array.isArray(data.products) ? data.products : []
  } catch {
    return []
  }
}

export async function fetchMySellerProducts(): Promise<Product[]> {
  const data = await api<{ products: Product[] }>(
    '/api/seller/products?mine=1',
    { method: 'GET' },
    true,
  )
  return Array.isArray(data.products) ? data.products : []
}

export async function upsertSellerProduct(input: SellerProductInput) {
  const method = input.id ? 'PUT' : 'POST'
  const data = await api<{ product: Product; message: string }>(
    '/api/seller/products',
    {
      method,
      body: JSON.stringify(input),
    },
    true,
  )
  return data
}

/** Admin: every seller listing with its moderation status. */
export async function fetchAdminSellerProducts(): Promise<Product[]> {
  const data = await api<{ products: Product[] }>(
    '/api/seller/products?scope=admin',
    { method: 'GET', headers: { 'X-Admin-Token': getAdminToken() } },
  )
  return Array.isArray(data.products) ? data.products : []
}

/** Admin: approve or reject a seller listing. */
export async function moderateSellerProduct(
  id: string,
  action: 'approve' | 'reject',
) {
  return api<{ product: Product; message?: string }>('/api/seller/moderate', {
    method: 'POST',
    headers: { 'X-Admin-Token': getAdminToken() },
    body: JSON.stringify({ id, action }),
  })
}

export async function deleteSellerProduct(id: string) {
  await api<{ message: string }>(
    '/api/seller/products',
    {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    },
    true,
  )
}
