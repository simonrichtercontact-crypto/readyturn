import { createClient, getUserCompany, createServiceClient, getUser } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { notFound } from "next/navigation";
import { InviteMember } from "@/features/team/invite-member";
import { RemoveMember } from "@/features/team/remove-member";
import {
  Users,
  ShieldCheck,
  Activity,
  PlusCircle,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Upload,
  AlertCircle,
} from "lucide-react";

export const metadata = { title: "Team" };

const roleColors: Record<string, string> = {
  owner: "bg-violet-100 text-violet-700",
  admin: "bg-blue-100 text-blue-700",
  member: "bg-emerald-100 text-emerald-700",
  viewer: "bg-slate-100 text-slate-600",
};

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  created: PlusCircle,
  updated: RefreshCw,
  deleted: Trash2,
  completed: CheckCircle2,
  status_changed: RefreshCw,
  uploaded: Upload,
  blocked: AlertCircle,
};

const actionColors: Record<string, string> = {
  created: "text-blue-500 bg-blue-50",
  updated: "text-slate-500 bg-slate-50",
  deleted: "text-red-500 bg-red-50",
  completed: "text-emerald-500 bg-emerald-50",
  status_changed: "text-amber-500 bg-amber-50",
  uploaded: "text-purple-500 bg-purple-50",
  blocked: "text-red-500 bg-red-50",
};

export default async function TeamPage() {
  const [companyData, user] = await Promise.all([getUserCompany(), getUser()]);
  if (!companyData) return notFound();

  // Only owners and admins can see team page
  if (!["owner", "admin"].includes(companyData.role)) return notFound();

  const admin = createServiceClient();
  const supabase = await createClient();

  // Get all members
  const { data: members } = await admin
    .from("company_members")
    .select("user_id, role, created_at")
    .eq("company_id", companyData.company_id)
    .order("created_at", { ascending: true });

  // Get profiles for all members
  const userIds = members?.map((m) => m.user_id) ?? [];
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, email, created_at")
    .in("id", userIds);

  // Get all activity logs for the company
  const { data: activity } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("company_id", companyData.company_id)
    .order("created_at", { ascending: false })
    .limit(50);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  const enrichedMembers = members?.map((m) => ({
    ...m,
    profile: profileMap.get(m.user_id),
  })) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Team"
        description="Manage your team members and monitor all activity in your workspace."
      >
        <InviteMember />
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{enrichedMembers.length}</p>
            <p className="text-xs text-muted-foreground">Team members</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{activity?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Recent actions (last 50)</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Members list */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              {enrichedMembers.map((m) => {
                const name = m.profile?.full_name || m.profile?.email || "Unknown";
                const initials = getInitials(name);
                return (
                  <div key={m.user_id} className="group flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.profile?.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[m.role] ?? "bg-slate-100 text-slate-600"}`}>
                      {m.role}
                    </span>
                    {m.user_id !== user?.id && (
                      <RemoveMember userId={m.user_id} name={name} role={m.role} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity log */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              All Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!activity || activity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No activity yet</p>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                {activity.map((log, index) => {
                  const Icon = actionIcons[log.action_type] ?? RefreshCw;
                  const colorClass = actionColors[log.action_type] ?? "text-slate-500 bg-slate-50";
                  return (
                    <div key={log.id} className="flex items-start gap-3 py-2">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 ${colorClass}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        {index < activity.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border min-h-[12px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <p className="text-xs text-foreground leading-snug">{log.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatRelativeTime(log.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
