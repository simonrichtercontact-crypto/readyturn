import Link from "next/link";
import { Plus, Building2, MapPin, DoorOpen } from "lucide-react";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpgradeBanner } from "@/components/shared/upgrade-banner";
import { isAtLimit, getPlan } from "@/lib/plans";

export const metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const [supabase, companyData] = await Promise.all([
    createClient(),
    getUserCompany(),
  ]);

  if (!companyData) return null;

  const company = companyData.companies as { plan?: string } | null;
  const planId = company?.plan ?? "free";
  const plan = getPlan(planId);

  const { data: properties } = await supabase
    .from("properties")
    .select(`
      *,
      units:units(count),
      activeturnovers:turnovers(count)
    `)
    .eq("company_id", companyData.company_id)
    .eq("is_archived", false)
    .order("name");

  const propertyCount = properties?.length ?? 0;
  const atPropertyLimit = isAtLimit(planId, "properties", propertyCount);

  // Fetch unit counts and active turnover counts per property
  const { data: unitCounts } = await supabase
    .from("units")
    .select("property_id")
    .eq("company_id", companyData.company_id);

  const { data: activeTurnovers } = await supabase
    .from("turnovers")
    .select("property_id")
    .eq("company_id", companyData.company_id)
    .in("status", ["not_started", "in_progress", "blocked"]);

  const unitCountMap: Record<string, number> = {};
  unitCounts?.forEach((u) => {
    unitCountMap[u.property_id] = (unitCountMap[u.property_id] || 0) + 1;
  });

  const activeTurnoverMap: Record<string, number> = {};
  activeTurnovers?.forEach((t) => {
    activeTurnoverMap[t.property_id] = (activeTurnoverMap[t.property_id] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Properties"
        description="Manage your rental properties and their units."
      >
        {!atPropertyLimit && (
          <Button asChild>
            <Link href="/properties/new">
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </Button>
        )}
      </PageHeader>

      {atPropertyLimit && (
        <UpgradeBanner
          variant="inline"
          title={`Property limit reached (${plan.limits.properties} on ${plan.name} plan)`}
          description="Upgrade to add more properties."
        />
      )}

      {!properties || properties.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={Building2}
            title="No properties yet"
            description="Add your first property to start managing units and turnovers."
            action={{ label: "Add your first property", href: "/properties/new" }}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const unitCount = unitCountMap[property.id] || 0;
            const activeTurnoverCount = activeTurnoverMap[property.id] || 0;

            return (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="h-full hover:shadow-soft hover:border-primary/20 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      {activeTurnoverCount > 0 && (
                        <Badge variant="info">
                          {activeTurnoverCount} active
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground">{property.name}</h3>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {property.city}, {property.state}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {property.address_line_1}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground border-t border-border pt-4">
                      <DoorOpen className="h-3.5 w-3.5" />
                      <span>{unitCount} unit{unitCount !== 1 ? "s" : ""}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
