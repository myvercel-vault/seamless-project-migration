import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Globe, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildLanguages } from "@/lib/portal-nav";

const MENU_LINKS = [
  { title: "Products", detail: "Explore Salesforce solutions", href: "https://www.salesforce.com/products/" },
  { title: "Industries", detail: "Solutions for your industry", href: "https://www.salesforce.com/industries/" },
  { title: "Customers", detail: "See customer stories", href: "https://www.salesforce.com/customer-stories/" },
  { title: "Learning", detail: "Build skills with Trailhead", href: "https://trailhead.salesforce.com/" },
  { title: "Support", detail: "Get help and documentation", href: "https://www.salesforce.com/company/contact-us/" },
  { title: "About Salesforce", detail: "Our story, values and impact", href: "https://www.salesforce.com/company/our-story/" },
];

export default function TopNav({ onMenu, onLogout }: { onMenu?: () => void; onLogout?: () => void }) {
  const [lang, setLang] = useState("ms");
  const [menuOpen, setMenuOpen] = useState(false);
  const languages = useMemo(() => buildLanguages(), []);

  // Stored preference is read after mount so the server and first client
  // render stay identical.
  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored) setLang(stored);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="salesforce-navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        {onMenu && (
          <Button variant="ghost" size="icon" onClick={onMenu} aria-label="Open portal menu">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <a href="/" className="flex items-center" aria-label="Salesforce homepage">
          <img
            src="https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/11/logo-salesforce.svg?w=1024"
            alt="Salesforce"
            className="h-8 w-auto"
          />
        </a>
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={lang}
            onValueChange={(v) => {
              setLang(v);
              localStorage.setItem("lang", v);
              document.documentElement.lang = v;
            }}
          >
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <Globe className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {languages.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onLogout && (
            <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Log out" title="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav id="salesforce-navigation" aria-label="Main navigation" className="border-t bg-background shadow-xl">
          <div className="mx-auto grid max-w-6xl gap-2 px-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_LINKS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between rounded-xl p-4 hover:bg-accent"
              >
                <span>
                  <span className="block font-semibold text-foreground">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
              </a>
            ))}
            <a
              href="#faq"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between rounded-xl p-4 hover:bg-accent"
            >
              <span>
                <span className="block font-semibold text-foreground">Frequently asked questions</span>
                <span className="mt-1 block text-sm text-muted-foreground">Answers and useful information</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
