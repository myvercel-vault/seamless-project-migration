/** Brand mark and animated status glyphs ported from the source portal. */

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div role="img" aria-label="DuitJom" className={`flex items-baseline gap-1.5 ${className}`}>
      <span className="h-2.5 w-2.5 translate-y-[-1px] rounded-full bg-foreground" aria-hidden />
      <span className="text-[17px] font-bold tracking-tight text-foreground">duitjom</span>
    </div>
  );
}

export function LiveCheck({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`text-primary ${className}`} fill="none" aria-label="Valid">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="draw-circle" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-check"
      />
    </svg>
  );
}

export function LiveCross({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`text-destructive ${className}`} fill="none" aria-label="Incomplete">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="draw-circle" />
      <path
        d="M8.5 8.5l7 7M15.5 8.5l-7 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="draw-check"
      />
    </svg>
  );
}
