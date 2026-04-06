import { notFound } from "next/navigation";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { TurnoverForm } from "@/features/turnovers/components/turnover-form";

export const metadata = { title: "Edit Turnover" };

export default async function EditTurnoverPage({
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

  const [{ data: turnover }, { data: properties }, { data: units }] =
    await Promise.all([
      supabase
        .from("turnovers")
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
      supabase
        .from("units")
        .select("id, unit_number, property_id")
        .eq("company_id", companyData.company_id)
        .order("unit_number"),
    ]);

  if (!turnover) notFound();

  return (
    <TurnoverForm
      turnover={turnover}
      properties={properties ?? []}
      units={units ?? []}
    />
  );
}
