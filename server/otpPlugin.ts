import { createHash, randomInt, randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import { loadEnv } from 'vite'

type OtpSession = {
  phone: string
  otpHash: string
  expiresAt: number
  verified: boolean
}

const sessions = new Map<string, OtpSession>()
const OTP_TTL_MS = 5 * 60 * 1000

function normalizePhone(raw: string): string | null {
  const digits = String(raw || '').replace(/\D+/g, '')
  const phone = digits.length > 10 ? digits.slice(-10) : digits
  if (!/^[6-9]\d{9}$/.test(phone)) return null
  return phone
}

function hashOtp(otp: string, phone: string) {
  return createHash('sha256').update(`${phone}:${otp}`).digest('hex')
}

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(Buffer.from(c)))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(
  res: ServerResponse,
  status: number,
  body: Record<string, unknown>,
) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

/**
 * Zone Digital mobile OTP via Anilax AuthSecure
 * GET {SMS_API_URL}?number={10digit}&otp={otp}&api_key={SMS_API_KEY}
 * Same contract as zondigital Sms_model::send_otp
 */
async function sendZoneDigitalOtp(
  apiUrl: string,
  apiKey: string,
  phone: string,
  otp: string,
) {
  const url = `${apiUrl}?${new URLSearchParams({
    number: phone,
    otp,
    api_key: apiKey,
  }).toString()}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  const text = await res.text()
  let decoded: { status?: boolean | number | string; message?: string } | null =
    null
  try {
    decoded = JSON.parse(text) as {
      status?: boolean | number | string
      message?: string
    }
  } catch {
    decoded = null
  }

  const success = Boolean(
    decoded &&
      (decoded.status === true ||
        decoded.status === 1 ||
        decoded.status === '1' ||
        decoded.status === 'success' ||
        String(decoded.status).toLowerCase() === 'true'),
  )

  return {
    success,
    message:
      decoded?.message ||
      (success ? 'OTP sent via Zone Digital' : 'Zone Digital SMS failed'),
    raw: text,
  }
}

function createOtpMiddleware(root: string, mode: string) {
  const env = loadEnv(mode, root, '')
  const apiUrl =
    env.SMS_API_URL ||
    'https://authsecure.anilaxpayments.com/api/Sms_api/send'
  const apiKey = env.SMS_API_KEY || ''

  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (!req.url?.startsWith('/api/otp/')) return next()

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { ok: false, message: 'Method not allowed' })
      return
    }

    try {
      const body = await readJson(req)

      if (req.url.startsWith('/api/otp/send')) {
        if (!apiKey) {
          sendJson(res, 500, {
            ok: false,
            message: 'SMS_API_KEY missing in .env (Zone Digital / Anilax)',
          })
          return
        }

        const phone = normalizePhone(String(body.phone || ''))
        if (!phone) {
          sendJson(res, 400, {
            ok: false,
            message: 'Enter a valid 10-digit Indian mobile number',
          })
          return
        }

        const otp = String(randomInt(1111, 9999))
        const sms = await sendZoneDigitalOtp(apiUrl, apiKey, phone, otp)
        if (!sms.success) {
          sendJson(res, 502, {
            ok: false,
            message: sms.message || 'Zone Digital SMS gateway failed',
          })
          return
        }

        const sessionId = randomUUID()
        sessions.set(sessionId, {
          phone,
          otpHash: hashOtp(otp, phone),
          expiresAt: Date.now() + OTP_TTL_MS,
          verified: false,
        })

        sendJson(res, 200, {
          ok: true,
          sessionId,
          message: `OTP sent to ******${phone.slice(-4)} via Zone Digital`,
          masked: `******${phone.slice(-4)}`,
          provider: 'zone-digital',
        })
        return
      }

      if (req.url.startsWith('/api/otp/verify')) {
        const sessionId = String(body.sessionId || '')
        const otp = String(body.otp || '').trim()
        const phone = normalizePhone(String(body.phone || ''))
        const session = sessions.get(sessionId)

        if (!session || !phone || session.phone !== phone) {
          sendJson(res, 400, { ok: false, message: 'Invalid OTP session' })
          return
        }
        if (Date.now() > session.expiresAt) {
          sessions.delete(sessionId)
          sendJson(res, 400, {
            ok: false,
            message: 'OTP expired. Please resend.',
          })
          return
        }
        if (session.otpHash !== hashOtp(otp, phone)) {
          sendJson(res, 400, { ok: false, message: 'Incorrect OTP' })
          return
        }

        session.verified = true
        sessions.set(sessionId, session)
        sendJson(res, 200, {
          ok: true,
          message: 'Mobile number verified',
          verified: true,
          provider: 'zone-digital',
        })
        return
      }

      sendJson(res, 404, { ok: false, message: 'Not found' })
    } catch (err) {
      sendJson(res, 500, {
        ok: false,
        message: err instanceof Error ? err.message : 'Server error',
      })
    }
  }
}

/** Vite middleware: Zone Digital (Anilax AuthSecure) mobile OTP */
export function otpApiPlugin(): Plugin {
  return {
    name: 'fusora-otp-api',
    configureServer(server) {
      server.middlewares.use(
        createOtpMiddleware(server.config.root, server.config.mode),
      )
    },
    configurePreviewServer(server) {
      server.middlewares.use(
        createOtpMiddleware(server.config.root, server.config.mode),
      )
    },
  }
}
