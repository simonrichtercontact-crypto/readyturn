"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUserCompany, getUser } from "@/lib/supabase/server";

export async function updateProfile(data: { fullName: string }) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: data.fullName })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function updateCompany(data: { name: string }) {
  const supabase = await createClient();
  const companyData = await getUserCompany();

  if (!companyData) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("companies")
    .update({ name: data.name })
    .eq("id", companyData.company_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}
