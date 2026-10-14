import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  /** Light treatment for dark surfaces */
  onDark?: boolean
  /** Center wordmark as one brand lockup */
  centered?: boolean
}

export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  return (
    <Link
      to="/"
      className={`inline-flex max-w-full items-center leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <img
        src="/fusora-logo.png"
        alt="Fusora"
        className={`${
          compact
            ? 'h-8 w-auto sm:h-9'
            : centered
              ? 'h-10 w-auto sm:h-12 md:h-14'
              : 'h-9 w-auto sm:h-11'
        } object-contain ${onDark ? 'brightness-110' : ''}`}
        decoding="async"
      />
    </Link>
  )
}
