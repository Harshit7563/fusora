import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  onDark?: boolean
  centered?: boolean
}

function FoldMark({ onDark = false, size = 40 }: { onDark?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
    >
      <rect width="96" height="96" rx="24" fill={onDark ? '#ffffff' : '#141414'} />
      {/* Folded corner accent */}
      <path
        d="M96 34 L62 0 L96 0 Z"
        fill="#cf2028"
        opacity="0.95"
      />
      <path
        d="M62 0 L96 34 L74 34 C67 34 62 29 62 22 Z"
        fill="#e8e3da"
        opacity="0.28"
      />
      {/* Letter F */}
      <path
        fill={onDark ? '#141414' : '#ffffff'}
        d="M28 22h40v13H43v9h21v13H43v19H28V22z"
      />
      {/* Signature swoosh */}
      <path
        d="M16 76c24-15 48-8 64 5"
        stroke="#cf2028"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Fusora brand lockup: folded-F mark + confident wordmark. Works on light & dark. */
export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  const markSize = compact ? 36 : 44
  const wordSize = compact
    ? 'text-[1.45rem] sm:text-[1.6rem]'
    : 'text-[1.7rem] sm:text-[1.9rem]'

  return (
    <Link
      to="/"
      className={`group inline-flex max-w-full items-center gap-2.5 leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span className="transition duration-300 group-hover:-rotate-3 group-hover:scale-[1.03]">
        <FoldMark onDark={onDark} size={markSize} />
      </span>
      <span className="flex flex-col items-start">
        <span
          className={`font-logo ${wordSize} font-black tracking-[0.02em] uppercase leading-[0.95] ${
            onDark ? 'text-white' : 'text-[#141414]'
          }`}
        >
          Fusora
          <span className="text-[#cf2028]">.</span>
        </span>
        {!compact && (
          <span
            className={`mt-1 text-[0.52rem] font-bold tracking-[0.38em] uppercase ${
              onDark ? 'text-white/60' : 'text-[#8a8585]'
            }`}
          >
            Everyday Fashion
          </span>
        )}
      </span>
    </Link>
  )
}
