"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import type { UnitFormData } from "@/lib/validations/unit";

export async function createUnit(data: UnitFormData) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { data: unit, error } = await supabase
    .from("units")
    .insert({
      company_id: companyData.company_id,
      property_id: data.property_id,
      unit_number: data.unit_number,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      square_feet: data.square_feet ?? null,
      market_rent: data.market_rent ?? null,
      notes: data.notes || null,
      status: data.status,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/units");
  revalidatePath(`/properties/${data.property_id}`);
  redirect(`/units/${unit.id}`);
}

export async function updateUnit(id: string, data: UnitFormData) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("units")
    .update({
      unit_number: data.unit_number,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      square_feet: data.square_feet ?? null,
      market_rent: data.market_rent ?? null,
      notes: data.notes || null,
      status: data.status,
    })
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/units/${id}`);
  redirect(`/units/${id}`);
}

export async function updateUnitStatus(id: string, status: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("units")
    .update({ status: status as "occupied" | "vacant" | "make_ready" | "ready" })
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/units/${id}`);
  return { success: true };
}

export async function deleteUnit(id: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { count } = await supabase
    .from("turnovers")
    .select("id", { count: "exact" })
    .eq("unit_id", id)
    .in("status", ["not_started", "in_progress", "blocked"]);

  if (count && count > 0) {
    return { error: "Cannot delete a unit with active turnovers." };
  }

  const { error } = await supabase
    .from("units")
    .delete()
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/units");
  return { success: true };
}
