import { createServiceClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";
import { Users } from "lucide-react";

export const metadata = { title: "All Users – Admin" };

export default async function AdminUsersPage() {
  const admin = createServiceClient();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: false });

  const { data: members } = await admin
    .from("company_members")
    .select("user_id, role, company_id, companies(name, plan)");

  const memberMap = new Map<string, { role: string; company: string; plan: string }>();
  members?.forEach((m) => {
    const co = m.companies as { name: string; plan: string } | null;
    memberMap.set(m.user_id, {
      role: m.role,
      company: co?.name ?? "—",
      plan: co?.plan ?? "free",
    });
  });

  const planColors: Record<string, string> = {
    free: "bg-slate-700 text-slate-300",
    pro: "bg-blue-500/20 text-blue-300",
    business: "bg-violet-500/20 text-violet-300",
  };

  const roleColors: Record<string, string> = {
    owner: "text-amber-400",
    admin: "text-blue-400",
    member: "text-slate-300",
    viewer: "text-slate-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Users</h1>
        <p className="mt-1 text-sm text-slate-400">{profiles?.length ?? 0} users registered on ReadyTurn.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {["Name", "Email", "Company", "Plan", "Role", "Joined"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {profiles?.map((p) => {
              const info = memberMap.get(p.id);
              return (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-300 shrink-0">
                        {p.full_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      {p.full_name || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{p.email}</td>
                  <td className="px-5 py-3 text-slate-300">{info?.company ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[info?.plan ?? "free"]}`}>
                      {info?.plan ?? "free"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold capitalize ${roleColors[info?.role ?? "member"]}`}>
                      {info?.role ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{formatRelativeTime(p.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!profiles || profiles.length === 0) && (
          <div className="py-16 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-700 mb-2" />
            <p className="text-slate-500 text-sm">No users yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
