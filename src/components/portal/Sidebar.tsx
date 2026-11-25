import { useEffect, useMemo, useState } from "react";
import { Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCKED, NAV, type Section } from "@/lib/portal-nav";

interface Props {
  open: boolean;
  onClose: () => void;
  active: Section;
  onSelect: (s: Section) => void;
  isAdmin: boolean;
}

export default function Sidebar({ open, onClose, active, onSelect, isAdmin }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useMemo(() => NAV.filter((n) => !n.admin || isAdmin), [isAdmin]);
  if (!open || !mounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} aria-hidden />
      <aside className="slide-in fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r bg-card">
        <div className="flex h-16 items-center justify-between px-5">
          <span className="font-extrabold text-foreground">Navigation</span>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onSelect(id);
                onClose();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-secondary",
                active === id ? "bg-primary text-primary-foreground hover:bg-primary" : "text-foreground",
              )}
            >
              <Icon className="h-5 w-5" /> {label}
              {LOCKED.includes(id) && !isAdmin && <Lock className="ml-auto h-4 w-4 opacity-60" />}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
