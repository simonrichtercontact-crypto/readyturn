import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, overdueEmailHtml, weeklyReportHtml } from "@/lib/email";

// Simple secret to protect this endpoint
// Add CRON_SECRET=any-random-string to .env.local
function isAuthorized(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  return secret === process.env.CRON_SECRET || process.env.NODE_ENV === "development";
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json().catch(() => ({ type: "overdue" }));
  const admin = createServiceClient();

  if (type === "overdue") {
    // Find all overdue turnovers grouped by company
    const today = new Date().toISOString().split("T")[0];

    const { data: overdue } = await admin
      .from("turnovers")
      .select("id, target_ready_date, company_id, unit:units(unit_number), property:properties(name)")
      .in("status", ["not_started", "in_progress", "blocked"])
      .lt("target_ready_date", today);

    if (!overdue || overdue.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Group by company
    const byCompany: Record<string, typeof overdue> = {};
    overdue.forEach((t) => {
      if (!byCompany[t.company_id]) byCompany[t.company_id] = [];
      byCompany[t.company_id].push(t);
    });

    let sent = 0;

    for (const [companyId, items] of Object.entries(byCompany)) {
      // Get company owner email
      const { data: owner } = await admin
        .from("company_members")
        .select("user_id, profiles(email, full_name)")
        .eq("company_id", companyId)
        .eq("role", "owner")
        .single();

      const profile = owner?.profiles as { email: string; full_name: string } | null;
      if (!profile?.email) continue;

      const emailItems = items.map((t) => ({
        unit: (t.unit as { unit_number: string } | null)?.unit_number ?? "?",
        property: (t.property as { name: string } | null)?.name ?? "?",
        date: t.target_ready_date,
      }));

      await sendEmail({
        to: profile.email,
        subject: `⚠ ${items.length} overdue turnover${items.length > 1 ? "s" : ""} need your attention`,
        html: overdueEmailHtml(emailItems),
      });
      sent++;
    }

    return NextResponse.json({ sent, companies: Object.keys(byCompany).length });
  }

  if (type === "weekly") {
    const { data: companies } = await admin.from("companies").select("id, name");
    if (!companies) return NextResponse.json({ sent: 0 });

    const today = new Date().toISOString().split("T")[0];
    let sent = 0;

    for (const company of companies) {
      const [
        { count: active },
        { data: overdueData },
        { count: blocked },
        { count: ready },
        { data: owner },
      ] = await Promise.all([
        admin.from("turnovers").select("id", { count: "exact" })
          .eq("company_id", company.id).in("status", ["not_started", "in_progress"]),
        admin.from("turnovers").select("id")
          .eq("company_id", company.id)
          .in("status", ["not_started", "in_progress", "blocked"])
          .lt("target_ready_date", today),
        admin.from("turnovers").select("id", { count: "exact" })
          .eq("company_id", company.id).eq("status", "blocked"),
        admin.from("units").select("id", { count: "exact" })
          .eq("company_id", company.id).eq("status", "ready"),
        admin.from("company_members").select("profiles(email)")
          .eq("company_id", company.id).eq("role", "owner").single(),
      ]);

      const profile = (owner as any)?.profiles as { email: string } | null;
      if (!profile?.email) continue;

      await sendEmail({
        to: profile.email,
        subject: `📊 Your weekly ReadyTurn summary — ${company.name}`,
        html: weeklyReportHtml({
          companyName: company.name,
          active: active ?? 0,
          overdue: overdueData?.length ?? 0,
          blocked: blocked ?? 0,
          ready: ready ?? 0,
        }),
      });
      sent++;
    }

    return NextResponse.json({ sent });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
