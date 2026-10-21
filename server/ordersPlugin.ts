/**
 * Vite middleware: Admin auth + server-side Orders store (dev mirror of
 * hostinger/api/admin/*.php and hostinger/api/orders/*.php).
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import type { Connect, Plugin } from 'vite'
import { loadEnv } from 'vite'

type OrderRecord = Record<string, unknown> & { id: string }

const DATA_DIR = join(process.cwd(), '.data')
const ORDERS_FILE = join(DATA_DIR, 'orders.json')

function loadOrders(): OrderRecord[] {
  try {
    if (!existsSync(ORDERS_FILE)) return []
    const parsed = JSON.parse(readFileSync(ORDERS_FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveOrders(orders: OrderRecord[]) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(ORDERS_FILE, JSON.stringify(orders))
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readBody(
  req: IncomingMessage,
): Promise<Record<string, unknown>> {
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

function issueToken(secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600
  const sig = createHmac('sha256', secret).update(String(exp)).digest('hex')
  return `${exp}.${sig}`
}

function validToken(token: string, secret: string): boolean {
  const [exp, sig] = token.split('.')
  if (!exp || !sig || Number(exp) < Math.floor(Date.now() / 1000)) return false
  const expected = createHmac('sha256', secret).update(exp).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

function middleware(env: Record<string, string>): Connect.NextHandleFunction {
  const adminPassword = env.ADMIN_PASSWORD || ''
  const tokenSecret = env.ADMIN_SALT || adminPassword

  return async (req, res, next) => {
    const url = req.url || ''
    const isAdmin = url.startsWith('/api/admin/')
    const isOrders = url.startsWith('/api/orders/')
    if (!isAdmin && !isOrders) return next()
    const pathOnly = url.split('?')[0].replace(/\.php$/, '')

    try {
      if (pathOnly === '/api/admin/login' && req.method === 'POST') {
        if (!adminPassword) {
          sendJson(res, 500, {
            ok: false,
            message: 'ADMIN_PASSWORD not configured in .env',
          })
          return
        }
        const body = await readBody(req)
        const candidate = createHash('sha256')
          .update(String(body.password || ''))
          .digest('hex')
        const expected = createHash('sha256')
          .update(adminPassword)
          .digest('hex')
        if (!timingSafeEqual(Buffer.from(candidate), Buffer.from(expected))) {
          sendJson(res, 401, { ok: false, message: 'Wrong password' })
          return
        }
        sendJson(res, 200, { ok: true, token: issueToken(tokenSecret) })
        return
      }

      if (pathOnly === '/api/orders/create' && req.method === 'POST') {
        const body = await readBody(req)
        const items = Array.isArray(body.items) ? body.items : []
        const phone = String(body.phone || '').replace(/\D/g, '').slice(-10)
        if (
          !body.id ||
          items.length === 0 ||
          Number(body.total || 0) <= 0 ||
          !body.name ||
          phone.length < 10
        ) {
          sendJson(res, 400, {
            ok: false,
            message: 'id, items, total, name and a valid phone are required',
          })
          return
        }
        const order: OrderRecord = {
          ...(body as OrderRecord),
          id: String(body.id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40),
          status: 'placed',
          phone,
          email: String(body.email || '').trim().toLowerCase(),
          createdAt: Number(body.createdAt || Date.now()),
        }
        const orders = loadOrders()
        const idx = orders.findIndex((o) => o.id === order.id)
        if (idx >= 0) orders[idx] = order
        else orders.unshift(order)
        saveOrders(orders)
        sendJson(res, 200, { ok: true, order })
        return
      }

      if (pathOnly === '/api/orders/list' && req.method === 'GET') {
        const parsed = new URL(url, 'http://localhost')
        const email = (parsed.searchParams.get('email') || '').toLowerCase()
        const phone = (parsed.searchParams.get('phone') || '')
          .replace(/\D/g, '')
          .slice(-10)
        if (!email && phone.length < 10) {
          sendJson(res, 400, {
            ok: false,
            message: 'email or phone is required',
          })
          return
        }
        const mine = loadOrders().filter(
          (o) =>
            (email && String(o.email || '').toLowerCase() === email) ||
            (phone.length >= 10 && String(o.phone || '') === phone),
        )
        sendJson(res, 200, { ok: true, orders: mine })
        return
      }

      if (isOrders && pathOnly !== '/api/orders/create' && pathOnly !== '/api/orders/list') {
        const token = String(req.headers['x-admin-token'] || '')
        if (!validToken(token, tokenSecret)) {
          sendJson(res, 401, { ok: false, message: 'Admin login required' })
          return
        }
        if (pathOnly === '/api/orders/all' && req.method === 'GET') {
          sendJson(res, 200, { ok: true, orders: loadOrders() })
          return
        }
        if (pathOnly === '/api/orders/status' && req.method === 'POST') {
          const body = await readBody(req)
          const allowed = [
            'placed',
            'confirmed',
            'packing',
            'ready',
            'out_for_delivery',
            'delivered',
            'cancelled',
          ]
          if (!body.id || !allowed.includes(String(body.status))) {
            sendJson(res, 400, {
              ok: false,
              message: 'Valid id and status are required',
            })
            return
          }
          const orders = loadOrders()
          const found = orders.find((o) => o.id === body.id)
          if (!found) {
            sendJson(res, 404, { ok: false, message: 'Order not found' })
            return
          }
          found.status = String(body.status)
          saveOrders(orders)
          sendJson(res, 200, { ok: true, order: found })
          return
        }
      }

      sendJson(res, 404, { ok: false, message: 'Not found' })
    } catch (err) {
      console.error('orders/admin API error', err)
      sendJson(res, 500, { ok: false, message: 'Server error' })
    }
  }
}

export function ordersApiPlugin(): Plugin {
  let env: Record<string, string> = {}
  return {
    name: 'fusora-orders-api',
    configResolved(config) {
      env = loadEnv(config.mode, config.root, '')
    },
    configureServer(server) {
      server.middlewares.use(middleware(env))
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(env))
    },
  }
}
