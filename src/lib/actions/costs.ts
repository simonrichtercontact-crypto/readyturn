"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUserCompany } from "@/lib/supabase/server";

export async function updateTaskCost(
  taskId: string,
  turnoverID: string,
  estimated_cost: number | null,
  actual_cost: number | null
) {
  const supabase = await createClient();
  const companyData = await getUserCompany();
  if (!companyData) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("turnover_tasks")
    .update({ estimated_cost, actual_cost })
    .eq("id", taskId)
    .eq("company_id", companyData.company_id);

  if (error) return { error: error.message };

  revalidatePath(`/turnovers/${turnoverID}`);
  return { success: true };
}
