import type { Product } from '../data'

const DB_NAME = 'fusora-admin'
const DB_VERSION = 1
const STORE = 'products'
const LEGACY_LS_KEY = 'fusora-admin-products'

let memory: Product[] | null = null
let ready: Promise<Product[]> | null = null

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'))
  })
}

function readLegacyLocalStorage(): Product[] {
  try {
    const raw = localStorage.getItem(LEGACY_LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Product[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function clearLegacyLocalStorage() {
  try {
    localStorage.removeItem(LEGACY_LS_KEY)
  } catch {
    /* ignore */
  }
}

async function idbGetAll(): Promise<Product[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => {
      const rows = Array.isArray(req.result) ? (req.result as Product[]) : []
      resolve(rows)
    }
    req.onerror = () => reject(req.error || new Error('IndexedDB read failed'))
  })
}

async function idbReplaceAll(list: Product[]): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    store.clear()
    for (const p of list) store.put(p)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('IndexedDB write failed'))
    tx.onabort = () => reject(tx.error || new Error('IndexedDB write aborted'))
  })
}

function notify() {
  window.dispatchEvent(new Event('fusora-catalog-change'))
}

/** Sync snapshot (empty until hydrate finishes). */
export function getCachedAdminProducts(): Product[] {
  return memory ?? []
}

export function setCachedAdminProducts(list: Product[]) {
  memory = list
}

/** Load from IndexedDB; migrate + clear legacy localStorage once. */
export function hydrateAdminProducts(): Promise<Product[]> {
  if (typeof indexedDB === 'undefined') {
    memory = readLegacyLocalStorage()
    return Promise.resolve(memory)
  }
  if (!ready) {
    ready = (async () => {
      const legacy = readLegacyLocalStorage()
      let list = await idbGetAll()
      if (list.length === 0 && legacy.length > 0) {
        await idbReplaceAll(legacy)
        list = legacy
      }
      // Always drop legacy key so quota is freed for other small settings.
      if (legacy.length > 0) clearLegacyLocalStorage()
      memory = list
      notify()
      return list
    })().catch((err) => {
      console.error(err)
      memory = readLegacyLocalStorage()
      return memory
    })
  }
  return ready
}

export async function persistAdminProducts(list: Product[]): Promise<void> {
  memory = list
  if (typeof indexedDB === 'undefined') {
    // Last-resort tiny metadata-only fallback is not used; throw clearly.
    throw new Error(
      'IndexedDB unavailable. Use Chrome/Safari and allow site data storage.',
    )
  }
  await idbReplaceAll(list)
  // Ensure legacy key stays empty so we never hit localStorage quota again.
  clearLegacyLocalStorage()
  notify()
}
