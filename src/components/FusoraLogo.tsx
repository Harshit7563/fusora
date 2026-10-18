import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

/** Souled Store–style bold rounded sticker wordmark */
export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const pad = compact
    ? 'px-3 py-1.5 sm:px-3.5 sm:py-2'
    : 'px-3.5 py-2 sm:px-4 sm:py-2.5'
  const word = compact
    ? 'text-[1.15rem] sm:text-[1.35rem] tracking-[0.08em]'
    : 'text-[1.35rem] sm:text-[1.55rem] tracking-[0.08em]'

  return (
    <Link
      to="/"
      className={`inline-flex max-w-full items-center leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span
        className={`inline-flex items-center rounded-2xl border-[3px] border-white shadow-[0_0_0_2px_#cf2028] ${pad} ${
          onDark
            ? 'bg-white text-[#cf2028] shadow-[0_0_0_2px_#ffffff]'
            : 'bg-[#cf2028] text-white'
        }`}
      >
        <span
          className={`font-logo font-extrabold uppercase leading-none ${word}`}
        >
          Fusora
        </span>
      </span>
    </Link>
  )
}
