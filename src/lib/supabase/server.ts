import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Service role client — bypasses RLS, only use server-side for privileged ops
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component - cookies can't be set here
          }
        },
      },
    }
  );
}

// Get the current authenticated user
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

type UserCompany = {
  company_id: string;
  role: string;
  companies: { id: string; name: string; plan: string; created_at: string } | null;
} | null;

// Get the current user's company
export async function getUserCompany(): Promise<UserCompany> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("company_members")
    .select("company_id, role, companies(id, name, plan, created_at)")
    .eq("user_id", user.id)
    .single();

  return data as UserCompany;
}

// Get the current user's profile
export async function getUserProfile(): Promise<{
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
  } | null;
}
