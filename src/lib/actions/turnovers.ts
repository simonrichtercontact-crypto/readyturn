"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getUserCompany, getUser } from "@/lib/supabase/server";
import type { TurnoverFormData } from "@/lib/validations/turnover";

export async function createTurnover(data: TurnoverFormData) {
  const supabase = await createClient();
  const [companyData, user] = await Promise.all([getUserCompany(), getUser()]);

  if (!companyData || !user) {
    return { error: "Unauthorized" };
  }

  const { data: turnover, error } = await supabase
    .from("turnovers")
    .insert({
      company_id: companyData.company_id,
      property_id: data.property_id,
      unit_id: data.unit_id,
      move_out_date: data.move_out_date,
      target_ready_date: data.target_ready_date,
      status: data.status,
      priority: data.priority,
      notes: data.notes || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update unit status to make_ready
  await supabase
    .from("units")
    .update({ status: "make_ready" })
    .eq("id", data.unit_id)
    .eq("company_id", companyData.company_id);

  // Log activity
  await supabase.from("activity_logs").insert({
    company_id: companyData.company_id,
    user_id: user.id,
    entity_type: "turnover",
    entity_id: turnover.id,
    action_type: "created",
    message: `Turnover created`,
  });

  revalidatePath("/turnovers");
  redirect(`/turnovers/${turnover.id}`);
}

export async function updateTurnover(id: string, data: TurnoverFormData) {
  const supabase = await createClient();
  const [companyData, user] = await Promise.all([getUserCompany(), getUser()]);

  if (!companyData || !user) {
    return { error: "Unauthorized" };
  }

  // Get previous status to detect changes
  const { data: prev } = await supabase
    .from("turnovers")
    .select("status, priority")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("turnovers")
    .update({
      property_id: data.property_id,
      unit_id: data.unit_id,
      move_out_date: data.move_out_date,
      target_ready_date: data.target_ready_date,
      status: data.status,
      priority: data.priority,
      notes: data.notes || null,
    })
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  if (prev && prev.status !== data.status) {
    await supabase.from("activity_logs").insert({
      company_id: companyData.company_id,
      user_id: user.id,
      entity_type: "turnover",
      entity_id: id,
      action_type: "status_changed",
      message: `Status changed from "${prev.status}" to "${data.status}"`,
    });
  }

  revalidatePath(`/turnovers/${id}`);
  redirect(`/turnovers/${id}`);
}

export async function updateTurnoverStatus(id: string, status: string) {
  const supabase = await createClient();
  const [companyData, user] = await Promise.all([getUserCompany(), getUser()]);

  if (!companyData || !user) {
    return { error: "Unauthorized" };
  }

  const updateData: Record<string, string | null> = {
    status,
    actual_ready_date: status === "ready" ? new Date().toISOString().split("T")[0] : null,
  };

  const { error } = await supabase
    .from("turnovers")
    .update(updateData)
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  // If marking as ready, update unit status
  if (status === "ready") {
    const { data: turnover } = await supabase
      .from("turnovers")
      .select("unit_id")
      .eq("id", id)
      .single();

    if (turnover) {
      await supabase
        .from("units")
        .update({ status: "ready" })
        .eq("id", turnover.unit_id);
    }
  }

  await supabase.from("activity_logs").insert({
    company_id: companyData.company_id,
    user_id: user.id,
    entity_type: "turnover",
    entity_id: id,
    action_type: "status_changed",
    message: `Status updated to "${status}"`,
  });

  revalidatePath(`/turnovers/${id}`);
  revalidatePath("/turnovers");
  return { success: true };
}

export async function deleteTurnover(id: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("turnovers")
    .delete()
    .eq("id", id)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/turnovers");
  return { success: true };
}
