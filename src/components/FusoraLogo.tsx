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
    ? 'h-9 w-auto max-w-[min(42vw,9.5rem)] sm:h-12 sm:max-w-[13rem] lg:h-[3.35rem] lg:max-w-[15rem]'
    : centered
      ? 'h-12 w-auto max-w-[14rem] sm:h-16 md:h-[4.5rem]'
      : 'h-10 w-auto max-w-[12rem] sm:h-14'

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
          onDark ? 'brightness-110' : ''
        }`}
        decoding="async"
      />
    </Link>
  )
}
