import { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { verifyAdmin } from "@/lib/portal.functions";

export default function AdminLoginDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await verifyAdmin({ data: { username, password } });
      if (!result.configured) {
        setError("Admin access is not set up yet. Add the admin credentials in Secrets to continue.");
        return;
      }
      if (!result.valid) {
        setError("Invalid username or password.");
        return;
      }
      setUsername("");
      setPassword("");
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setError("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <DialogTitle>Admin access required</DialogTitle>
          <DialogDescription>Enter User &amp; Password to continue.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="admin-user">User</Label>
            <Input
              id="admin-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="h-11 w-full rounded-xl" disabled={!username || !password || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
