import Link from 'next/link';

type LogoProps = {
  showText?: boolean;
  compact?: boolean;
  className?: string;
};

export function Logo({
  showText = false,
  compact = false,
  className = '',
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Wanderwise AI Home"
      className={`group flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}
    >
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 ease-in-out group-hover:scale-105 ${
          compact ? 'h-9 w-9' : 'h-10 w-10'
        }`}
      >
        <svg
          className={compact ? 'h-7 w-7' : 'h-8 w-8'}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
          />

          <path
            d="M12 2V22M2 12H22"
            stroke="hsl(var(--accent))"
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />

          <path
            d="M5.5 5.5L18.5 18.5M18.5 5.5L5.5 18.5"
            stroke="hsl(var(--accent))"
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />

          <path
            d="M12 7L14 12L12 17L10 12L12 7Z"
            fill="currentColor"
          />

          <path
            d="M12 11.5L12.5 12.5L11.5 12.5L12 11.5Z"
            fill="hsl(var(--accent))"
          />

          <path
            d="M11 11L10 10"
            stroke="hsl(var(--accent))"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <path
            d="M13 11L14 10"
            stroke="hsl(var(--accent))"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span
        className={[
          'min-w-0 whitespace-nowrap font-semibold tracking-wide text-foreground',
          compact
            ? 'text-[1.05rem] sm:text-lg'
            : 'text-lg sm:text-xl',
          showText ? 'inline-block' : 'hidden sm:inline-block',
        ].join(' ')}
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Wanderwise AI
      </span>
    </Link>
  );
}
