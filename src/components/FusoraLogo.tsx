import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

const LOGO_SRC = '/fusora-logo.png?v=4'

export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const sizeClass = compact
    ? 'h-11 w-auto max-w-[11rem] sm:h-12 sm:max-w-[13rem] lg:h-[3.25rem] lg:max-w-[14.5rem]'
    : 'h-12 w-auto max-w-[13rem] sm:h-14 sm:max-w-[16rem]'

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
        className={`${sizeClass} object-contain object-center contrast-125 brightness-[0.92] saturate-150 ${
          onDark ? 'brightness-0 invert contrast-100 saturate-100' : ''
        }`}
        decoding="async"
      />
    </Link>
  )
}
