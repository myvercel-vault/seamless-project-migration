export function ActiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold tracking-wide text-secondary-foreground">
      <span className="h-2 w-2 rounded-full bg-foreground" aria-hidden />
      ACTIVE
    </span>
  );
}

export function OngoingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
      <span className="h-2 w-2 rounded-full bg-muted-foreground" aria-hidden />
      On Going
    </span>
  );
}
