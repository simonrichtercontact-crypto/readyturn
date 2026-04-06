import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Pencil,
  Building2,
  DoorOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { TurnoverStatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatDate, isOverdue } from "@/lib/utils";
import { TaskList } from "@/features/turnovers/components/task-list";
import { StatusUpdater } from "@/features/turnovers/components/status-updater";
import { PhotoSection } from "@/features/turnovers/components/photo-section";
import { UpgradeBanner } from "@/components/shared/upgrade-banner";
import { hasFeature, getPlan } from "@/lib/plans";
import { getTemplates } from "@/lib/actions/templates";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("turnovers")
    .select("unit:units(unit_number), property:properties(name)")
    .eq("id", id)
    .single();
  const row = data as { unit: { unit_number: string } | null; property: { name: string } | null } | null;
  const unit = row?.unit;
  const property = row?.property;
  return { title: `Turnover – Unit ${unit?.unit_number || ""} @ ${property?.name || ""}` };
}

export default async function TurnoverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supabase, companyData] = await Promise.all([
    createClient(),
    getUserCompany(),
  ]);

  if (!companyData) return null;

  const [{ data: turnover }, { data: tasks }, { data: photos }, { data: activity }] =
    await Promise.all([
      supabase
        .from("turnovers")
        .select(`
          *,
          property:properties(id, name, city, state),
          unit:units(id, unit_number, bedrooms, bathrooms)
        `)
        .eq("id", id)
        .eq("company_id", companyData.company_id)
        .single(),
      supabase
        .from("turnover_tasks")
        .select("*")
        .eq("turnover_id", id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("turnover_photos")
        .select("*")
        .eq("turnover_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("*")
        .eq("entity_id", id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  if (!turnover) notFound();

  const property = turnover.property as { id: string; name: string; city: string; state: string } | null;
  const unit = turnover.unit as { id: string; unit_number: string; bedrooms: number | null; bathrooms: number | null } | null;
  const planId = (companyData.companies as { plan?: string } | null)?.plan ?? "free";
  const canUploadPhotos = hasFeature(planId, "photoUploads");
  const canUseTemplates = hasFeature(planId, "taskTemplates");
  const templates = canUseTemplates ? await getTemplates() : [];

  const overdue =
    isOverdue(turnover.target_ready_date) && turnover.status !== "ready";
  const totalTasks = tasks?.length ?? 0;
  const doneTasks = tasks?.filter((t) => t.status === "done").length ?? 0;
  const blockedTasks = tasks?.filter((t) => t.status === "blocked").length ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={`Unit ${unit?.unit_number} Turnover`}
        description={property ? `${property.name} · ${property.city}, ${property.state}` : ""}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/turnovers/${id}/edit`}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
      </PageHeader>

      {/* Alerts */}
      {turnover.status === "blocked" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Turnover is blocked.</strong> This unit requires immediate attention before work can continue.
          </AlertDescription>
        </Alert>
      )}
      {overdue && (
        <Alert variant="warning">
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            This turnover is <strong>past its target ready date</strong> ({formatDate(turnover.target_ready_date)}).
          </AlertDescription>
        </Alert>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Status</p>
          <TurnoverStatusBadge status={turnover.status} className="text-sm" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Priority</p>
          <PriorityBadge priority={turnover.priority} className="text-sm" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Move Out</p>
          <p className="text-sm font-semibold">{formatDate(turnover.move_out_date)}</p>
        </div>
        <div className={`rounded-xl border bg-card p-5 ${overdue ? "border-red-200 bg-red-50/50" : "border-border"}`}>
          <p className={`text-xs uppercase tracking-wider font-medium mb-2 ${overdue ? "text-red-500" : "text-muted-foreground"}`}>
            Target Ready
          </p>
          <p className={`text-sm font-semibold ${overdue ? "text-red-600" : ""}`}>
            {formatDate(turnover.target_ready_date)}
            {overdue && " ⚠"}
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Task progress */}
          {totalTasks > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Task Progress</p>
                <p className="text-sm text-muted-foreground">
                  {doneTasks} / {totalTasks} completed
                </p>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
              {blockedTasks > 0 && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {blockedTasks} task{blockedTasks > 1 ? "s" : ""} blocked
                </p>
              )}
            </div>
          )}

          {/* Tasks */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Tasks</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TaskList
                tasks={tasks ?? []}
                turnoverID={id}
                companyId={companyData.company_id}
                templates={templates as any[]}
                canUseTemplates={canUseTemplates}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Photos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {canUploadPhotos ? (
                <PhotoSection
                  photos={photos ?? []}
                  turnoverID={id}
                  companyId={companyData.company_id}
                />
              ) : (
                <UpgradeBanner
                  title="Photo uploads require Pro"
                  description="Upgrade to Pro to attach photos to your turnovers."
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status updater */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <StatusUpdater
                turnoverID={id}
                currentStatus={turnover.status}
              />
            </CardContent>
          </Card>

          {/* Unit & Property */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {unit && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Unit</p>
                  <Link
                    href={`/units/${unit.id}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <DoorOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Unit {unit.unit_number}
                      </p>
                      {(unit.bedrooms || unit.bathrooms) && (
                        <p className="text-xs text-muted-foreground">
                          {unit.bedrooms}BR / {unit.bathrooms}BA
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              )}

              <Separator />

              {property && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Property</p>
                  <Link
                    href={`/properties/${property.id}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {property.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              )}

              {turnover.actual_ready_date && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Completed</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <p className="text-sm font-medium">{formatDate(turnover.actual_ready_date)}</p>
                    </div>
                  </div>
                </>
              )}

              {turnover.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Notes</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{turnover.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ActivityFeed activities={activity ?? []} compact />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
