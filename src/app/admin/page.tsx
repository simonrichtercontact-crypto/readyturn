import { createServiceClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/plans";
import { Users, Building2, RotateCcw, TrendingUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Admin – TurnTiva" };

export default async function AdminPage() {
  const admin = createServiceClient();

  const [
    { count: totalCompanies },
    { count: totalUsers },
    { count: totalTurnovers },
    { data: recentCompanies },
    { data: planBreakdown },
  ] = await Promise.all([
    admin.from("companies").select("id", { count: "exact" }),
    admin.from("profiles").select("id", { count: "exact" }),
    admin.from("turnovers").select("id", { count: "exact" }),
    admin.from("companies").select("id, name, plan, created_at").order("created_at", { ascending: false }).limit(8),
    admin.from("companies").select("plan"),
  ]);

  const planCounts: Record<string, number> = { free: 0, pro: 0, business: 0 };
  planBreakdown?.forEach((c) => {
    const p = c.plan ?? "free";
    planCounts[p] = (planCounts[p] || 0) + 1;
  });

  const stats = [
    { label: "Total Clients", value: totalCompanies ?? 0, icon: Building2, color: "bg-blue-500/10 text-blue-400" },
    { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Total Turnovers", value: totalTurnovers ?? 0, icon: RotateCcw, color: "bg-violet-500/10 text-violet-400" },
    { label: "Paying Clients", value: (planCounts.pro ?? 0) + (planCounts.business ?? 0), icon: TrendingUp, color: "bg-amber-500/10 text-amber-400" },
  ];

  const planColors: Record<string, string> = {
    free: "bg-slate-700 text-slate-300",
    pro: "bg-blue-500/20 text-blue-300",
    business: "bg-violet-500/20 text-violet-300",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-400">All clients and activity across TurnTiva.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.color} mb-3`}>
              <s.icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(PLANS).map(([id, plan]) => (
          <div key={id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">{plan.name} Plan</p>
              <p className="text-2xl font-bold text-white mt-1">{planCounts[id] ?? 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${planColors[id]}`}>
              {id}
            </span>
          </div>
        ))}
      </div>

      {/* Recent sign-ups */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Recent Clients</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Company</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Plan</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {recentCompanies?.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-3 font-medium text-white">{c.name}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[c.plan ?? "free"]}`}>
                    {c.plan ?? "free"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400 text-xs">{formatRelativeTime(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
