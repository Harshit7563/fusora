import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

const LOGO_SRC = '/fusora-logo.png?v=3'

export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const sizeClass = compact
    ? 'h-8 w-auto max-w-[8.5rem] sm:h-9 sm:max-w-[9.5rem]'
    : 'h-9 w-auto max-w-[10rem] sm:h-11'

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
        className={`${sizeClass} object-contain object-center ${
          onDark ? 'brightness-0 invert' : ''
        }`}
        decoding="async"
      />
    </Link>
  )
}
