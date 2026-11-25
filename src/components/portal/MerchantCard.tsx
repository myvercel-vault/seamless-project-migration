import { Building2, Globe, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, PRODUCT_RECORD } from "@/lib/portal-data";

export default function MerchantCard({
  onBack,
  onContinue,
  continueLabel = "Continue",
}: {
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <div className="fade-rise mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground">
        Creditor / Merchant record : 1 Found.
      </div>
      <div className="divide-y divide-border">
        <div className="p-5 text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Product</p>
          <p className="text-lg font-bold text-foreground">{PRODUCT_RECORD.name} / Finance</p>
          <a
            href={PRODUCT_RECORD.applicationSite}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            <Globe className="h-4 w-4" /> www.duitjom.com
          </a>
        </div>
        <div className="flex gap-4 p-5 text-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1 text-foreground">
            <p className="font-bold">{COMPANY.name}</p>
            <p>
              <span className="text-muted-foreground">Business Register No.:</span> {COMPANY.ssm}
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {COMPANY.fax}
            </p>
            <p>
              <span className="text-muted-foreground">Service:</span> {COMPANY.service}
            </p>
          </div>
        </div>
        <div className="p-5 text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Address</p>
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
        <div className="flex justify-between gap-3 p-5">
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
          <Button onClick={onContinue}>{continueLabel}</Button>
        </div>
      </div>
    </div>
  );
}
