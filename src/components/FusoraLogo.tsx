import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const mark = compact ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-11 sm:w-11'
  const word = compact
    ? 'text-[1.55rem] sm:text-[1.75rem] tracking-[0.12em]'
    : 'text-[1.8rem] sm:text-[2rem] tracking-[0.12em]'

  return (
    <Link
      to="/"
      className={`inline-flex max-w-full items-center gap-2.5 leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <img
        src="/fusora-mark.svg?v=6"
        alt=""
        aria-hidden
        className={`${mark} shrink-0 object-contain ${
          onDark ? 'brightness-0 invert' : ''
        }`}
        decoding="async"
      />
      <span
        className={`translate-y-[1px] font-display font-normal uppercase leading-none ${word} ${
          onDark ? 'text-white' : 'text-[#cf2028]'
        }`}
      >
        Fusora
      </span>
    </Link>
  )
}
