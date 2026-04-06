import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient, getUserCompany } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const companyData = await getUserCompany();
  if (!companyData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["owner", "admin"].includes(companyData.role)) {
    return NextResponse.json({ error: "Only owners and admins can invite members" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !role) return NextResponse.json({ error: "Email and role required" }, { status: 400 });

  const admin = createServiceClient();

  // Check if user already exists
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, email")
    .eq("email", email)
    .single();

  if (existingProfile) {
    // Check if already a member
    const { data: existingMember } = await admin
      .from("company_members")
      .select("id")
      .eq("company_id", companyData.company_id)
      .eq("user_id", existingProfile.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: "This person is already a member of your workspace" }, { status: 400 });
    }

    // Add existing user to company
    const { error } = await admin.from("company_members").insert({
      company_id: companyData.company_id,
      user_id: existingProfile.id,
      role,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: `${email} added to your workspace.` });
  }

  // User doesn't exist — create them with a temp password
  const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

  // Create profile
  await admin.from("profiles").upsert({
    id: newUser.user.id,
    full_name: email.split("@")[0],
    email,
  });

  // Add to company
  const { error: memberError } = await admin.from("company_members").insert({
    company_id: companyData.company_id,
    user_id: newUser.user.id,
    role,
  });

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    message: `${email} was added. Temporary password: ${tempPassword}`,
    tempPassword,
  });
}
