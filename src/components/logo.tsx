import Link from 'next/link';

export function Logo({ showText = false }: { showText?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Wanderwise AI Home">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 ease-in-out group-hover:scale-105">
        <svg
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Compass Rose Background */}
          <circle cx="12" cy="12" r="10" stroke="hsl(var(--accent))" strokeWidth="1.5" />
          <path d="M12 2V22M2 12H22" stroke="hsl(var(--accent))" strokeWidth="0.5" strokeOpacity="0.5" />
          <path d="M5.5 5.5L18.5 18.5M18.5 5.5L5.5 18.5" stroke="hsl(var(--accent))" strokeWidth="0.5" strokeOpacity="0.5" />

          {/* Main Compass Needle */}
          <path d="M12 7L14 12L12 17L10 12L12 7Z" fill="currentColor" />

          {/* AI Spark */}
          <path d="M12 11.5L12.5 12.5L11.5 12.5L12 11.5Z" fill="hsl(var(--accent))" />
           <path d="M11 11L10 10" stroke="hsl(var(--accent))" strokeWidth="1" strokeLinecap="round" />
           <path d="M13 11L14 10" stroke="hsl(var(--accent))" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <span 
        className={!showText ? "hidden sm:inline-block" : ""}
        style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.05em' }}
      >
        Wanderwise AI
      </span>
    </Link>
  );
}
