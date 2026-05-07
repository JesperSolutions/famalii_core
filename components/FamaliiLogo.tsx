type Variant = 'full' | 'symbol'
type Tone    = 'auto' | 'light' | 'dark'

interface Props {
  variant?: Variant
  tone?:    Tone
  className?: string
}

/**
 * Famalii brand mark.
 *
 * variant=full   → "Famalii" wordmark + dot symbol
 * variant=symbol → just the "lii" dotted bars symbol
 *
 * tone=auto  → wordmark uses currentColor, dots are brand green
 * tone=light → wordmark white
 * tone=dark  → wordmark navy (#192E5B)
 */
export function FamaliiLogo({ variant = 'full', tone = 'auto', className = '' }: Props) {
  const wordColor =
    tone === 'light' ? '#ffffff' :
    tone === 'dark'  ? '#192E5B' :
    'currentColor'
  const green = '#9EEAAF'

  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 32 36"
        className={className}
        aria-label="Famalii"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Three vertical bars (lii) */}
        <rect x="1"  y="10" width="6" height="24" rx="3" fill={wordColor} />
        <rect x="13" y="14" width="6" height="20" rx="3" fill={wordColor} />
        <rect x="25" y="18" width="6" height="16" rx="3" fill={wordColor} />
        {/* Two green dots */}
        <circle cx="16" cy="6"  r="3.5" fill={green} />
        <circle cx="28" cy="11" r="3.5" fill={green} />
      </svg>
    )
  }

  // Full wordmark — text-based, brand-faithful, no font dependency on assets
  return (
    <span
      className={`inline-flex items-baseline gap-[0.18em] font-extrabold tracking-tight leading-none select-none ${className}`}
      style={{ color: wordColor, fontFamily: 'var(--font-dm-sans), DM Sans, system-ui, sans-serif' }}
      aria-label="Famalii"
    >
      <span>Famal</span>
      <span className="relative inline-flex items-baseline gap-[0.08em]">
        <span className="relative">
          i
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top:    '-0.42em',
              width:  '0.36em',
              height: '0.36em',
              borderRadius: '9999px',
              background: green,
            }}
          />
        </span>
        <span className="relative">
          i
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top:    '-0.42em',
              width:  '0.36em',
              height: '0.36em',
              borderRadius: '9999px',
              background: green,
            }}
          />
        </span>
      </span>
    </span>
  )
}
