import Link from "next/link";
import { Plus, RotateCcw, AlertTriangle, Search, X } from "lucide-react";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TurnoverStatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { Button } from "@/components/ui/button";
import { formatDate, isOverdue } from "@/lib/utils";
import type { TurnoverWithDetails } from "@/types/database";
import { TurnoverFilters } from "@/features/turnovers/components/turnover-filters";
import { UpgradeBanner } from "@/components/shared/upgrade-banner";
import { isAtLimit, getPlan, hasFeature } from "@/lib/plans";
import { ExportCsvButton } from "@/features/turnovers/components/export-csv-button";

export const metadata = { title: "Turnovers" };

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "ready", label: "Ready" },
];

export default async function TurnoversPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; property?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const [supabase, companyData] = await Promise.all([
    createClient(),
    getUserCompany(),
  ]);

  if (!companyData) return null;

  let query = supabase
    .from("turnovers")
    .select(`
      *,
      property:properties(id, name, city, state),
      unit:units(id, unit_number, bedrooms, bathrooms)
    `)
    .eq("company_id", companyData.company_id)
    .order("target_ready_date", { ascending: true });

  if (sp.status) query = query.eq("status", sp.status);
  if (sp.priority) query = query.eq("priority", sp.priority);
  if (sp.property) query = query.eq("property_id", sp.property);

  const [{ data: turnovers }, { data: properties }] = await Promise.all([
    query,
    supabase
      .from("properties")
      .select("id, name")
      .eq("company_id", companyData.company_id)
      .eq("is_archived", false)
      .order("name"),
  ]);

  // Client-side text search filter
  const searchQuery = sp.q?.toLowerCase() || "";
  const filteredTurnovers = searchQuery
    ? turnovers?.filter((t) => {
        const prop = t.property as { name: string } | null;
        const unit = t.unit as { unit_number: string } | null;
        return (
          prop?.name?.toLowerCase().includes(searchQuery) ||
          unit?.unit_number?.toLowerCase().includes(searchQuery) ||
          t.notes?.toLowerCase().includes(searchQuery)
        );
      })
    : turnovers;

  const activeFilter = sp.status || "";
  const company = companyData.companies as { plan?: string } | null;
  const planId = company?.plan ?? "free";
  const plan = getPlan(planId);
  const { count: activeTurnoverCount } = await supabase
    .from("turnovers")
    .select("id", { count: "exact" })
    .eq("company_id", companyData.company_id)
    .in("status", ["not_started", "in_progress", "blocked"]);
  const atTurnoverLimit = isAtLimit(planId, "activeTurnovers", activeTurnoverCount ?? 0);
  const canExportCsv = hasFeature(planId, "csvExport");

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Turnovers"
        description="Track all unit turnovers and make-ready operations."
      >
        {canExportCsv && <ExportCsvButton />}
        {!atTurnoverLimit && (
          <Button asChild>
            <Link href="/turnovers/new">
              <Plus className="h-4 w-4" />
              New Turnover
            </Link>
          </Button>
        )}
      </PageHeader>

      {atTurnoverLimit && (
        <UpgradeBanner
          variant="inline"
          title={`Active turnover limit reached (${plan.limits.activeTurnovers} on ${plan.name} plan)`}
          description="Upgrade to create unlimited turnovers."
        />
      )}

      {/* Search bar */}
      <form method="get" className="relative">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {sp.priority && <input type="hidden" name="priority" value={sp.priority} />}
        {sp.property && <input type="hidden" name="property" value={sp.property} />}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          name="q"
          defaultValue={sp.q || ""}
          placeholder="Search by unit number or property name..."
          className="w-full h-10 pl-9 pr-9 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {sp.q && (
          <Link href={sp.status ? `/turnovers?status=${sp.status}` : "/turnovers"} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Link>
        )}
      </form>

      {/* Status tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/turnovers?status=${f.value}` : "/turnovers"}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeFilter === f.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}

        <TurnoverFilters properties={properties ?? []} />
      </div>

      {!filteredTurnovers || filteredTurnovers.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={RotateCcw}
            title="No turnovers found"
            description="Create a turnover when a tenant moves out to start tracking the make-ready process."
            action={{ label: "Create turnover", href: "/turnovers/new" }}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unit</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Property</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Move Out</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Target Ready</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(filteredTurnovers as unknown as TurnoverWithDetails[]).map((t) => {
                  const overdue = isOverdue(t.target_ready_date) && t.status !== "ready";
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-accent/30 transition-colors ${
                        t.status === "blocked" ? "bg-red-50/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/turnovers/${t.id}`}
                          className="font-medium text-primary hover:underline flex items-center gap-1.5"
                        >
                          Unit {t.unit?.unit_number}
                          {overdue && (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {t.property?.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(t.move_out_date)}
                      </td>
                      <td className={`px-4 py-3 font-medium ${overdue ? "text-red-600" : "text-foreground"}`}>
                        {formatDate(t.target_ready_date)}
                        {overdue && <span className="ml-1 text-xs">(overdue)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <TurnoverStatusBadge status={t.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
