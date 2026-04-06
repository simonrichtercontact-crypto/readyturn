"use client";

import { useState } from "react";
import { MessageCircle, X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUBJECTS = [
  "I found a bug",
  "I need help with a feature",
  "Billing question",
  "Feature request",
  "Other",
];

export function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(SUBJECTS[1]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      setMessage("");
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => { setSent(false); setError(null); setMessage(""); }, 300);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#1e3a5f] text-white shadow-lg shadow-slate-900/30 hover:bg-[#0891b2] transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891b2] focus-visible:ring-offset-2"
        aria-label="Help & Support"
        style={{ width: 52, height: 52 }}
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
          onClick={handleClose}
        />
      )}

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] rounded-2xl border border-border bg-background shadow-elevated transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-[#1e3a5f] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-white">Help & Support</p>
            <p className="text-xs text-blue-200 mt-0.5">We typically reply within a few hours</p>
          </div>
          <button onClick={handleClose} className="text-blue-200 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {sent ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="font-semibold text-foreground">Message sent!</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                We received your message and will reply to your email shortly.
              </p>
              <Button size="sm" variant="outline" className="mt-4" onClick={handleClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  What do you need help with?
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Describe your issue
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's happening and we'll help you out..."
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading || !message.trim()}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="h-4 w-4" /> Send message</>
                )}
              </Button>

              <p className="text-center text-[10px] text-muted-foreground">
                We'll reply to your account email
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
