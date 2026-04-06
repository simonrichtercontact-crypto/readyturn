import { notFound } from "next/navigation";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { UnitForm } from "@/features/units/components/unit-form";

export const metadata = { title: "Edit Unit" };

export default async function EditUnitPage({
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

  const [{ data: unit }, { data: properties }] = await Promise.all([
    supabase
      .from("units")
      .select("*")
      .eq("id", id)
      .eq("company_id", companyData.company_id)
      .single(),
    supabase
      .from("properties")
      .select("id, name")
      .eq("company_id", companyData.company_id)
      .eq("is_archived", false)
      .order("name"),
  ]);

  if (!unit) notFound();

  return <UnitForm unit={unit} properties={properties ?? []} />;
}
