import { notFound } from "next/navigation";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { PropertyForm } from "@/features/properties/components/property-form";

export const metadata = { title: "Edit Property" };

export default async function EditPropertyPage({
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

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("company_id", companyData.company_id)
    .single();

  if (!property) notFound();

  return <PropertyForm property={property} />;
}
