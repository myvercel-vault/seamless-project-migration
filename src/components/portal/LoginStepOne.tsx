import { useEffect, useState } from "react";
import { AlertCircle, Eye, EyeOff, IdCard, KeyRound, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { findMerchant, verifyMerchant } from "@/lib/portal.functions";
import MerchantCard from "./MerchantCard";
import { LiveCheck } from "./icons";

export default function LoginStepOne({ onContinue }: { onContinue: (merchantId: string) => void }) {
  const [merchantId, setMerchantId] = useState("");
  const [passkey, setPasskey] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [phase, setPhase] = useState<"merchant" | "passkey">("merchant");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!verified) return;
    const timer = setTimeout(() => onContinue(merchantId.trim()), 3000);
    return () => clearTimeout(timer);
  }, [verified, merchantId, onContinue]);

  const canFind = merchantId.trim().length > 0 && !loading;

  const find = async () => {
    if (!canFind || found) return;
    setLoading(true);
    setError("");
    try {
      const result = await findMerchant({ data: { merchantId: merchantId.trim() } });
      if (!result.valid) setError("Please enter a valid Merchant ID to continue.");
      else setFound(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!passkey || verifying || verified || !found) return;
    setVerifying(true);
    setError("");
    try {
      const result = await verifyMerchant({ data: { merchantId: merchantId.trim(), passkey } });
      if (!result.configured) {
        setError("Passkey verification is not set up yet. Add the merchant passkey in Secrets to continue.");
        return;
      }
      if (!result.valid) {
        setError("The passkey is incorrect. Please try again.");
        return;
      }
      setVerified(true);
      setPasskey("");
    } catch {
      setError("Unable to verify your passkey. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const reset = () => {
    setMerchantId("");
    setPasskey("");
    setFound(false);
    setShow(false);
    setPhase("merchant");
    setVerified(false);
    setError("");
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border bg-secondary/40 px-5 py-6 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border bg-surface-bright p-3 shadow-sm">
          <img
            src="/merchant-logo.png"
            alt="Merchant logo"
            className="h-full w-full object-contain"
          />
        </div>
        <p className="text-base font-semibold leading-relaxed text-foreground">
          Identify background records, customer information and customer history in Salesforce.
        </p>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        {phase === "merchant"
          ? "Please enter your Merchant ID below:"
          : "Enter your passkey to verify the selected merchant."}
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="merchant-id">MERCHANT ID*</Label>
          <div className="flex h-12 items-center gap-3 rounded-xl border bg-secondary px-3 focus-within:ring-2 focus-within:ring-ring">
            <IdCard className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Input
              id="merchant-id"
              value={merchantId}
              onChange={(e) => {
                setMerchantId(e.target.value);
                setError("");
              }}
              disabled={loading || found}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canFind && !found) void find();
              }}
              className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 font-mono text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-invalid={!!error && phase === "merchant"}
            />
          </div>
        </div>

        {phase === "passkey" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="merchant-passkey">PASSKEY*</Label>
              <div className="flex h-12 items-center gap-3 rounded-xl border bg-secondary px-3 focus-within:ring-2 focus-within:ring-ring">
                <KeyRound className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  id="merchant-passkey"
                  autoFocus
                  autoComplete="current-password"
                  type={show ? "text" : "password"}
                  value={passkey}
                  disabled={verifying || verified}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void verify();
                  }}
                  className="h-full min-w-0 flex-1 bg-transparent font-mono text-foreground outline-none"
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  disabled={verifying || verified}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide passkey" : "Show passkey"}
                >
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button
              onClick={verify}
              disabled={!passkey || verifying || verified}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              disabled={verifying || verified}
              className="w-full rounded-xl"
            >
              Go back
            </Button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {phase === "merchant" && !found && (
          <Button
            onClick={find}
            disabled={!canFind}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching merchant...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Find
              </>
            )}
          </Button>
        )}
      </div>

      {found && phase === "merchant" && (
        <MerchantCard
          onBack={reset}
          onContinue={() => {
            setError("");
            setPhase("passkey");
          }}
        />
      )}

      {verified && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="passkey-success"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div
            role="status"
            className="flex max-w-sm items-center gap-3 rounded-2xl border bg-card px-6 py-5 text-base font-semibold shadow-xl"
          >
            <LiveCheck />
            <p id="passkey-success">Passkey successfully verified.</p>
          </div>
        </div>
      )}
    </div>
  );
}
