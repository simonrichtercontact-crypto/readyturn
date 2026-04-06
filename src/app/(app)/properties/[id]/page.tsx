import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  DoorOpen,
  RotateCcw,
  Pencil,
  Plus,
} from "lucide-react";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { TurnoverStatusBadge } from "@/components/shared/status-badge";
import { UnitStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatBedBath } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("name").eq("id", id).single();
  return { title: (data as { name: string } | null)?.name || "Property" };
}

export default async function PropertyDetailPage({
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

  const [{ data: property }, { data: units }, { data: turnovers }] =
    await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("company_id", companyData.company_id)
        .single(),
      supabase
        .from("units")
        .select("*")
        .eq("property_id", id)
        .eq("company_id", companyData.company_id)
        .order("unit_number"),
      supabase
        .from("turnovers")
        .select(`*, unit:units(unit_number)`)
        .eq("property_id", id)
        .eq("company_id", companyData.company_id)
        .in("status", ["not_started", "in_progress", "blocked"])
        .order("target_ready_date"),
    ]);

  if (!property) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={property.name}
        description={`${property.address_line_1}${property.address_line_2 ? `, ${property.address_line_2}` : ""}, ${property.city}, ${property.state} ${property.postal_code}`}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/properties/${id}/edit`}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/units/new?property_id=${id}`}>
            <Plus className="h-3.5 w-3.5" />
            Add Unit
          </Link>
        </Button>
      </PageHeader>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DoorOpen className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Units</span>
          </div>
          <p className="text-2xl font-bold">{units?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Active Turnovers</span>
          </div>
          <p className="text-2xl font-bold">{turnovers?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Location</span>
          </div>
          <p className="text-sm font-medium truncate">{property.city}, {property.state}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Units */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Units</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/units/new?property_id=${id}`}>
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {!units || units.length === 0 ? (
              <div className="py-8 text-center">
                <DoorOpen className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No units yet</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href={`/units/new?property_id=${id}`}>Add first unit</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {units.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/units/${unit.id}`}
                    className="flex items-center justify-between py-3 hover:bg-accent/40 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">Unit {unit.unit_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBedBath(unit.bedrooms, unit.bathrooms)}
                      </p>
                    </div>
                    <UnitStatusBadge status={unit.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active turnovers */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Active Turnovers</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/turnovers/new?property_id=${id}`}>
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {!turnovers || turnovers.length === 0 ? (
              <div className="py-8 text-center">
                <RotateCcw className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No active turnovers</p>
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
                      <p className="text-sm font-medium">
                        Unit {(t.unit as { unit_number: string } | null)?.unit_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(t.target_ready_date)}
                      </p>
                    </div>
                    <TurnoverStatusBadge status={t.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {property.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{property.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
