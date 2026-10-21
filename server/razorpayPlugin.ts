/**
 * Vite middleware: Razorpay Standard Checkout API
 * Mirrors hostinger/api/razorpay/*.php for local dev.
 * KEY_SECRET is read from .env on the server only — never sent to browser
 * (except key_id, which is public by design and returned by create-order).
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import RazorpayImport from 'razorpay'
import type { Connect, Plugin } from 'vite'
import { loadEnv } from 'vite'

// razorpay SDK is CommonJS; normalize default interop
const Razorpay =
  (RazorpayImport as unknown as { default?: typeof RazorpayImport }).default ||
  RazorpayImport

type RazorpayInstance = InstanceType<typeof Razorpay>

let client: RazorpayInstance | null = null

function getClient(env: Record<string, string>): RazorpayInstance | null {
  const keyId = env.RAZORPAY_KEY_ID || ''
  const keySecret = env.RAZORPAY_KEY_SECRET || ''
  if (!keyId || !keySecret) return null
  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return client
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

function safeEqual(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

function middleware(env: Record<string, string>): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url || ''
    if (!url.startsWith('/api/razorpay/')) return next()

    const pathOnly = url.split('?')[0].replace(/\.php$/, '')

    try {
      if (pathOnly === '/api/razorpay/create-order' && req.method === 'POST') {
        const keyId = env.RAZORPAY_KEY_ID || ''
        const rzp = getClient(env)
        if (!rzp) {
          sendJson(res, 500, {
            ok: false,
            message: 'Razorpay keys not configured on server (.env)',
          })
          return
        }
        const body = await readBody(req)
        const amount = Math.round(Number(body.amount || 0))
        const currency = String(body.currency || 'INR').toUpperCase()
        const receiptRaw = String(body.receipt || `fus_${Date.now()}`)
        const receipt = receiptRaw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)

        if (amount < 100) {
          sendJson(res, 400, {
            ok: false,
            message: 'Minimum amount is 100 paise (₹1)',
          })
          return
        }
        if (currency !== 'INR') {
          sendJson(res, 400, { ok: false, message: 'Only INR is supported' })
          return
        }

        try {
          const order = await rzp.orders.create({
            amount,
            currency,
            receipt,
            payment_capture: true,
          })
          sendJson(res, 200, {
            ok: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: keyId,
          })
        } catch (err) {
          const e = err as {
            statusCode?: number
            error?: { description?: string }
          }
          if (e.statusCode === 401) {
            sendJson(res, 401, {
              ok: false,
              message: 'Razorpay authentication failed. Check Key ID / Secret.',
            })
            return
          }
          console.error('Razorpay create-order failed', err)
          sendJson(res, 500, {
            ok: false,
            message:
              e.error?.description || 'Razorpay order creation failed',
          })
        }
        return
      }

      if (pathOnly === '/api/razorpay/verify-payment' && req.method === 'POST') {
        const keySecret = env.RAZORPAY_KEY_SECRET || ''
        if (!keySecret) {
          sendJson(res, 500, {
            ok: false,
            message: 'Razorpay keys not configured on server (.env)',
          })
          return
        }
        const body = await readBody(req)
        const paymentId = String(body.razorpay_payment_id || '').trim()
        const orderId = String(body.razorpay_order_id || '').trim()
        const signature = String(body.razorpay_signature || '').trim()

        if (!paymentId || !orderId || !signature) {
          sendJson(res, 400, {
            ok: false,
            message:
              'razorpay_payment_id, razorpay_order_id and razorpay_signature are required',
          })
          return
        }

        const expected = createHmac('sha256', keySecret)
          .update(`${orderId}|${paymentId}`)
          .digest('hex')

        if (!safeEqual(expected, signature)) {
          sendJson(res, 400, {
            ok: false,
            verified: false,
            message: 'Payment signature verification failed',
          })
          return
        }

        sendJson(res, 200, {
          ok: true,
          verified: true,
          message: 'Payment verified',
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
        })
        return
      }

      if (pathOnly === '/api/razorpay/create-qr' && req.method === 'POST') {
        const keyId = env.RAZORPAY_KEY_ID || ''
        const keySecret = env.RAZORPAY_KEY_SECRET || ''
        if (!keyId || !keySecret) {
          sendJson(res, 500, {
            ok: false,
            message: 'Razorpay keys not configured on server (.env)',
          })
          return
        }
        const body = await readBody(req)
        const amount = Math.round(Number(body.amount || 0))
        const receiptRaw = String(body.receipt || `fus_${Date.now()}`)
        const receipt = receiptRaw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
        if (amount < 100) {
          sendJson(res, 400, {
            ok: false,
            message: 'Minimum amount is 100 paise (₹1)',
          })
          return
        }
        try {
          const resp = await fetch(
            'https://api.razorpay.com/v1/payments/qr_codes',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
              },
              body: JSON.stringify({
                type: 'upi_qr',
                name: 'Fusora Order',
                usage: 'single_use',
                fixed_amount: true,
                payment_amount: amount,
                description: `Fusora order payment ${receipt}`,
                notes: { receipt, source: 'fusora-web' },
              }),
            },
          )
          const data = (await resp.json().catch(() => ({}))) as {
            id?: string
            image_url?: string
            status?: string
            error?: { description?: string }
          }
          if (resp.status === 401) {
            sendJson(res, 401, {
              ok: false,
              message: 'Razorpay authentication failed. Check Key ID / Secret.',
            })
            return
          }
          if (!resp.ok || !data.id || !data.image_url) {
            sendJson(res, 500, {
              ok: false,
              message: data.error?.description || 'Razorpay QR creation failed',
            })
            return
          }
          sendJson(res, 200, {
            ok: true,
            qr_id: data.id,
            image_url: data.image_url,
            amount,
            currency: 'INR',
            status: data.status || 'active',
          })
        } catch (err) {
          console.error('Razorpay create-qr failed', err)
          sendJson(res, 500, { ok: false, message: 'Razorpay QR request failed' })
        }
        return
      }

      if (
        pathOnly === '/api/razorpay/qr-status' &&
        (req.method === 'GET' || req.method === 'POST')
      ) {
        const keyId = env.RAZORPAY_KEY_ID || ''
        const keySecret = env.RAZORPAY_KEY_SECRET || ''
        if (!keyId || !keySecret) {
          sendJson(res, 500, {
            ok: false,
            message: 'Razorpay keys not configured on server (.env)',
          })
          return
        }
        const parsed = new URL(url, 'http://localhost')
        let qrId = (parsed.searchParams.get('qr_id') || '').trim()
        if (!qrId && req.method === 'POST') {
          const body = await readBody(req)
          qrId = String(body.qr_id || '').trim()
        }
        if (!/^qr_[A-Za-z0-9]+$/.test(qrId)) {
          sendJson(res, 400, { ok: false, message: 'Valid qr_id is required' })
          return
        }
        const auth = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
        try {
          const payResp = await fetch(
            `https://api.razorpay.com/v1/payments/qr_codes/${encodeURIComponent(qrId)}/payments`,
            { headers: { Authorization: auth } },
          )
          const payData = (await payResp.json().catch(() => ({}))) as {
            items?: Array<{ id?: string; status?: string }>
          }
          const qrResp = await fetch(
            `https://api.razorpay.com/v1/payments/qr_codes/${encodeURIComponent(qrId)}`,
            { headers: { Authorization: auth } },
          )
          const qrData = (await qrResp.json().catch(() => ({}))) as {
            status?: string
            payments_amount_received?: number
          }
          const captured = (payData.items || []).find(
            (p) => p.status === 'captured',
          )
          sendJson(res, 200, {
            ok: true,
            qr_id: qrId,
            paid: Boolean(captured),
            payment_id: captured?.id || null,
            status: qrData.status || null,
            payments_count: (payData.items || []).length,
            amount_paid: qrData.payments_amount_received || 0,
          })
        } catch (err) {
          console.error('Razorpay qr-status failed', err)
          sendJson(res, 500, { ok: false, message: 'Razorpay QR status failed' })
        }
        return
      }

      sendJson(res, 404, { ok: false, message: 'Not found' })
    } catch (err) {
      console.error('razorpay API error', err)
      sendJson(res, 500, { ok: false, message: 'Server error' })
    }
  }
}

export function razorpayApiPlugin(): Plugin {
  let env: Record<string, string> = {}
  return {
    name: 'fusora-razorpay-api',
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
