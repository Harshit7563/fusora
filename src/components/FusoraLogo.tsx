import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  /** Light wordmark for dark header */
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
        className={`font-serif tracking-[0.14em] uppercase sm:tracking-[0.18em] ${
          centered
            ? 'text-[1.25rem] sm:text-[1.55rem] md:text-[1.85rem]'
            : 'text-[1.45rem] sm:text-[1.85rem]'
        } ${onDark ? 'text-[#f7f3ec]' : 'text-bb-text'} ${
          compact ? '!text-xl tracking-[0.14em]' : ''
        }`}
      >
        Fusora
      </span>
      {!compact && (
        <span
          className={`mt-0.5 hidden text-[0.58rem] tracking-[0.28em] uppercase sm:mt-1 sm:inline ${
            onDark ? 'text-[#e8dfd0]/80' : 'text-bb-muted'
          }`}
        >
          Shop · Curate · Deliver
        </span>
      )}
    </Link>
  )
}
