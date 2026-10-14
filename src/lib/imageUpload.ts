/** Compress browser file uploads to JPEG data URLs for localStorage admin catalog. */

const MAX_EDGE = 1200
const JPEG_QUALITY = 0.78

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

export function compressDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
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
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
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
