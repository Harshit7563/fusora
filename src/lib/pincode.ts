export type PincodeResult =
  | {
      ok: true
      pincode: string
      city: string
      state: string
      area: string
    }
  | { ok: false; message: string }

/** Basic India PIN format: 6 digits, first digit 1–9 */
export function isValidPincodeFormat(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin.trim())
}

/**
 * Validate Indian pincode via India Post open API.
 * Falls back to format-only OK if the API is unreachable.
 */
export async function validatePincode(raw: string): Promise<PincodeResult> {
  const pincode = raw.trim()
  if (!isValidPincodeFormat(pincode)) {
    return { ok: false, message: 'Enter a valid 6-digit Indian pincode.' }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      { signal: controller.signal },
    ).finally(() => clearTimeout(timer))
    if (!res.ok) {
      return {
        ok: true,
        pincode,
        city: '',
        state: '',
        area: '',
      }
    }
    const data = (await res.json()) as Array<{
      Status?: string
      Message?: string
      PostOffice?: Array<{
        Name?: string
        District?: string
        State?: string
        Block?: string
      }> | null
    }>
    const row = data?.[0]
    if (!row || row.Status !== 'Success' || !row.PostOffice?.length) {
      return {
        ok: false,
        message: 'This pincode is not serviceable. Please check and try again.',
      }
    }
    const po = row.PostOffice[0]
    return {
      ok: true,
      pincode,
      city: po.District || '',
      state: po.State || '',
      area: po.Name || po.Block || '',
    }
  } catch {
    // Network blip — allow format-valid PIN so checkout isn't blocked offline
    return {
      ok: true,
      pincode,
      city: '',
      state: '',
      area: '',
    }
  }
}
