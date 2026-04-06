"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function createCompany(formData: FormData) {
  const companyName = (formData.get("companyName") as string)?.trim();
  if (!companyName) return { error: "Company name is required." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const admin = createServiceClient();

  // Check if user already has a company
  const { data: existing } = await admin
    .from("company_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (existing) redirect("/dashboard");

  // Create company
  const { data: company, error: companyError } = await admin
    .from("companies")
    .insert({ name: companyName })
    .select()
    .single();

  if (companyError) {
    return { error: "Failed to create company: " + companyError.message };
  }

  // Create membership
  const { error: memberError } = await admin
    .from("company_members")
    .insert({ company_id: company.id, user_id: user.id, role: "owner" });

  if (memberError) {
    return { error: "Failed to join company: " + memberError.message };
  }

  redirect("/dashboard");
}
