import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

function GradientMark({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_4px_10px_rgba(207,32,40,0.35)]"
    >
      <defs>
        <linearGradient id="fusora-g" x1="0" y1="0" x2="96" y2="96">
          <stop offset="0%" stopColor="#e63329" />
          <stop offset="55%" stopColor="#cf2028" />
          <stop offset="100%" stopColor="#ff7a45" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="26" fill="url(#fusora-g)" />
      <path d="M96 30 L66 0 L96 0 Z" fill="#ffc462" />
      <path
        fill="#ffffff"
        d="M28 22h40v13H43v9h21v13H43v19H28V22z"
      />
      <path
        d="M16 76c24-15 48-8 64 5"
        stroke="#ffc462"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Fusora brand: sunset-gradient folded-F mark + warm maroon wordmark. */
export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const markSize = compact ? 38 : 46
  const wordSize = compact
    ? 'text-[1.5rem] sm:text-[1.65rem]'
    : 'text-[1.75rem] sm:text-[2rem]'

  return (
    <Link
      to="/"
      className={`group inline-flex max-w-full items-center gap-2.5 leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span className="transition duration-300 group-hover:-rotate-3 group-hover:scale-[1.04]">
        <GradientMark size={markSize} />
      </span>
      <span className="flex flex-col items-start">
        <span
          className={`font-logo ${wordSize} font-black tracking-[0.03em] uppercase leading-[0.95] ${
            onDark ? 'text-white' : 'text-[#6d0d0d]'
          }`}
        >
          Fus
          <span className={onDark ? 'text-[#ffc462]' : 'text-[#e63329]'}>o</span>
          ra
          <span className={onDark ? 'text-[#ffc462]' : 'text-[#ff7a45]'}>.</span>
        </span>
        {!compact && (
          <span
            className={`mt-1 text-[0.52rem] font-bold tracking-[0.38em] uppercase ${
              onDark ? 'text-white/60' : 'text-[#b08a7a]'
            }`}
          >
            Everyday Fashion
          </span>
        )}
      </span>
    </Link>
  )
}
