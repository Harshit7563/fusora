import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  /** Light treatment for dark surfaces */
  onDark?: boolean
  /** Center wordmark as one brand lockup */
  centered?: boolean
}

/** Cache-bust when logo asset is updated */
const LOGO_SRC = '/fusora-logo.png?v=3'

export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const sizeClass = compact
    ? 'h-7 w-auto max-w-[7.5rem] sm:h-8 sm:max-w-[8.5rem]'
    : centered
      ? 'h-10 w-auto max-w-[11rem] sm:h-12 md:h-14'
      : 'h-9 w-auto max-w-[10rem] sm:h-11'

  return (
    <Link
      to="/"
      className={`inline-flex max-w-full items-center leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <img
        src={LOGO_SRC}
        alt="Fusora"
        className={`${sizeClass} object-contain object-center ${
          onDark ? 'brightness-0 invert' : ''
        }`}
        decoding="async"
      />
    </Link>
  )
}
