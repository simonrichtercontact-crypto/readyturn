"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUserCompany } from "@/lib/supabase/server";

export async function getTemplates() {
  const supabase = await createClient();
  const companyData = await getUserCompany();
  if (!companyData) return [];

  const { data } = await supabase
    .from("task_templates")
    .select("*, items:task_template_items(*)")
    .eq("company_id", companyData.company_id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function createTemplate(formData: FormData) {
  const supabase = await createClient();
  const companyData = await getUserCompany();
  if (!companyData) return { error: "Unauthorized" };

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const itemsJson = formData.get("items") as string;

  if (!name) return { error: "Name is required" };

  const { data: template, error } = await supabase
    .from("task_templates")
    .insert({ company_id: companyData.company_id, name, description: description || null })
    .select()
    .single();

  if (error) return { error: error.message };

  // Insert items
  if (itemsJson) {
    const items = JSON.parse(itemsJson) as { title: string; priority: string; sort_order: number }[];
    if (items.length > 0) {
      await supabase.from("task_template_items").insert(
        items.map((item) => ({ ...item, template_id: template.id }))
      );
    }
  }

  revalidatePath("/templates");
  return { success: true, id: template.id };
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();
  if (!companyData) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("task_templates")
    .delete()
    .eq("id", templateId)
    .eq("company_id", companyData.company_id);

  if (error) return { error: error.message };

  revalidatePath("/templates");
  return { success: true };
}

export async function applyTemplate(templateId: string, turnoverID: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();
  if (!companyData) return { error: "Unauthorized" };

  const { data: items, error: itemsError } = await supabase
    .from("task_template_items")
    .select("*")
    .eq("template_id", templateId)
    .order("sort_order");

  if (itemsError) return { error: itemsError.message };
  if (!items || items.length === 0) return { error: "Template has no tasks" };

  const { error } = await supabase.from("turnover_tasks").insert(
    items.map((item) => ({
      company_id: companyData.company_id,
      turnover_id: turnoverID,
      title: item.title,
      description: item.description || null,
      priority: item.priority,
      status: "not_started",
      sort_order: item.sort_order,
    }))
  );

  if (error) return { error: error.message };

  revalidatePath(`/turnovers/${turnoverID}`);
  return { success: true, count: items.length };
}
