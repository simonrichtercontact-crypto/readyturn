import Link from "next/link";
import { Check, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export const metadata = { title: "Pricing – TurnReady" };

const plans = [PLANS.free, PLANS.pro, PLANS.business];

function limitLabel(val: number | boolean): string {
  if (val === true) return "✓";
  if (val === false) return "✗";
  if (val === -1) return "Unlimited";
  return String(val);
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">TurnReady</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when your portfolio grows. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.id === "pro"
                  ? "border-primary shadow-lg shadow-primary/10 bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm">/month</span>
                  )}
                  {plan.price === 0 && (
                    <span className="text-muted-foreground text-sm">forever</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.price === 0 ? "/sign-up" : "/sign-up"}>
                <Button
                  className="w-full"
                  variant={plan.id === "pro" ? "default" : "outline"}
                  size="lg"
                >
                  {plan.price === 0 ? "Get started free" : `Start ${plan.name}`}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10 text-foreground">Compare plans</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className="px-6 py-4 text-center font-semibold text-foreground">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: "Properties", key: "properties" as const },
                  { label: "Units", key: "units" as const },
                  { label: "Active turnovers", key: "activeTurnovers" as const },
                  { label: "Team members", key: "teamMembers" as const },
                  { label: "Photo uploads", key: "photoUploads" as const },
                  { label: "Task templates", key: "taskTemplates" as const },
                  { label: "CSV export", key: "csvExport" as const },
                  { label: "Advanced analytics", key: "analytics" as const },
                  { label: "Priority support", key: "prioritySupport" as const },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{row.label}</td>
                    {plans.map((p) => {
                      const val = p.limits[row.key];
                      const isBoolean = typeof val === "boolean";
                      return (
                        <td key={p.id} className="px-6 py-4 text-center">
                          {isBoolean ? (
                            val ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className={`font-medium ${val === -1 ? "text-primary" : "text-foreground"}`}>
                              {val === -1 ? "Unlimited" : val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground text-sm">
            Questions?{" "}
            <a href="mailto:hello@turnready.app" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
