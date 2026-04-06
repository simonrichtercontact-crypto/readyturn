import { getTemplates } from "@/lib/actions/templates";
import { PageHeader } from "@/components/shared/page-header";
import { TemplateManager } from "@/features/templates/components/template-builder";
import { getUserCompany } from "@/lib/supabase/server";
import { hasFeature } from "@/lib/plans";
import { UpgradeBanner } from "@/components/shared/upgrade-banner";

export const metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const companyData = await getUserCompany();
  const planId = (companyData?.companies as { plan?: string } | null)?.plan ?? "free";
  const canUseTemplates = hasFeature(planId, "taskTemplates");

  const templates = canUseTemplates ? await getTemplates() : [];

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <PageHeader
        title="Task Templates"
        description="Create reusable task lists to apply to any turnover in seconds."
      />

      {!canUseTemplates ? (
        <UpgradeBanner
          title="Task Templates require Pro"
          description="Upgrade to Pro to create and reuse task templates across all your turnovers."
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-amber-50/50 border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-800">
              <strong>How it works:</strong> Create a template with tasks → open any Turnover → click <strong>Apply Template</strong> → all tasks are added instantly.
            </p>
          </div>
          <TemplateManager templates={templates as any} />
        </>
      )}
    </div>
  );
}
