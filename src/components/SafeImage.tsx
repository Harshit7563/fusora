import { useState, type ImgHTMLAttributes } from 'react'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <rect fill="#f0e6d8" width="600" height="800"/>
      <text x="50%" y="50%" fill="#7a6a62" font-family="system-ui,sans-serif" font-size="22" text-anchor="middle" dy=".3em">Image unavailable</text>
    </svg>`,
  )

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string
}

/** Product/CDN images with hotlink-safe referrer + broken-image fallback. */
export function SafeImage({
  src,
  alt = '',
  fallback = PLACEHOLDER,
  className = '',
  onError,
  ...rest
}: Props) {
  const [failed, setFailed] = useState(false)
  const current = !src || failed ? fallback : src

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      loading={rest.loading ?? 'lazy'}
      decoding="async"
      onError={(e) => {
        if (!failed) setFailed(true)
        onError?.(e)
      }}
    />
  )
}
