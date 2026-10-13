/** Runtime + build-time Google OAuth / EmailJS config */
export type FusoraRuntimeConfig = {
  googleClientId?: string
  emailjs?: {
    serviceId: string
    templateId: string
    publicKey: string
  }
}

declare global {
  interface Window {
    __FUSORA__?: FusoraRuntimeConfig
    google?: {
      accounts: {
        id: {
          initialize: (cfg: Record<string, unknown>) => void
          prompt: (cb?: (n: { isNotDisplayed: () => boolean }) => void) => void
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void
          cancel: () => void
        }
        oauth2: {
          initTokenClient: (cfg: {
            client_id: string
            scope: string
            callback: (resp: {
              access_token?: string
              error?: string
              error_description?: string
            }) => void
            error_callback?: (err: { type?: string; message?: string }) => void
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void }
        }
      }
    }
  }
}

export function getGoogleClientId(): string {
  const runtime = window.__FUSORA__?.googleClientId?.trim()
  if (runtime) return runtime
  const env = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
  return env
}

export type GoogleProfile = {
  email: string
  name: string
  picture?: string
  sub?: string
}

let scriptPromise: Promise<void> | null = null

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[data-fusora-google]',
    ) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google script')),
      )
      if (window.google?.accounts?.oauth2) resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.fusoraGoogle = '1'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google script'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function requestGoogleProfile(): Promise<GoogleProfile> {
  const clientId = getGoogleClientId()
  if (!clientId) {
    throw new Error(
      'Google Client ID missing. Add VITE_GOOGLE_CLIENT_ID or set it in /config.js',
    )
  }

  await loadGoogleIdentityScript()
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Sign-In failed to initialise')
  }

  const accessToken = await new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(
            new Error(
              resp.error_description ||
                resp.error ||
                'Google sign-in was cancelled',
            ),
          )
          return
        }
        resolve(resp.access_token)
      },
      error_callback: (err) => {
        reject(new Error(err.message || err.type || 'Google sign-in failed'))
      },
    })
    client.requestAccessToken({ prompt: 'select_account' })
  })

  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Could not fetch Google profile')
  const data = (await res.json()) as {
    email?: string
    name?: string
    picture?: string
    sub?: string
  }
  if (!data.email) throw new Error('Google account has no email')

  return {
    email: data.email,
    name: data.name || data.email.split('@')[0] || 'Google user',
    picture: data.picture,
    sub: data.sub,
  }
}
