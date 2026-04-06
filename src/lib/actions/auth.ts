"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { SignUpFormData, SignInFormData, ForgotPasswordFormData } from "@/lib/validations/auth";

export async function signUp(data: SignUpFormData) {
  const supabase = await createClient();
  const admin = createServiceClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { full_name: data.fullName } },
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: "Failed to create account. Please try again." };

  // Use service role to bypass RLS for company creation
  const { data: company, error: companyError } = await admin
    .from("companies")
    .insert({ name: data.companyName })
    .select()
    .single();

  if (companyError) return { error: "Failed to create company. Please try again." };

  const { error: memberError } = await admin.from("company_members").insert({
    company_id: company.id,
    user_id: authData.user.id,
    role: "owner",
  });

  if (memberError) return { error: "Failed to set up workspace. Please try again." };

  return { success: true };
}

export async function signIn(data: SignInFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { error: "Incorrect email or password. Please try again." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function forgotPassword(data: ForgotPasswordFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
