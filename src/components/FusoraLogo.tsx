import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  /** Light wordmark for dark surfaces */
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
      className={`inline-flex max-w-full flex-col leading-none ${
        centered ? 'items-center text-center' : 'items-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span
        className={`font-serif tracking-[0.08em] uppercase ${
          centered
            ? 'text-[1.45rem] sm:text-[1.7rem] md:text-[1.9rem]'
            : 'text-[1.5rem] sm:text-[1.75rem]'
        } ${onDark ? 'text-white' : 'text-bb-blue'} ${
          compact ? '!text-[1.35rem] tracking-[0.06em]' : ''
        }`}
      >
        Fusora
      </span>
      {!compact && (
        <span
          className={`mt-1 hidden text-[0.58rem] tracking-[0.28em] uppercase sm:inline ${
            onDark ? 'text-white/75' : 'text-bb-muted'
          }`}
        >
          Heritage · Craft · Style
        </span>
      )}
    </Link>
  )
}
