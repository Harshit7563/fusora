import { Link } from 'react-router-dom'

type Props = {
  className?: string
  compact?: boolean
  /** Light treatment for dark / transparent header */
  onDark?: boolean
  centered?: boolean
}

/** Koskii-style wordmark — brand first on every surface */
export function FusoraLogo({
  className = '',
  compact = false,
  onDark = false,
  centered = false,
}: Props) {
  return (
    <Link
      to="/"
      className={`inline-flex max-w-full flex-col items-center leading-none ${
        centered ? 'justify-center' : 'justify-start'
      } ${className}`}
      aria-label="Fusora home"
    >
      <span
        className={`mb-0.5 select-none ${onDark ? 'text-white' : 'text-[#5c2a2a]'}`}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className={compact ? 'size-3.5 sm:size-4' : 'size-4 sm:size-5'}
          fill="currentColor"
        >
          <path d="M12 2.2c.4 1.6 1.2 2.8 2.4 3.7-1.5.2-2.7.9-3.5 2.1-.3-1.4-1.1-2.5-2.3-3.3C10.2 4.2 11.2 3.2 12 2.2zm0 6.3c1.9 0 3.5 1.1 4.2 2.7-.9.4-1.6 1.1-2.1 2 .2-1.2-.1-2.4-.9-3.3-.7.9-1.1 2.1-.9 3.3-.5-.9-1.2-1.6-2.1-2 .7-1.6 2.3-2.7 4.2-2.7zm-5.8 6.2c1.1-.7 2.4-.9 3.7-.5-.8 1.1-1.1 2.5-.8 3.8-1.3-.5-2.3-1.5-2.9-2.8v-.5zm11.6 0v.5c-.6 1.3-1.6 2.3-2.9 2.8.3-1.3 0-2.7-.8-3.8 1.3-.4 2.6-.2 3.7.5zM12 21.8c-.8-1-1.8-1.7-3-2.1 1.2.1 2.3.6 3 1.5.7-.9 1.8-1.4 3-1.5-1.2.4-2.2 1.1-3 2.1z" />
        </svg>
      </span>
      <span
        className={`font-serif tracking-[0.04em] lowercase ${
          compact
            ? 'text-[1.35rem] sm:text-[1.55rem]'
            : 'text-[1.55rem] sm:text-[1.85rem]'
        } ${onDark ? 'text-white' : 'text-[#5c2a2a]'}`}
        style={{ fontWeight: 500 }}
      >
        fusora
      </span>
    </Link>
  )
}
