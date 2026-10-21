import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

/** Fusora wordmark: black FUSORA with signature red O. Works on light & dark. */
export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const wordSize = compact
    ? 'text-[1.65rem] sm:text-[1.85rem]'
    : 'text-[2rem] sm:text-[2.3rem]'

  return (
    <Link
      to="/"
      className={`group inline-flex max-w-full flex-col leading-none ${
        centered ? 'items-center' : 'items-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span
        className={`font-logo ${wordSize} font-black tracking-[0.04em] uppercase leading-[0.95] ${
          onDark ? 'text-white' : 'text-[#141414]'
        }`}
      >
        Fus
        <span
          className={`text-[#cf2028] transition ${
            onDark ? 'group-hover:text-white' : 'group-hover:text-[#141414]'
          }`}
        >
          o
        </span>
        ra
      </span>
      {!compact && (
        <span
          className={`mt-1.5 text-[0.52rem] font-bold tracking-[0.42em] uppercase ${
            onDark ? 'text-white/60' : 'text-[#8a8585]'
          }`}
        >
          Everyday Fashion
        </span>
      )}
    </Link>
  )
}
