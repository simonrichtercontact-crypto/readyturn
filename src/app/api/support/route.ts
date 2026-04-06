"use server";
import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const admin = createServiceClient();

  // Get user profile + company
  const [{ data: profile }, { data: membership }] = await Promise.all([
    admin.from("profiles").select("full_name, email").eq("id", user.id).single(),
    admin.from("company_members").select("company_id, role, companies(name)").eq("user_id", user.id).single(),
  ]);

  const userName = profile?.full_name || user.email || "Unknown";
  const companyName = (membership?.companies as { name: string } | null)?.name || "Unknown";

  // Send email to admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: `[TurnTiva Support] ${subject || "Help request"} — ${companyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#1e3a5f;padding:20px 28px;">
          <h1 style="color:#fff;margin:0;font-size:18px;">Support Request</h1>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
            <tr><td style="padding:6px 0;color:#6b7280;width:120px;">From</td><td style="padding:6px 0;font-weight:600;">${userName}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;">${user.email}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Company</td><td style="padding:6px 0;">${companyName}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Subject</td><td style="padding:6px 0;">${subject || "—"}</td></tr>
          </table>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.6;">${message}</div>
          <div style="margin-top:20px;">
            <a href="mailto:${user.email}?subject=Re: ${subject || 'Your TurnTiva support request'}" style="background:#1e3a5f;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Reply to ${userName}</a>
          </div>
        </div>
        <div style="padding:14px 28px;background:#f9fafb;color:#9ca3af;font-size:11px;">TurnTiva Support System</div>
      </div>
    `,
  });

  // Also store in DB for admin inbox
  await admin.from("support_tickets").insert({
    user_id: user.id,
    user_name: userName,
    user_email: user.email,
    company_name: companyName,
    subject: subject || "Help request",
    message,
  }).select();
  // Silently ignore if table doesn't exist yet

  return NextResponse.json({ success: true });
}
