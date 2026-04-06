import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { companyName, ownerName, ownerEmail, ownerPassword, plan } = await req.json();

  if (!companyName || !ownerEmail || !ownerPassword || !ownerName) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const admin = createServiceClient();

  // 1. Create the auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
    user_metadata: { full_name: ownerName },
  });

  if (authError) {
    return NextResponse.json({ error: "Failed to create user: " + authError.message }, { status: 500 });
  }

  const userId = authData.user.id;

  // 2. Create profile (trigger may have done it, use upsert)
  await admin.from("profiles").upsert({
    id: userId,
    full_name: ownerName,
    email: ownerEmail,
  });

  // 3. Create company with chosen plan
  const { data: company, error: companyError } = await admin
    .from("companies")
    .insert({ name: companyName, plan: plan ?? "free" })
    .select()
    .single();

  if (companyError) {
    return NextResponse.json({ error: "Failed to create company: " + companyError.message }, { status: 500 });
  }

  // 4. Link user as owner
  const { error: memberError } = await admin
    .from("company_members")
    .insert({ company_id: company.id, user_id: userId, role: "owner" });

  if (memberError) {
    return NextResponse.json({ error: "Failed to link owner: " + memberError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, companyId: company.id, userId });
}
