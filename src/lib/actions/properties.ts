"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import type { PropertyFormData } from "@/lib/validations/property";

export async function createProperty(data: PropertyFormData) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      company_id: companyData.company_id,
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || null,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Log activity
  await supabase.from("activity_logs").insert({
    company_id: companyData.company_id,
    entity_type: "property",
    entity_id: property.id,
    action_type: "created",
    message: `Property "${data.name}" was created`,
  });

  revalidatePath("/properties");
  redirect(`/properties/${property.id}`);
}

export async function updateProperty(id: string, data: PropertyFormData) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("properties")
    .update({
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || null,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      notes: data.notes || null,
    })
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/properties/${id}`);
  redirect(`/properties/${id}`);
}

export async function archiveProperty(id: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("properties")
    .update({ is_archived: true })
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/properties");
  return { success: true };
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  // Check for active turnovers
  const { count } = await supabase
    .from("turnovers")
    .select("id", { count: "exact" })
    .eq("property_id", id)
    .in("status", ["not_started", "in_progress", "blocked"]);

  if (count && count > 0) {
    return { error: "Cannot delete a property with active turnovers." };
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/properties");
  return { success: true };
}
