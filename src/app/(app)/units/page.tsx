import Link from "next/link";
import { Plus, DoorOpen, Search } from "lucide-react";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { UnitStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatBedBath, formatCurrency, formatSqFt } from "@/lib/utils";

export const metadata = { title: "Units" };

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const [supabase, companyData] = await Promise.all([
    createClient(),
    getUserCompany(),
  ]);

  if (!companyData) return null;

  let query = supabase
    .from("units")
    .select("*, property:properties(id, name, city, state)")
    .eq("company_id", companyData.company_id)
    .order("unit_number");

  if (sp.property) query = query.eq("property_id", sp.property);
  if (sp.status) query = query.eq("status", sp.status);

  const [{ data: units }, { data: properties }] = await Promise.all([
    query,
    supabase
      .from("properties")
      .select("id, name")
      .eq("company_id", companyData.company_id)
      .eq("is_archived", false)
      .order("name"),
  ]);

  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "occupied", label: "Occupied" },
    { value: "vacant", label: "Vacant" },
    { value: "make_ready", label: "Make Ready" },
    { value: "ready", label: "Ready" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Units"
        description="All units across your properties."
      >
        <Button asChild>
          <Link href="/units/new">
            <Plus className="h-4 w-4" />
            Add Unit
          </Link>
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form method="get" className="flex flex-wrap gap-3">
          <select
            name="property"
            defaultValue={sp.property || ""}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[160px]"
          >
            <option value="">All properties</option>
            {properties?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={sp.status || ""}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <Button type="submit" variant="outline" size="sm">
            <Search className="h-4 w-4" />
            Filter
          </Button>

          {(sp.property || sp.status) && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/units">Clear</Link>
            </Button>
          )}
        </form>
      </div>

      {!units || units.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={DoorOpen}
            title="No units found"
            description="Add units to your properties to start tracking turnovers."
            action={{ label: "Add a unit", href: "/units/new" }}
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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Layout</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sq Ft</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rent</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {units.map((unit) => {
                  const prop = unit.property as { id: string; name: string; city: string; state: string } | null;
                  return (
                    <tr
                      key={unit.id}
                      className="hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/units/${unit.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {unit.unit_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {prop && (
                          <Link
                            href={`/properties/${prop.id}`}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {prop.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatBedBath(unit.bedrooms, unit.bathrooms)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatSqFt(unit.square_feet)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatCurrency(unit.market_rent)}
                      </td>
                      <td className="px-4 py-3">
                        <UnitStatusBadge status={unit.status} />
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
