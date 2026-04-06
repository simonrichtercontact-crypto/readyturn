import { Suspense } from "react";
import Link from "next/link";
import {
  RotateCcw, AlertTriangle, CheckCircle2, Clock, Plus, ArrowRight,
  Building2, ShieldAlert, DollarSign, TrendingUp, Calendar, Flame,
  ArrowUpRight, Home, Target,
} from "lucide-react";
import { createClient, getUserCompany, getUser } from "@/lib/supabase/server";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { TurnoverStatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, isOverdue } from "@/lib/utils";
import type { TurnoverWithDetails } from "@/types/database";

/* ─── Stats ──────────────────────────────────────── */
async function DashboardStats() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;
  const companyId = companyData.company_id;

  const today = new Date().toISOString().split("T")[0];

  const [
    { count: activeTurnovers },
    { data: overdueData },
    { count: blockedUnits },
    { count: readyUnits },
    { count: totalProperties },
    { count: totalUnits },
  ] = await Promise.all([
    supabase.from("turnovers").select("id", { count: "exact" }).eq("company_id", companyId).in("status", ["not_started", "in_progress"]),
    supabase.from("turnovers").select("id").eq("company_id", companyId).in("status", ["not_started", "in_progress", "blocked"]).lt("target_ready_date", today),
    supabase.from("turnovers").select("id", { count: "exact" }).eq("company_id", companyId).eq("status", "blocked"),
    supabase.from("units").select("id", { count: "exact" }).eq("company_id", companyId).eq("status", "ready"),
    supabase.from("properties").select("id", { count: "exact" }).eq("company_id", companyId).eq("is_archived", false),
    supabase.from("units").select("id", { count: "exact" }).eq("company_id", companyId),
  ]);

  const overdueCount = overdueData?.length ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Active Turnovers" value={activeTurnovers ?? 0} icon={RotateCcw} description="Units currently in progress" iconClassName="bg-blue-50 text-blue-600" />
      <StatCard label="Overdue" value={overdueCount} icon={Clock} description="Past target ready date" iconClassName={overdueCount > 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"} />
      <StatCard label="Blocked" value={blockedUnits ?? 0} icon={ShieldAlert} description="Requiring attention" iconClassName={(blockedUnits ?? 0) > 0 ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"} />
      <StatCard label="Ready Units" value={readyUnits ?? 0} icon={CheckCircle2} description="Ready to lease" iconClassName="bg-emerald-50 text-emerald-600" />
    </div>
  );
}

/* ─── Portfolio Summary ───────────────────────────── */
async function PortfolioSummary() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;
  const companyId = companyData.company_id;

  const [
    { count: totalProperties },
    { count: totalUnits },
    { count: occupiedUnits },
    { count: completedThisMonth },
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact" }).eq("company_id", companyId).eq("is_archived", false),
    supabase.from("units").select("id", { count: "exact" }).eq("company_id", companyId),
    supabase.from("units").select("id", { count: "exact" }).eq("company_id", companyId).eq("status", "occupied"),
    supabase.from("turnovers").select("id", { count: "exact" }).eq("company_id", companyId).eq("status", "ready").gte("updated_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const occupancyRate = totalUnits ? Math.round(((occupiedUnits ?? 0) / (totalUnits ?? 1)) * 100) : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Properties", value: totalProperties ?? 0, icon: Building2, color: "text-violet-600", bg: "bg-violet-50", href: "/properties" },
        { label: "Total Units", value: totalUnits ?? 0, icon: Home, color: "text-blue-600", bg: "bg-blue-50", href: "/units" },
        { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50", href: "/units" },
        { label: "Completed This Month", value: completedThisMonth ?? 0, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", href: "/turnovers" },
      ].map(({ label, value, icon: Icon, color, bg, href }) => (
        <Link key={label} href={href} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-sm hover:border-primary/20 transition-all group">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
          </div>
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
        </Link>
      ))}
    </div>
  );
}

/* ─── Cost Overview ───────────────────────────────── */
async function CostOverview() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;

  const { data: tasks } = await supabase
    .from("turnover_tasks")
    .select("estimated_cost, actual_cost, status")
    .eq("company_id", companyData.company_id);

  if (!tasks || tasks.length === 0) return null;

  const totalEstimated = tasks.reduce((s, t) => s + (t.estimated_cost ?? 0), 0);
  const totalActual = tasks.reduce((s, t) => s + (t.actual_cost ?? 0), 0);
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const diff = totalActual - totalEstimated;
  const isOver = diff > 0;

  if (totalEstimated === 0 && totalActual === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          Cost Overview — Active Turnovers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground mb-1">Estimated</p>
            <p className="text-2xl font-bold text-foreground">${totalEstimated.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground mb-1">Actual Spent</p>
            <p className="text-2xl font-bold text-foreground">${totalActual.toLocaleString()}</p>
          </div>
          <div className={`rounded-xl p-4 ${isOver ? "bg-red-50" : "bg-emerald-50"}`}>
            <p className={`text-xs mb-1 ${isOver ? "text-red-600" : "text-emerald-600"}`}>
              {isOver ? "Over budget" : "Under budget"}
            </p>
            <p className={`text-2xl font-bold ${isOver ? "text-red-600" : "text-emerald-600"}`}>
              {isOver ? "+" : "-"}${Math.abs(diff).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Task completion</span>
            <span>{completedTasks}/{tasks.length} tasks ({completionRate}%)</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Urgent / Needs Attention ────────────────────── */
async function NeedsAttention() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;

  const today = new Date().toISOString().split("T")[0];
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: urgent } = await supabase
    .from("turnovers")
    .select("*, property:properties(name), unit:units(unit_number)")
    .eq("company_id", companyData.company_id)
    .or(`status.eq.blocked,and(target_ready_date.lte.${in7days},status.in.(not_started,in_progress))`)
    .neq("status", "ready")
    .order("target_ready_date", { ascending: true })
    .limit(5);

  if (!urgent || urgent.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
        <p className="text-sm text-emerald-800 font-medium">All turnovers on track — nothing urgent!</p>
      </div>
    );
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-orange-700">
          <Flame className="h-4 w-4" />
          Needs Your Attention
          <span className="ml-auto text-xs font-normal bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{urgent.length} item{urgent.length > 1 ? "s" : ""}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {(urgent as unknown as TurnoverWithDetails[]).map((t) => {
            const overdue = isOverdue(t.target_ready_date);
            const isBlocked = t.status === "blocked";
            return (
              <Link
                key={t.id}
                href={`/turnovers/${t.id}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/40 transition-colors group"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isBlocked ? "bg-red-100" : overdue ? "bg-orange-100" : "bg-amber-100"}`}>
                  {isBlocked
                    ? <ShieldAlert className="h-4 w-4 text-red-600" />
                    : overdue
                    ? <AlertTriangle className="h-4 w-4 text-orange-600" />
                    : <Clock className="h-4 w-4 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {t.property?.name} · Unit {t.unit?.unit_number}
                  </p>
                  <p className={`text-xs ${overdue ? "text-red-500" : "text-muted-foreground"}`}>
                    {isBlocked ? "Blocked — needs action" : overdue ? `Overdue since ${formatDate(t.target_ready_date)}` : `Due ${formatDate(t.target_ready_date)}`}
                  </p>
                </div>
                <TurnoverStatusBadge status={t.status} />
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Upcoming (next 14 days) ─────────────────────── */
async function UpcomingDeadlines() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;

  const today = new Date().toISOString().split("T")[0];
  const in14 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data } = await supabase
    .from("turnovers")
    .select("*, property:properties(name), unit:units(unit_number)")
    .eq("company_id", companyData.company_id)
    .in("status", ["not_started", "in_progress"])
    .gte("target_ready_date", today)
    .lte("target_ready_date", in14)
    .order("target_ready_date", { ascending: true })
    .limit(5);

  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Due in Next 14 Days
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {(data as unknown as TurnoverWithDetails[]).map((t) => {
            const daysLeft = Math.ceil((new Date(t.target_ready_date).getTime() - Date.now()) / 86400000);
            return (
              <Link key={t.id} href={`/turnovers/${t.id}`} className="flex items-center gap-3 py-2 hover:bg-accent/40 rounded-lg px-2 -mx-2 transition-colors group">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${daysLeft <= 3 ? "bg-red-100 text-red-700" : daysLeft <= 7 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {daysLeft}d
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.property?.name} · Unit {t.unit?.unit_number}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(t.target_ready_date)}</p>
                </div>
                <PriorityBadge priority={t.priority} />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Recent Turnovers ────────────────────────────── */
async function RecentTurnovers() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;

  const { data: turnovers } = await supabase
    .from("turnovers")
    .select("*, property:properties(id, name, city, state), unit:units(id, unit_number, bedrooms, bathrooms)")
    .eq("company_id", companyData.company_id)
    .in("status", ["not_started", "in_progress", "blocked"])
    .order("target_ready_date", { ascending: true })
    .limit(8);

  if (!turnovers || turnovers.length === 0) {
    return (
      <EmptyState
        icon={RotateCcw}
        title="No active turnovers"
        description="Create a turnover when a tenant moves out to start tracking the make-ready process."
        action={{ label: "Create first turnover", href: "/turnovers/new" }}
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {(turnovers as unknown as TurnoverWithDetails[]).map((t) => {
        const overdue = isOverdue(t.target_ready_date);
        return (
          <Link key={t.id} href={`/turnovers/${t.id}`} className="flex items-center justify-between gap-4 py-3.5 px-1 hover:bg-accent/40 rounded-lg transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${overdue ? "bg-red-100 text-red-700" : "bg-primary/10 text-primary"}`}>
                {t.unit?.unit_number?.slice(0, 3) ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.property?.name} · Unit {t.unit?.unit_number}</p>
                <p className={`mt-0.5 text-xs ${overdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                  {overdue ? "Overdue — " : "Due "}{formatDate(t.target_ready_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={t.priority} />
              <TurnoverStatusBadge status={t.status} />
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Activity ────────────────────────────────────── */
async function RecentActivity() {
  const [supabase, companyData] = await Promise.all([createClient(), getUserCompany()]);
  if (!companyData) return null;
  const { data: activities } = await supabase
    .from("activity_logs").select("*")
    .eq("company_id", companyData.company_id)
    .order("created_at", { ascending: false }).limit(15);
  return <ActivityFeed activities={activities ?? []} compact />;
}

/* ─── Skeletons ───────────────────────────────────── */
function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => <div key={i} className="rounded-xl border border-border p-6"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-9 w-16 mb-2" /><Skeleton className="h-3 w-32" /></div>)}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */
export default async function DashboardPage() {
  const user = await getUser();
  const profile = user?.user_metadata;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        description="Here's your portfolio snapshot for today."
      >
        <Button asChild>
          <Link href="/turnovers/new">
            <Plus className="h-4 w-4" />
            New Turnover
          </Link>
        </Button>
      </PageHeader>

      {/* KPI stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Portfolio overview */}
      <Suspense fallback={<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>}>
        <PortfolioSummary />
      </Suspense>

      {/* Needs attention */}
      <Suspense fallback={<Skeleton className="h-24 rounded-xl" />}>
        <NeedsAttention />
      </Suspense>

      {/* Cost overview */}
      <Suspense fallback={null}>
        <CostOverview />
      </Suspense>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active turnovers — 2 cols */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active Turnovers</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/turnovers" className="text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="flex items-center justify-between py-3"><div><Skeleton className="h-4 w-48 mb-1.5" /><Skeleton className="h-3 w-24" /></div><div className="flex gap-2"><Skeleton className="h-5 w-16 rounded-md" /><Skeleton className="h-5 w-20 rounded-md" /></div></div>)}</div>}>
                <RecentTurnovers />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming deadlines */}
          <Suspense fallback={<Skeleton className="h-56 rounded-xl" />}>
            <UpcomingDeadlines />
          </Suspense>

          {/* Activity feed */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="flex gap-3"><Skeleton className="h-6 w-6 rounded-full shrink-0" /><div><Skeleton className="h-3 w-40 mb-1.5" /><Skeleton className="h-2.5 w-20" /></div></div>)}</div>}>
                <RecentActivity />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Add Property", href: "/properties/new", icon: Building2, color: "bg-blue-50 text-blue-600" },
              { label: "Add Unit", href: "/units/new", icon: Home, color: "bg-violet-50 text-violet-600" },
              { label: "New Turnover", href: "/turnovers/new", icon: Plus, color: "bg-emerald-50 text-emerald-600" },
              { label: "View Turnovers", href: "/turnovers", icon: RotateCcw, color: "bg-amber-50 text-amber-600" },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-accent/50 hover:border-primary/20 transition-all duration-150 group">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                  <action.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
