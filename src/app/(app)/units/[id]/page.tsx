import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Plus, Building2, RotateCcw } from "lucide-react";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { UnitStatusBadge } from "@/components/shared/status-badge";
import { TurnoverStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatSqFt, formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("units").select("unit_number").eq("id", id).single();
  return { title: `Unit ${(data as { unit_number: string } | null)?.unit_number || ""}` };
}

export default async function UnitDetailPage({
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

  const [{ data: unit }, { data: turnovers }] = await Promise.all([
    supabase
      .from("units")
      .select("*, property:properties(id, name, city, state, address_line_1)")
      .eq("id", id)
      .eq("company_id", companyData.company_id)
      .single(),
    supabase
      .from("turnovers")
      .select("*")
      .eq("unit_id", id)
      .eq("company_id", companyData.company_id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (!unit) notFound();

  const property = unit.property as { id: string; name: string; city: string; state: string; address_line_1: string } | null;

  const activeTurnover = turnovers?.find((t) =>
    ["not_started", "in_progress", "blocked"].includes(t.status)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Unit ${unit.unit_number}`}
        description={property ? `${property.name} · ${property.city}, ${property.state}` : ""}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/units/${id}/edit`}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        {!activeTurnover && (
          <Button asChild size="sm">
            <Link href={`/turnovers/new?unit_id=${id}`}>
              <Plus className="h-3.5 w-3.5" />
              Start Turnover
            </Link>
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unit details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                    Current Status
                  </p>
                  <UnitStatusBadge status={unit.status} className="text-sm px-3 py-1" />
                </div>
                {activeTurnover && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1.5">Active Turnover</p>
                    <Link href={`/turnovers/${activeTurnover.id}`}>
                      <TurnoverStatusBadge status={activeTurnover.status} className="text-sm px-3 py-1" />
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unit Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Bedrooms", value: unit.bedrooms ?? "—" },
                  { label: "Bathrooms", value: unit.bathrooms ?? "—" },
                  { label: "Square Feet", value: formatSqFt(unit.square_feet) },
                  { label: "Market Rent", value: formatCurrency(unit.market_rent) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {unit.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm text-foreground">{unit.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Turnover history */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Turnover History</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/turnovers/new?unit_id=${id}`}>
                    <Plus className="h-3.5 w-3.5" />
                    New
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {!turnovers || turnovers.length === 0 ? (
                <div className="py-6 text-center">
                  <RotateCcw className="mx-auto h-7 w-7 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No turnovers yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {turnovers.map((t) => (
                    <Link
                      key={t.id}
                      href={`/turnovers/${t.id}`}
                      className="flex items-center justify-between py-3 hover:bg-accent/40 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">Move out {formatDate(t.move_out_date)}</p>
                        <p className="text-xs text-muted-foreground">Target: {formatDate(t.target_ready_date)}</p>
                      </div>
                      <TurnoverStatusBadge status={t.status} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Property</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {property && (
                <Link href={`/properties/${property.id}`} className="group">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                      <Building2 className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {property.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {property.address_line_1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.city}, {property.state}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
