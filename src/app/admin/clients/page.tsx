"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Search, Edit2, Check, X, UserPlus } from "lucide-react";
import Link from "next/link";

type Company = {
  id: string;
  name: string;
  plan: string;
  created_at: string;
  member_count: number;
  property_count: number;
  turnover_count: number;
};

const PLANS = ["free", "pro", "business"];

const planColors: Record<string, string> = {
  free: "bg-slate-700 text-slate-300",
  pro: "bg-blue-500/20 text-blue-300",
  business: "bg-violet-500/20 text-violet-300",
};

export default function AdminClientsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState("free");
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((d) => { setCompanies(d.companies ?? []); setLoading(false); });
  }, []);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function startEdit(c: Company) {
    setEditingId(c.id);
    setEditPlan(c.plan);
  }

  function savePlan(id: string) {
    startSaving(async () => {
      await fetch("/api/admin/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, plan: editPlan }),
      });
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, plan: editPlan } : c))
      );
      setEditingId(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="mt-1 text-sm text-slate-400">All companies signed up to TurnTiva.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            New Client
          </Link>
          <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Company", "Plan", "Members", "Properties", "Turnovers", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-5 py-3">
                    {editingId === c.id ? (
                      <select
                        value={editPlan}
                        onChange={(e) => setEditPlan(e.target.value)}
                        className="bg-slate-800 border border-slate-600 text-white text-xs rounded px-2 py-1 focus:outline-none"
                      >
                        {PLANS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[c.plan ?? "free"]}`}>
                        {c.plan ?? "free"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-300">{c.member_count}</td>
                  <td className="px-5 py-3 text-slate-300">{c.property_count}</td>
                  <td className="px-5 py-3 text-slate-300">{c.turnover_count}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === c.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => savePlan(c.id)}
                          disabled={saving}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(c)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
