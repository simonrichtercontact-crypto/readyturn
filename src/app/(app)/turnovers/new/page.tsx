import { createClient, getUserCompany } from "@/lib/supabase/server";
import { TurnoverForm } from "@/features/turnovers/components/turnover-form";

export const metadata = { title: "New Turnover" };

export default async function NewTurnoverPage({
  searchParams,
}: {
  searchParams: Promise<{ property_id?: string; unit_id?: string }>;
}) {
  const sp = await searchParams;
  const [supabase, companyData] = await Promise.all([
    createClient(),
    getUserCompany(),
  ]);

  if (!companyData) return null;

  const { data: properties } = await supabase
    .from("properties")
    .select("id, name")
    .eq("company_id", companyData.company_id)
    .eq("is_archived", false)
    .order("name");

  const { data: units } = await supabase
    .from("units")
    .select("id, unit_number, property_id")
    .eq("company_id", companyData.company_id)
    .order("unit_number");

  return (
    <TurnoverForm
      properties={properties ?? []}
      units={units ?? []}
      defaultPropertyId={sp.property_id}
      defaultUnitId={sp.unit_id}
    />
  );
}
