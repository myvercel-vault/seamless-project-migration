import { useState } from "react";
import { Building2, Clock, Loader2, LogOut, MapPin, RefreshCw, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COMPANY } from "@/lib/portal-data";
import { checkDashboardAvailability } from "@/lib/portal.functions";
import MascotStage from "@/components/mascot/MascotStage";
import TopNav from "./TopNav";
import { LogoMark } from "./icons";

const FAQ = [
  {
    q: "Why can't I open my dashboard?",
    a: "Our website is under ongoing maintenance while we make improvements. Your dashboard will return as soon as the work is finished.",
  },
  {
    q: "How long will the maintenance take?",
    a: "Please try again after 2 hours. You can press Retry at any time to check whether we are back.",
  },
  {
    q: "Are my details safe?",
    a: "Yes. The details you just submitted have been received and are stored securely. Your access PIN is never shown on this page.",
  },
  {
    q: "How can I contact the company?",
    a: `You can reach ${COMPANY.name} on ${COMPANY.fax}, or visit us at the address shown in the company record above.`,
  },
  {
    q: "What should I do after maintenance?",
    a: "Press Retry, or sign out and sign in again with your Merchant ID and passkey.",
  },
];

export default function MaintenancePage({ onLogout }: { onLogout: () => void }) {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const retry = async () => {
    if (checking) return;
    setChecking(true);
    setMessage("");
    try {
      const result = await checkDashboardAvailability();
      if (result.available) {
        onLogout();
        return;
      }
      setMessage("Still under maintenance. Please try again after 2 hours.");
      toast.message("Still under maintenance", { description: "Please try again after 2 hours." });
    } catch {
      setMessage("Unable to check right now. Please try again shortly.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="flex items-center justify-center gap-2 border-b bg-secondary px-4 py-2 text-center text-xs font-semibold text-secondary-foreground sm:text-sm">
        <span className="status-pulse inline-block h-2 w-2 rounded-full bg-signal-red" aria-hidden />
        <span>System maintenance in progress — estimated return in about 2 hours.</span>
      </div>
      <TopNav onLogout={onLogout} />

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:py-12">
        {/* Hero */}
        <section className="grid items-center gap-6 md:grid-cols-2">
          <div className="fade-rise space-y-5 text-center md:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Wrench className="h-3.5 w-3.5" aria-hidden /> Under maintenance
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              We'll be right back
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Our website is currently under ongoing maintenance. Please try again after 2 hours. Thank you for your
              patience!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button
                onClick={retry}
                disabled={checking}
                className="shine-btn h-12 rounded-xl bg-signal-red px-8 text-base font-bold text-signal-red-foreground hover:bg-signal-red/90"
              >
                {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {checking ? "Checking..." : "Retry"}
              </Button>
              <Button
                onClick={onLogout}
                disabled={checking}
                style={{ "--shine-color": "oklch(0 0 0 / 0.22)" } as React.CSSProperties}
                className="shine-btn h-12 rounded-xl border border-border bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            <div role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
              {message}
            </div>
          </div>
          <MascotStage />
        </section>

        {/* Company record only */}
        <section className="rounded-2xl border bg-card/90 p-5 shadow-sm backdrop-blur">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
            <Building2 className="h-4 w-4" /> Details Info of Company
          </h2>
          <p className="py-2 text-lg font-extrabold text-foreground">{COMPANY.name}</p>
          {(
            [
              ["Business Register No.", COMPANY.ssm],
              ["Fax", COMPANY.fax],
              ["Service", COMPANY.service],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-0.5 border-b py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground sm:text-right">{value}</span>
            </div>
          ))}
          <div className="pt-3 text-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Address</p>
            <p className="mt-1 text-foreground">{COMPANY.address}</p>
            <a
              href={COMPANY.maps}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" /> Open in Google Maps
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="rounded-2xl border bg-card/90 p-5 backdrop-blur">
          <h2 id="faq-title" className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
            <Clock className="h-4 w-4" /> Frequently asked questions
          </h2>
          <Accordion type="single" collapsible>
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <LogoMark />
            <p className="font-semibold text-foreground">{COMPANY.name}</p>
            <p>{COMPANY.ssm}</p>
          </div>
          <div className="max-w-xs space-y-1 sm:text-right">
            <p>{COMPANY.address}</p>
            <p>Fax: {COMPANY.fax}</p>
          </div>
        </div>
        <p className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
