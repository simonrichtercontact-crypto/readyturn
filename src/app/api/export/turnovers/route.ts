import { NextResponse } from "next/server";
import { createClient, getUserCompany } from "@/lib/supabase/server";
import { hasFeature } from "@/lib/plans";

export async function GET() {
  const companyData = await getUserCompany();
  if (!companyData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = companyData.companies as { plan?: string } | null;
  const planId = company?.plan ?? "free";

  if (!hasFeature(planId, "csvExport")) {
    return NextResponse.json({ error: "CSV export requires Pro or Business plan" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data: turnovers, error } = await supabase
    .from("turnovers")
    .select(`
      *,
      property:properties(name, city, state),
      unit:units(unit_number, bedrooms, bathrooms),
      tasks:turnover_tasks(title, status, priority, estimated_cost, actual_cost)
    `)
    .eq("company_id", companyData.company_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build CSV rows
  const rows: string[][] = [];

  // Header
  rows.push([
    "Turnover ID",
    "Property",
    "City",
    "State",
    "Unit",
    "Bedrooms",
    "Bathrooms",
    "Status",
    "Priority",
    "Move Out Date",
    "Target Ready Date",
    "Total Tasks",
    "Completed Tasks",
    "Estimated Cost ($)",
    "Actual Cost ($)",
    "Notes",
    "Created At",
  ]);

  for (const t of turnovers ?? []) {
    const tasks = (t.tasks as { status: string; estimated_cost?: number; actual_cost?: number }[]) ?? [];
    const completedTasks = tasks.filter((tk) => tk.status === "done").length;
    const estimatedCost = tasks.reduce((sum, tk) => sum + (tk.estimated_cost ?? 0), 0);
    const actualCost = tasks.reduce((sum, tk) => sum + (tk.actual_cost ?? 0), 0);

    rows.push([
      t.id,
      t.property?.name ?? "",
      t.property?.city ?? "",
      t.property?.state ?? "",
      t.unit?.unit_number ?? "",
      String(t.unit?.bedrooms ?? ""),
      String(t.unit?.bathrooms ?? ""),
      t.status,
      t.priority,
      t.move_out_date ?? "",
      t.target_ready_date ?? "",
      String(tasks.length),
      String(completedTasks),
      estimatedCost.toFixed(2),
      actualCost.toFixed(2),
      (t.notes ?? "").replace(/"/g, '""'),
      t.created_at,
    ]);
  }

  const csv = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="turnovers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
