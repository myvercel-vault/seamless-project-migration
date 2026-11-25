import { useState } from "react";
import { Eye, EyeOff, IdCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitRegistration } from "@/lib/portal.functions";
import CodeBoxes from "./CodeBoxes";

function Eyeball({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className="text-muted-foreground hover:text-foreground" aria-label="Show/Hide">
      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
}

export default function LoginStepTwo({
  merchantId,
  role,
  onDone,
}: {
  merchantId: string;
  role: string;
  onDone: (email: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showPin2, setShowPin2] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const pinMismatch = pin2.length === 6 && pin !== pin2;
  const valid = phone.replace(/\D/g, "").length >= 8 && pin.length === 6 && pin === pin2 && emailOk;

  const submit = async () => {
    setSending(true);
    try {
      await submitRegistration({ data: { merchantId, role, phone, pin, email } });
      toast.success("Maklumat anda telah dihantar.");
      onDone(email);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghantar.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="verified-merchant-id">MERCHANT ID</Label>
        <div className="flex h-12 items-center gap-3 rounded-xl border bg-secondary px-3">
          <IdCard className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            id="verified-merchant-id"
            value={merchantId}
            readOnly
            className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 font-mono text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="pt-2 text-xs font-bold uppercase tracking-widest text-primary">ClientSide</div>

      <div className="space-y-1.5">
        <Label htmlFor="client-phone">PHONE NUMBER*</Label>
        <div className="flex">
          <span className="flex items-center rounded-l-xl border border-r-0 bg-secondary px-4 text-sm font-medium text-secondary-foreground">
            +60
          </span>
          <Input
            id="client-phone"
            className="h-12 rounded-l-none rounded-r-xl"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>PIN ACCESS*</Label>
        <p className="text-xs text-muted-foreground">Create your new access PIN to continue</p>
        <div className="flex items-center gap-3">
          <CodeBoxes value={pin} onChange={setPin} masked={!showPin} />
          <Eyeball show={showPin} toggle={() => setShowPin(!showPin)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Re-Enter PIN ACCESS*</Label>
        <div className="flex items-center gap-3">
          <CodeBoxes value={pin2} onChange={setPin2} masked={!showPin2} invalid={pinMismatch} />
          <Eyeball show={showPin2} toggle={() => setShowPin2(!showPin2)} />
        </div>
        {pinMismatch && <p className="text-xs text-destructive">PIN does not match.</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="client-email">E-MAIL*</Label>
        <Input
          id="client-email"
          type="email"
          className="h-12 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && !emailOk && <p className="text-xs text-destructive">Please enter a valid e-mail.</p>}
      </div>

      <Button
        className="h-12 w-full rounded-xl text-base font-semibold"
        disabled={!valid || sending}
        onClick={submit}
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Continue"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree with our company Privacy Policy and Terms &amp; Conditions on the
        SalesForce website.
      </p>
    </div>
  );
}
