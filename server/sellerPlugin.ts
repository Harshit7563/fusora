/**
 * Vite middleware: seller marketplace API (mirrors hostinger/api/seller/*.php)
 */
import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'
import { loadEnv } from 'vite'

/** Admin env for moderation token checks (set in configResolved) */
let env: Record<string, string> = {}

type Seller = {
  id: string
  shopName: string
  ownerName: string
  email: string
  phone: string
  passwordHash: string
  token: string
  payoutUpi?: string
  createdAt: number
}

type SellerProduct = Record<string, unknown>

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, '.data', 'seller')
const UPLOADS_DIR = join(DATA_DIR, 'uploads')

function ensureDirs() {
  mkdirSync(DATA_DIR, { recursive: true })
  mkdirSync(UPLOADS_DIR, { recursive: true })
}

function readStore<T>(file: string, fallback: T): T {
  ensureDirs()
  const path = join(DATA_DIR, file)
  if (!existsSync(path)) return fallback
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  } catch {
    return fallback
  }
}

function writeStore(file: string, data: unknown) {
  ensureDirs()
  const path = join(DATA_DIR, file)
  const tmp = `${path}.tmp`
  writeFileSync(tmp, JSON.stringify(data))
  renameSync(tmp, path)
}

function slug(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'shop'
  )
}

function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 32).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const next = scryptSync(password, salt, 32).toString('hex')
  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(next, 'hex'))
  } catch {
    return false
  }
}

function token() {
  return randomBytes(24).toString('hex')
}

function publicSeller(s: Seller) {
  return {
    id: s.id,
    shopName: s.shopName,
    ownerName: s.ownerName,
    email: s.email,
    phone: s.phone,
    payoutUpi: s.payoutUpi || '',
    createdAt: s.createdAt,
  }
}

function sizes(subtype: string) {
  if (subtype === 'jeans') return ['28', '30', '32', '34', '36', '38', '40', '42']
  if (subtype === 'sarees') return ['Free Size']
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
}

function saveImage(input: string, prefix: string): string | null {
  const raw = String(input || '').trim()
  if (!raw) return null
  if (raw.startsWith('/api/seller/uploads/')) return raw
  if (/^https?:\/\//i.test(raw)) return raw
  const m = raw.match(/^data:image\/(jpeg|jpg|png|webp);base64,/i)
  if (!m) return null
  const b64 = raw.slice(raw.indexOf(',') + 1)
  const bin = Buffer.from(b64, 'base64')
  if (bin.length < 32 || bin.length > 900_000) return null
  ensureDirs()
  const name = `${prefix}-${randomBytes(5).toString('hex')}.jpg`
  writeFileSync(join(UPLOADS_DIR, name), bin)
  return `/api/seller/uploads/${name}`
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {}
  }
}

function authSeller(req: IncomingMessage): Seller | null {
  const hdr =
    String(req.headers.authorization || req.headers['x-seller-token'] || '')
  let t = ''
  const m = hdr.match(/Bearer\s+(\S+)/i)
  if (m) t = m[1]
  else if (hdr) t = hdr.trim()
  if (!t) return null
  const sellers = readStore<Seller[]>('sellers.json', [])
  return sellers.find((s) => s.token === t) || null
}

function sellerApiMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url || ''
    if (!url.startsWith('/api/seller/')) return next()

    // Serve uploaded images
    if (url.startsWith('/api/seller/uploads/')) {
      const name = url.slice('/api/seller/uploads/'.length).split('?')[0]
      if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
        sendJson(res, 400, { ok: false, message: 'Bad file' })
        return
      }
      const path = join(UPLOADS_DIR, name)
      if (!existsSync(path)) {
        res.statusCode = 404
        res.end('Not found')
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'image/jpeg')
      res.setHeader('Cache-Control', 'public, max-age=86400')
      res.end(readFileSync(path))
      return
    }

    const pathOnly = url.split('?')[0].replace(/\.php$/, '')

    try {
      if (pathOnly === '/api/seller/register' && req.method === 'POST') {
        const body = await readBody(req)
        const shopName = String(body.shopName || '').trim()
        const ownerName = String(body.ownerName || '').trim()
        const email = String(body.email || '').trim().toLowerCase()
        let phone = String(body.phone || '').replace(/\D/g, '')
        if (phone.length > 10) phone = phone.slice(-10)
        const password = String(body.password || '')

        if (shopName.length < 2) {
          sendJson(res, 400, { ok: false, message: 'Shop name required' })
          return
        }
        if (!ownerName) {
          sendJson(res, 400, { ok: false, message: 'Owner name required' })
          return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          sendJson(res, 400, { ok: false, message: 'Valid email required' })
          return
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {
          sendJson(res, 400, { ok: false, message: 'Valid 10-digit mobile required' })
          return
        }
        if (password.length < 6) {
          sendJson(res, 400, {
            ok: false,
            message: 'Password must be at least 6 characters',
          })
          return
        }

        const sellers = readStore<Seller[]>('sellers.json', [])
        if (sellers.some((s) => s.email === email)) {
          sendJson(res, 409, { ok: false, message: 'Email already registered' })
          return
        }
        if (sellers.some((s) => s.phone === phone)) {
          sendJson(res, 409, { ok: false, message: 'Mobile already registered' })
          return
        }

        const seller: Seller = {
          id: `sel-${slug(shopName)}-${randomBytes(4).toString('hex')}`,
          shopName,
          ownerName,
          email,
          phone,
          passwordHash: hashPassword(password),
          token: token(),
          payoutUpi: String(body.payoutUpi || '').trim(),
          createdAt: Date.now(),
        }
        sellers.push(seller)
        writeStore('sellers.json', sellers)
        sendJson(res, 201, {
          ok: true,
          message: 'Seller account created',
          token: seller.token,
          seller: publicSeller(seller),
        })
        return
      }

      if (pathOnly === '/api/seller/login' && req.method === 'POST') {
        const body = await readBody(req)
        const login = String(body.email || body.login || '')
          .trim()
          .toLowerCase()
        const password = String(body.password || '')
        const sellers = readStore<Seller[]>('sellers.json', [])
        const digits = login.replace(/\D/g, '')
        const idx = sellers.findIndex(
          (s) =>
            s.email === login ||
            s.phone === login ||
            s.phone === digits.slice(-10),
        )
        if (idx < 0 || !verifyPassword(password, sellers[idx].passwordHash)) {
          sendJson(res, 401, { ok: false, message: 'Invalid email or password' })
          return
        }
        sellers[idx].token = token()
        writeStore('sellers.json', sellers)
        sendJson(res, 200, {
          ok: true,
          message: 'Logged in',
          token: sellers[idx].token,
          seller: publicSeller(sellers[idx]),
        })
        return
      }

      if (pathOnly === '/api/seller/me' && req.method === 'GET') {
        const seller = authSeller(req)
        if (!seller) {
          sendJson(res, 401, { ok: false, message: 'Login required' })
          return
        }
        sendJson(res, 200, { ok: true, seller: publicSeller(seller) })
        return
      }

      if (pathOnly === '/api/seller/moderate' && req.method === 'POST') {
        const token = String(req.headers['x-admin-token'] || '')
        const secret =
          env.ADMIN_SALT || env.ADMIN_PASSWORD || ''
        const [exp, sig] = token.split('.')
        let ok = false
        if (exp && sig && Number(exp) > Math.floor(Date.now() / 1000)) {
          const expected = createHmac('sha256', secret)
            .update(exp)
            .digest('hex')
          try {
            ok = timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
          } catch {
            ok = false
          }
        }
        if (!ok) {
          sendJson(res, 401, { ok: false, message: 'Admin login required' })
          return
        }
        const body = await readBody(req)
        const id = String(body.id || '')
        const action = String(body.action || '')
        if (!id || !['approve', 'reject'].includes(action)) {
          sendJson(res, 400, {
            ok: false,
            message: 'id and action (approve|reject) required',
          })
          return
        }
        const products = readStore<SellerProduct[]>('products.json', [])
        const found = products.find((p) => p.id === id)
        if (!found) {
          sendJson(res, 404, { ok: false, message: 'Product not found' })
          return
        }
        found.status = action === 'approve' ? 'approved' : 'rejected'
        writeStore('products.json', products)
        sendJson(res, 200, { ok: true, product: found })
        return
      }

      if (pathOnly === '/api/seller/products') {
        if (req.method === 'GET') {
          const mine = url.includes('mine=1')
          const adminScope = url.includes('scope=admin')
          let products = readStore<SellerProduct[]>('products.json', [])
          if (adminScope) {
            const token = String(req.headers['x-admin-token'] || '')
            const secret = env.ADMIN_SALT || env.ADMIN_PASSWORD || ''
            const [exp, sig] = token.split('.')
            let ok = false
            if (exp && sig && Number(exp) > Math.floor(Date.now() / 1000)) {
              const expected = createHmac('sha256', secret)
                .update(exp)
                .digest('hex')
              try {
                ok = timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
              } catch {
                ok = false
              }
            }
            if (!ok) {
              sendJson(res, 401, {
                ok: false,
                message: 'Admin login required',
              })
              return
            }
            sendJson(res, 200, { ok: true, products })
            return
          }
          if (mine) {
            const seller = authSeller(req)
            if (!seller) {
              sendJson(res, 401, { ok: false, message: 'Login required' })
              return
            }
            products = products.filter((p) => p.sellerId === seller.id)
          } else {
            products = products.filter(
              (p) => (p.status || 'approved') === 'approved',
            )
          }
          sendJson(res, 200, { ok: true, products })
          return
        }

        const seller = authSeller(req)
        if (!seller) {
          sendJson(res, 401, { ok: false, message: 'Login required' })
          return
        }

        if (req.method === 'POST' || req.method === 'PUT') {
          const body = await readBody(req)
          const existingId = String(body.id || '').trim()
          const name = String(body.name || '').trim()
          const price = Number(body.price || 0)
          let was = Number(body.was || price)
          const gender = String(body.gender || 'men')
          const subtype = String(body.subtype || '')
          const description = String(body.description || '').trim()
          const fabric = String(body.fabric || '').trim()
          const fit = String(body.fit || '').trim()
          const wash = String(body.wash || '').trim()
          const topDeal = Boolean(body.topDeal)
          const imagesIn = Array.isArray(body.images) ? body.images : []

          if (!name) {
            sendJson(res, 400, { ok: false, message: 'Product name required' })
            return
          }
          if (gender !== 'men' && gender !== 'women') {
            sendJson(res, 400, { ok: false, message: 'Select Men or Women' })
            return
          }
          if (
            !['tshirts', 'shirts', 'sarees', 'jeans', 'dresses'].includes(
              subtype,
            )
          ) {
            sendJson(res, 400, { ok: false, message: 'Select a product type' })
            return
          }
          if (
            gender === 'men' &&
            (subtype === 'sarees' || subtype === 'dresses')
          ) {
            sendJson(res, 400, {
              ok: false,
              message: 'Sarees and dresses belong in Women',
            })
            return
          }
          if (price <= 0) {
            sendJson(res, 400, { ok: false, message: 'Valid price required' })
            return
          }
          if (was < price) was = price
          if (imagesIn.length < 1) {
            sendJson(res, 400, {
              ok: false,
              message: 'Upload at least 1 product photo',
            })
            return
          }

          const products = readStore<SellerProduct[]>('products.json', [])
          const id =
            existingId ||
            `seller-${slug(name)}-${randomBytes(4).toString('hex')}`

          if (existingId) {
            const prev = products.find((p) => p.id === existingId)
            if (!prev) {
              sendJson(res, 404, { ok: false, message: 'Product not found' })
              return
            }
            if (prev.sellerId !== seller.id) {
              sendJson(res, 403, { ok: false, message: 'Not your product' })
              return
            }
          }

          const savedImages: string[] = []
          imagesIn.slice(0, 4).forEach((img, i) => {
            const path = saveImage(String(img), `${id}-${i}`)
            if (path) savedImages.push(path)
          })
          if (!savedImages.length) {
            sendJson(res, 400, {
              ok: false,
              message: 'Could not save product photos',
            })
            return
          }

          const product: SellerProduct = {
            id,
            rank: 1,
            name,
            price: Math.round(price),
            was: Math.round(was),
            topDeal,
            tab: gender,
            gender,
            subtype,
            collection:
              subtype === 'jeans'
                ? gender === 'men'
                  ? 'mens-jeans'
                  : 'womens-jeans'
                : subtype === 'dresses'
                  ? 'womens-dresses'
                  : undefined,
            categoryName: gender === 'men' ? 'Men' : 'Women',
            brand: seller.shopName,
            image: savedImages[0],
            images: savedImages.slice(1),
            description: description || undefined,
            sizes: sizes(subtype),
            fabric: fabric || undefined,
            fit: subtype === 'jeans' && fit ? fit : undefined,
            wash: subtype === 'jeans' && wash ? wash : undefined,
            sku:
              String(
                products.find((p) => p.id === id)?.sku ||
                  `SL-${createHash('md5').update(id).digest('hex').slice(0, 6).toUpperCase()}`,
              ),
            source: 'seller',
            sellerId: seller.id,
            sellerShop: seller.shopName,
            uploadedBy: 'Seller' as const,
            uploadedAt:
              String(products.find((p) => p.id === id)?.uploadedAt || '') ||
              new Date().toISOString(),
            status: 'pending',
          }

          const idx = products.findIndex((p) => p.id === id)
          if (idx >= 0) products[idx] = product
          else products.unshift(product)
          writeStore('products.json', products)
          sendJson(res, existingId ? 200 : 201, {
            ok: true,
            message: existingId
              ? 'Product updated — pending admin approval'
              : 'Product submitted — pending admin approval',
            product,
          })
          return
        }

        if (req.method === 'DELETE') {
          const body = await readBody(req)
          const q = new URL(url, 'http://local').searchParams.get('id') || ''
          const id = String(body.id || q || '').trim()
          if (!id) {
            sendJson(res, 400, { ok: false, message: 'Product id required' })
            return
          }
          const products = readStore<SellerProduct[]>('products.json', [])
          const prev = products.find((p) => p.id === id)
          if (!prev) {
            sendJson(res, 404, { ok: false, message: 'Product not found' })
            return
          }
          if (prev.sellerId !== seller.id) {
            sendJson(res, 403, { ok: false, message: 'Not your product' })
            return
          }
          writeStore(
            'products.json',
            products.filter((p) => p.id !== id),
          )
          sendJson(res, 200, { ok: true, message: 'Product deleted' })
          return
        }
      }

      sendJson(res, 404, { ok: false, message: 'Not found' })
    } catch (err) {
      console.error('seller API error', err)
      sendJson(res, 500, { ok: false, message: 'Server error' })
    }
  }
}

export function sellerApiPlugin(): Plugin {
  return {
    name: 'fusora-seller-api',
    configResolved(config) {
      env = loadEnv(config.mode, config.root, '')
    },
    configureServer(server) {
      server.middlewares.use(sellerApiMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(sellerApiMiddleware())
    },
  }
}
