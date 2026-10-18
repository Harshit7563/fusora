import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

const LOGO_SRC = '/fusora-logo.svg?v=5'

export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const sizeClass = compact
    ? 'h-10 w-auto max-w-[11.5rem] sm:h-11 sm:max-w-[13rem] lg:h-12 lg:max-w-[14.5rem]'
    : 'h-12 w-auto max-w-[14rem] sm:h-14 sm:max-w-[17rem]'

  return (
    <Link
      to="/"
      className={`inline-flex max-w-full flex-col items-center leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <img
        src={LOGO_SRC}
        alt="Fusora"
        className={`${sizeClass} object-contain object-left ${
          onDark ? 'brightness-0 invert' : ''
        }`}
        decoding="async"
      />
    </Link>
  )
}
