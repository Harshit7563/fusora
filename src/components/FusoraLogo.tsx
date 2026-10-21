import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

function SealMark({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_3px_8px_rgba(122,16,16,0.3)]"
    >
      <circle cx="48" cy="48" r="46" fill="#7a1010" />
      <circle cx="48" cy="48" r="42" fill="none" stroke="#ffc462" strokeWidth="2.2" />
      <circle cx="48" cy="48" r="35.5" fill="none" stroke="#ffc462" strokeWidth="0.9" opacity="0.85" />
      <path
        fill="#ffffff"
        d="M35 25h29v9.5H46v7h14.5v9.5H46v20H35V25z"
      />
    </svg>
  )
}

/** Fusora premium seal: gold-ringed maroon seal with serif wordmark. */
export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const markSize = compact ? 38 : 46
  const wordSize = compact
    ? 'text-[1.35rem] sm:text-[1.5rem]'
    : 'text-[1.6rem] sm:text-[1.8rem]'

  return (
    <Link
      to="/"
      className={`group inline-flex max-w-full items-center gap-2.5 leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span className="transition duration-300 group-hover:scale-[1.04]">
        <SealMark size={markSize} />
      </span>
      <span className="flex flex-col items-start">
        <span
          className={`${wordSize} font-bold tracking-[0.22em] uppercase leading-[1] [font-family:Georgia,'Times_New_Roman',serif] ${
            onDark ? 'text-white' : 'text-[#7a1010]'
          }`}
        >
          Fusora
        </span>
        {!compact && (
          <span className="mt-1.5 text-[0.52rem] font-bold tracking-[0.42em] text-[#c99a3c] uppercase">
            Est. India
          </span>
        )}
      </span>
    </Link>
  )
}
