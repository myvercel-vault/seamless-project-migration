import { Dices, User, Database, FileText, Mail, Trash2, SearchCheck, Settings, Bell, ShieldCheck, Users, BarChart3, type LucideIcon } from "lucide-react";

export type Section =
  | "dashboard"
  | "profile"
  | "database"
  | "records"
  | "creditor"
  | "users"
  | "reports"
  | "notifications"
  | "security"
  | "settings"
  | "contact"
  | "clear";

/** Sections a non-admin cannot open without the admin check. */
export const LOCKED: Section[] = ["database", "records", "security", "settings"];

export const NAV: { id: Section; label: string; icon: LucideIcon; admin?: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: Dices },
  { id: "profile", label: "My Profile", icon: User },
  { id: "database", label: "Database", icon: Database },
  { id: "records", label: "Records", icon: FileText },
  { id: "creditor", label: "Find Creditor", icon: SearchCheck },
  { id: "users", label: "Manage Users", icon: Users, admin: true },
  { id: "reports", label: "Reports", icon: BarChart3, admin: true },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "contact", label: "Contact Us", icon: Mail },
  { id: "clear", label: "Clear History", icon: Trash2 },
];

const CODES =
  "aa ab af ak am an ar as av ay az ba be bg bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu".split(
    " ",
  );

/** Language list built from Intl.DisplayNames; runs only where it is read. */
export function buildLanguages() {
  const en = new Intl.DisplayNames(["en"], { type: "language" });
  return CODES.map((code) => {
    let native = "";
    try {
      native = new Intl.DisplayNames([code], { type: "language" }).of(code) ?? "";
    } catch {
      /* unsupported code */
    }
    const name = en.of(code) ?? code;
    return {
      code,
      label: native && native !== name && native !== code ? `${name} — ${native}` : name,
    };
  }).sort((a, b) => a.label.localeCompare(b.label));
}
