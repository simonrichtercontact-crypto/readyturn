"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUserCompany, getUser } from "@/lib/supabase/server";
import type { TaskFormData } from "@/lib/validations/task";

export async function createTask(turnoverID: string, data: TaskFormData) {
  const supabase = await createClient();
  const [companyData, user] = await Promise.all([getUserCompany(), getUser()]);

  if (!companyData || !user) {
    return { error: "Unauthorized" };
  }

  const { data: task, error } = await supabase
    .from("turnover_tasks")
    .insert({
      company_id: companyData.company_id,
      turnover_id: turnoverID,
      title: data.title,
      description: data.description || null,
      assigned_to_name: data.assigned_to_name || null,
      due_date: data.due_date || null,
      status: data.status,
      priority: data.priority,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabase.from("activity_logs").insert({
    company_id: companyData.company_id,
    user_id: user.id,
    entity_type: "task",
    entity_id: task.id,
    action_type: "created",
    message: `Task "${data.title}" was added`,
  });

  revalidatePath(`/turnovers/${turnoverID}`);
  return { success: true, task };
}

export async function updateTask(taskId: string, turnoverID: string, data: TaskFormData) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("turnover_tasks")
    .update({
      title: data.title,
      description: data.description || null,
      assigned_to_name: data.assigned_to_name || null,
      due_date: data.due_date || null,
      status: data.status,
      priority: data.priority,
    })
    .eq("id", taskId)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/turnovers/${turnoverID}`);
  return { success: true };
}

export async function updateTaskStatus(taskId: string, turnoverID: string, status: string) {
  const supabase = await createClient();
  const [companyData, user] = await Promise.all([getUserCompany(), getUser()]);

  if (!companyData || !user) {
    return { error: "Unauthorized" };
  }

  const { data: task, error } = await supabase
    .from("turnover_tasks")
    .update({ status: status as "not_started" | "in_progress" | "done" | "blocked" })
    .eq("id", taskId)
    .eq("company_id", companyData.company_id)
    .select("title")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (status === "done") {
    await supabase.from("activity_logs").insert({
      company_id: companyData.company_id,
      user_id: user.id,
      entity_type: "task",
      entity_id: taskId,
      action_type: "completed",
      message: `Task "${task.title}" was completed`,
    });
  }

  revalidatePath(`/turnovers/${turnoverID}`);
  return { success: true };
}

export async function deleteTask(taskId: string, turnoverID: string) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("turnover_tasks")
    .delete()
    .eq("id", taskId)
    .eq("company_id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/turnovers/${turnoverID}`);
  return { success: true };
}
