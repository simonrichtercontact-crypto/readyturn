import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createServiceClient();

  const { data: companies } = await admin
    .from("companies")
    .select("id, name, plan, created_at")
    .order("created_at", { ascending: false });

  if (!companies) return NextResponse.json({ companies: [] });

  // Get counts per company
  const ids = companies.map((c) => c.id);

  const [{ data: members }, { data: properties }, { data: turnovers }] = await Promise.all([
    admin.from("company_members").select("company_id").in("company_id", ids),
    admin.from("properties").select("company_id").in("company_id", ids),
    admin.from("turnovers").select("company_id").in("company_id", ids),
  ]);

  const count = (arr: { company_id: string }[] | null, id: string) =>
    arr?.filter((x) => x.company_id === id).length ?? 0;

  const enriched = companies.map((c) => ({
    ...c,
    member_count: count(members, c.id),
    property_count: count(properties, c.id),
    turnover_count: count(turnovers, c.id),
  }));

  return NextResponse.json({ companies: enriched });
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, plan } = await req.json();
  if (!id || !plan) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const admin = createServiceClient();
  const { error } = await admin.from("companies").update({ plan }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
