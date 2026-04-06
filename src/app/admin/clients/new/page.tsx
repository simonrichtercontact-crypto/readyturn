"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PLANS = [
  { id: "free", label: "Free – $0/mo", desc: "1 property, 5 units, 3 turnovers" },
  { id: "pro", label: "Pro – $29/mo", desc: "10 properties, 100 units, unlimited turnovers" },
  { id: "business", label: "Business – $79/mo", desc: "Everything unlimited" },
];

export default function AdminNewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const fd = new FormData(e.currentTarget);
    const body = {
      companyName: fd.get("companyName") as string,
      ownerName: fd.get("ownerName") as string,
      ownerEmail: fd.get("ownerEmail") as string,
      ownerPassword: fd.get("ownerPassword") as string,
      plan: fd.get("plan") as string,
    };

    const res = await fetch("/api/admin/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || data.error) {
      setError(data.error ?? "Something went wrong.");
    } else {
      setSuccess(`Client "${body.companyName}" created successfully on the ${body.plan} plan.`);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Link href="/admin/clients">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Client</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manually create a company and owner account.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
            <input
              name="companyName"
              type="text"
              required
              placeholder="Apex Property Group"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Owner Full Name</label>
            <input
              name="ownerName"
              type="text"
              required
              placeholder="Jane Smith"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Owner Email</label>
            <input
              name="ownerEmail"
              type="email"
              required
              placeholder="jane@company.com"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Temporary Password</label>
            <input
              name="ownerPassword"
              type="text"
              required
              placeholder="Min. 8 characters"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-500">Share this with the client — they can reset it later.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Plan</label>
            <div className="space-y-2">
              {PLANS.map((p) => (
                <label key={p.id} className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 cursor-pointer hover:border-slate-500 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10">
                  <input type="radio" name="plan" value={p.id} defaultChecked={p.id === "pro"} className="mt-0.5 accent-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-white">{p.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Creating client...</>
            ) : (
              <><UserPlus className="h-4 w-4" /> Create Client</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
