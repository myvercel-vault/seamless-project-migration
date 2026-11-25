import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import TopNav from "@/components/portal/TopNav";
import LoginStepOne from "@/components/portal/LoginStepOne";
import LoginStepTwo from "@/components/portal/LoginStepTwo";
import SignInGuide from "@/components/portal/SignInGuide";
import SectionView, { type Session } from "@/components/portal/SectionView";
import Sidebar from "@/components/portal/Sidebar";
import type { Section } from "@/lib/portal-nav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DuitJom Merchant Portal — Sign In" },
      {
        name: "description",
        content:
          "Sign in to the DuitJom merchant portal to check your merchant record, client detail and product status.",
      },
      { property: "og:title", content: "DuitJom Merchant Portal" },
      {
        property: "og:description",
        content: "Verify your merchant account to view your record, client detail and product status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Portal,
});

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6 flex gap-2">
      {[1, 2].map((i) => (
        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition", step >= i ? "bg-primary" : "bg-muted")} />
      ))}
    </div>
  );
}

function Portal() {
  const [step, setStep] = useState<1 | 2>(1);
  const [merchantId, setMerchantId] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [section, setSection] = useState<Section>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const role = "user" as const;

  const logout = () => {
    setSession(null);
    setStep(1);
    setMerchantId("");
    setSection("dashboard");
  };

  if (session) {
    return (
      <div className="min-h-screen">
        <TopNav onMenu={() => setMenuOpen(true)} onLogout={logout} />
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          active={section}
          onSelect={setSection}
          isAdmin={session.role === "admin"}
        />
        <main>
          <SectionView section={section} session={session} onSelect={setSection} onQuit={logout} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto flex max-w-xl flex-col px-4 py-10 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {step === 1 ? "Merchant Sign In" : "Client Verification"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {step === 1 ? "Verify your merchant account to get started" : "Complete your client details to continue"}
          </p>
        </div>
        <div className="rounded-3xl border bg-card/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <Stepper step={step} />
          {step === 1 ? (
            <LoginStepOne
              onContinue={(id) => {
                setMerchantId(id);
                setStep(2);
              }}
            />
          ) : (
            <LoginStepTwo
              merchantId={merchantId}
              role={role}
              onDone={(email) => setSession({ merchantId, email, role })}
            />
          )}
          {step === 1 && <SignInGuide />}
        </div>
      </main>
    </div>
  );
}
