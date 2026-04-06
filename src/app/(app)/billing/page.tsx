import { createServiceClient, getUserCompany } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS, getPlan } from "@/lib/plans";
import { notFound } from "next/navigation";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Billing" };

const planIcons = {
  free: Zap,
  pro: Crown,
  business: Building2,
};

const planColors = {
  free: "bg-slate-100 text-slate-600",
  pro: "bg-primary/10 text-primary",
  business: "bg-violet-100 text-violet-700",
};

export default async function BillingPage() {
  const companyData = await getUserCompany();
  if (!companyData) return notFound();

  const admin = createServiceClient();
  const { data: company } = await admin
    .from("companies")
    .select("id, name, plan, plan_started_at")
    .eq("id", companyData.company_id)
    .single();

  const currentPlanId = (company?.plan ?? "free") as "free" | "pro" | "business";
  const currentPlan = getPlan(currentPlanId);
  const Icon = planIcons[currentPlanId];

  // Usage counts
  const { count: propertyCount } = await admin
    .from("properties")
    .select("id", { count: "exact" })
    .eq("company_id", companyData.company_id)
    .eq("is_archived", false);

  const { count: unitCount } = await admin
    .from("units")
    .select("id", { count: "exact" })
    .eq("company_id", companyData.company_id);

  const { count: activeTurnoverCount } = await admin
    .from("turnovers")
    .select("id", { count: "exact" })
    .eq("company_id", companyData.company_id)
    .in("status", ["not_started", "in_progress", "blocked"]);

  const { count: memberCount } = await admin
    .from("company_members")
    .select("id", { count: "exact" })
    .eq("company_id", companyData.company_id);

  function usageBar(current: number, limit: number) {
    if (limit === -1) return null;
    const pct = Math.min((current / limit) * 100, 100);
    const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{current} used</span>
          <span>{limit} max</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  const usage = [
    { label: "Properties", current: propertyCount ?? 0, limit: currentPlan.limits.properties },
    { label: "Units", current: unitCount ?? 0, limit: currentPlan.limits.units },
    { label: "Active Turnovers", current: activeTurnoverCount ?? 0, limit: currentPlan.limits.activeTurnovers },
    { label: "Team Members", current: memberCount ?? 0, limit: currentPlan.limits.teamMembers },
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription and usage."
      />

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${planColors[currentPlanId]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Current Plan: {currentPlan.name}</CardTitle>
              <CardDescription>
                {currentPlan.price === 0 ? "Free forever" : `$${currentPlan.price}/month`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usage.map((u) => (
              <div key={u.label} className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{u.label}</p>
                <p className="text-2xl font-bold text-foreground">{u.current}</p>
                {usageBar(u.current, u.limit)}
                {u.limit === -1 && <p className="mt-1 text-xs text-emerald-600 font-medium">Unlimited</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade plans */}
      {currentPlanId !== "business" && (
        <div>
          <h2 className="text-base font-semibold mb-4 text-foreground">Upgrade your plan</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[PLANS.pro, PLANS.business]
              .filter((p) => {
                if (currentPlanId === "free") return true;
                if (currentPlanId === "pro") return p.id === "business";
                return false;
              })
              .map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-6 flex flex-col ${
                    plan.id === "pro" ? "border-primary bg-card shadow-md shadow-primary/10" : "border-border bg-card"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute top-4 right-4 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:hello@turntiva.app?subject=Upgrade to ${plan.name}&body=Hi, I'd like to upgrade my TurnTiva account (${company?.name}) to the ${plan.name} plan.`}
                    className="w-full"
                  >
                    <Button className="w-full" variant={plan.id === "pro" ? "default" : "outline"}>
                      <Zap className="h-4 w-4" />
                      Upgrade to {plan.name}
                    </Button>
                  </a>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Upgrades are processed manually. We'll activate your plan within 1 hour.{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              View full comparison
            </Link>
          </p>
        </div>
      )}

      {currentPlanId === "business" && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5 text-center">
          <Crown className="h-8 w-8 text-violet-600 mx-auto mb-2" />
          <p className="font-semibold text-violet-900">You're on the Business plan</p>
          <p className="text-sm text-violet-700 mt-1">You have access to all features. Thank you!</p>
        </div>
      )}
    </div>
  );
}
