/** Compress browser file uploads to compact JPEG data URLs for admin catalog. */

const MAX_EDGE = 900
const JPEG_QUALITY = 0.62
/** Soft cap per image (~180KB data URL) — re-compress harder if needed. */
const MAX_DATA_URL_CHARS = 180_000

export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Only image files are allowed.'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read image.'))
    reader.onload = () => {
      const raw = String(reader.result || '')
      compressDataUrl(raw)
        .then(resolve)
        .catch(() => resolve(raw))
    }
    reader.readAsDataURL(file)
  })
}

export function compressDataUrl(
  dataUrl: string,
  edge = MAX_EDGE,
  quality = JPEG_QUALITY,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, edge / Math.max(img.width, img.height))
      const w = Math.max(1, Math.round(img.width * scale))
      const h = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      try {
        let out = canvas.toDataURL('image/jpeg', quality)
        // Progressive shrink if still too large for storage comfort.
        let q = quality
        let e = edge
        while (out.length > MAX_DATA_URL_CHARS && (q > 0.4 || e > 480)) {
          if (q > 0.4) q = Math.max(0.4, q - 0.08)
          else e = Math.max(480, Math.round(e * 0.85))
          const s = Math.min(1, e / Math.max(img.width, img.height))
          canvas.width = Math.max(1, Math.round(img.width * s))
          canvas.height = Math.max(1, Math.round(img.height * s))
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          out = canvas.toDataURL('image/jpeg', q)
        }
        resolve(out)
      } catch {
        resolve(dataUrl)
      }
    }
    img.onerror = () => reject(new Error('Invalid image.'))
    img.src = dataUrl
  })
}

export async function filesToDataUrls(
  files: FileList | File[],
  limit: number,
): Promise<string[]> {
  const list = Array.from(files).slice(0, limit)
  const out: string[] = []
  for (const file of list) {
    out.push(await readImageAsDataUrl(file))
  }
  return out
}
