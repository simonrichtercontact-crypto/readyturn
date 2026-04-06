import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, getUserCompany } from "@/lib/supabase/server";

export async function DELETE(req: NextRequest) {
  const companyData = await getUserCompany();
  if (!companyData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only owners can remove members
  if (companyData.role !== "owner" && companyData.role !== "admin") {
    return NextResponse.json({ error: "Only owners and admins can remove members" }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Cannot remove yourself
  if (userId === companyData.user_id) {
    return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
  }

  const admin = createServiceClient();

  // Check the target member's role — owners cannot be removed
  const { data: targetMember } = await admin
    .from("company_members")
    .select("role")
    .eq("company_id", companyData.company_id)
    .eq("user_id", userId)
    .single();

  if (!targetMember) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (targetMember.role === "owner") {
    return NextResponse.json({ error: "Cannot remove the owner" }, { status: 400 });
  }

  // Admins cannot remove other admins — only owners can
  if (targetMember.role === "admin" && companyData.role !== "owner") {
    return NextResponse.json({ error: "Only the owner can remove admins" }, { status: 403 });
  }

  const { error } = await admin
    .from("company_members")
    .delete()
    .eq("company_id", companyData.company_id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
