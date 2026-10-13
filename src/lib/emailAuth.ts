import emailjs from '@emailjs/browser'
import type { FusoraRuntimeConfig } from './googleAuth'

type EmailJsConfig = NonNullable<FusoraRuntimeConfig['emailjs']>

const OTP_SESSION_KEY = 'fusora-email-otp'

type OtpSession = {
  email: string
  code: string
  expiresAt: number
  verified: boolean
}

function getConfig(): EmailJsConfig | null {
  const c = window.__FUSORA__?.emailjs
  if (!c?.serviceId || !c?.templateId || !c?.publicKey) return null
  return c
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function readSession(): OtpSession | null {
  try {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OtpSession
  } catch {
    return null
  }
}

function writeSession(session: OtpSession | null) {
  if (!session) {
    sessionStorage.removeItem(OTP_SESSION_KEY)
    return
  }
  sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session))
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function formatExpiry(date: Date) {
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export async function sendEmailOtp(
  emailRaw: string,
  name = 'Customer',
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const email = normalizeEmail(emailRaw)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' }
  }

  const config = getConfig()
  if (!config) {
    return {
      ok: false,
      message: 'Email login is not configured. Please try again later.',
    }
  }

  const code = generateOtp()
  const expiresAt = Date.now() + 15 * 60 * 1000
  const expiry = new Date(expiresAt)

  try {
    await emailjs.send(
      config.serviceId,
      config.templateId,
      {
        passcode: code,
        time: formatExpiry(expiry),
        email,
        to_email: email,
        name,
      },
      { publicKey: config.publicKey },
    )
  } catch (err) {
    console.error('EmailJS send failed', err)
    return {
      ok: false,
      message: 'Could not send OTP email. Check EmailJS setup and try again.',
    }
  }

  writeSession({ email, code, expiresAt, verified: false })
  return { ok: true, message: `OTP sent to ${email}` }
}

export function verifyEmailOtp(
  emailRaw: string,
  otpRaw: string,
): { ok: true; message: string } | { ok: false; message: string } {
  const email = normalizeEmail(emailRaw)
  const otp = otpRaw.replace(/\D/g, '')
  const session = readSession()

  if (!session || session.email !== email) {
    return { ok: false, message: 'Request a new OTP for this email first.' }
  }
  if (Date.now() > session.expiresAt) {
    writeSession(null)
    return { ok: false, message: 'OTP expired. Please request a new one.' }
  }
  if (otp.length < 4 || otp !== session.code) {
    return { ok: false, message: 'Incorrect OTP. Please try again.' }
  }

  writeSession({ ...session, verified: true })
  return { ok: true, message: 'Email verified' }
}

export function isEmailOtpVerified(emailRaw: string): boolean {
  const email = normalizeEmail(emailRaw)
  const session = readSession()
  if (!session || session.email !== email || !session.verified) return false
  if (Date.now() > session.expiresAt) {
    writeSession(null)
    return false
  }
  return true
}

export function clearEmailOtpSession() {
  writeSession(null)
}
