import { createClient, getUserCompany } from "@/lib/supabase/server";
import { UnitForm } from "@/features/units/components/unit-form";

export const metadata = { title: "Add Unit" };

export default async function NewUnitPage({
  searchParams,
}: {
  searchParams: Promise<{ property_id?: string }>;
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

  return <UnitForm properties={properties ?? []} defaultPropertyId={sp.property_id} />;
}
