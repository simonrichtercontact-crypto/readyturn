"use client";

import { useState } from "react";
import { UserPlus, Loader2, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function InviteMember() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; tempPassword?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleInvite() {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || data.error) {
      setError(data.error ?? "Something went wrong.");
    } else {
      setResult(data);
      setEmail("");
    }
  }

  function copyPassword() {
    if (result?.tempPassword) {
      navigator.clipboard.writeText(result.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleClose() {
    setOpen(false);
    setEmail("");
    setError(null);
    setResult(null);
    setRole("member");
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="h-3.5 w-3.5" />
        Add Member
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>

          {result ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800">{result.message}</p>
              </div>

              {result.tempPassword && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Temporary password — share this with them:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-mono">
                      {result.tempPassword}
                    </code>
                    <Button variant="outline" size="sm" onClick={copyPassword}>
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">They can reset their password after signing in.</p>
                </div>
              )}

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => { setResult(null); }}>
                  Add another
                </Button>
                <Button onClick={() => { handleClose(); window.location.reload(); }}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <select
                  id="invite-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="admin">Admin — can manage everything</option>
                  <option value="member">Member — can update turnovers & tasks</option>
                  <option value="viewer">Viewer — read only</option>
                </select>
              </div>

              <div className="rounded-lg bg-muted/50 border border-border px-3 py-2 text-xs text-muted-foreground">
                If this person does not have an account yet, one will be created automatically with a temporary password you can share with them.
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleInvite} disabled={loading || !email.trim()}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</> : "Add Member"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
