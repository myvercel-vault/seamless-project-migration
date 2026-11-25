/** Brand mark and animated status glyphs ported from the source portal. */

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/11/logo-salesforce.svg?w=1024"
      alt="Salesforce"
      className={`h-8 w-auto ${className}`}
    />
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
