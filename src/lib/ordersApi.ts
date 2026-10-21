/** Server-side orders API (PHP in production, Vite plugin in dev). */
import { getAdminToken } from './adminCatalog'
import type { Order } from '../context/StoreContext'

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const data = (await res.json().catch(() => ({}))) as T & {
    ok?: boolean
    message?: string
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Orders request failed (${res.status})`)
  }
  return data
}

/** Fire-and-forget sync of a locally placed order to the server store. */
export function syncOrderToServer(order: Order): void {
  void request('/api/orders/create.php', {
    method: 'POST',
    body: JSON.stringify(order),
  }).catch(() => {
    // Local copy remains the fallback; next login merge retries via list.
  })
}

export async function fetchMyServerOrders(input: {
  email?: string
  phone?: string
}): Promise<Order[]> {
  const qs = new URLSearchParams()
  if (input.email) qs.set('email', input.email)
  if (input.phone) qs.set('phone', input.phone)
  const data = await request<{ orders: Order[] }>(
    `/api/orders/list.php?${qs.toString()}`,
    { headers: {} },
  )
  return data.orders || []
}

export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  const data = await request<{ orders: Order[] }>('/api/orders/all.php', {
    headers: { 'X-Admin-Token': getAdminToken() },
  })
  return data.orders || []
}

export async function updateOrderStatusAdmin(
  id: string,
  status: Order['status'],
): Promise<void> {
  await request('/api/orders/status.php', {
    method: 'POST',
    headers: { 'X-Admin-Token': getAdminToken() },
    body: JSON.stringify({ id, status }),
  })
}
