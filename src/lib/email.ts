// Simple email sender using fetch to a mail API
// Uses Resend (free tier: 100 emails/day) - add RESEND_API_KEY to .env.local
// Falls back to console.log in development

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  // Dev mode — just log
  if (!apiKey) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] Body:`, html.replace(/<[^>]+>/g, ""));
    return { success: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ReadyTurn <notifications@readyturn.app>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[EMAIL] Error:", err);
    return { error: err };
  }

  return { success: true };
}

export function overdueEmailHtml(items: { unit: string; property: string; date: string }[]) {
  const rows = items
    .map(
      (i) => `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${i.property}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">Unit ${i.unit}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#ef4444;font-weight:600;">${i.date}</td>
    </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#1d4ed8;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;">⚠ Overdue Turnovers</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#374151;margin-top:0;">The following turnovers are past their target ready date:</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Property</th>
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Unit</th>
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Due Date</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/turnovers"
             style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            View Turnovers →
          </a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;">
        ReadyTurn · You're receiving this because you're a team owner.
      </div>
    </div>
  `;
}

export function weeklyReportHtml({
  companyName,
  active,
  overdue,
  blocked,
  ready,
}: {
  companyName: string;
  active: number;
  overdue: number;
  blocked: number;
  ready: number;
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#1d4ed8;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;">📊 Weekly Summary — ${companyName}</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#374151;margin-top:0;">Here's your ReadyTurn summary for this week:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;">
          ${[
            { label: "Active Turnovers", value: active, color: "#3b82f6" },
            { label: "Overdue", value: overdue, color: overdue > 0 ? "#ef4444" : "#10b981" },
            { label: "Blocked", value: blocked, color: blocked > 0 ? "#f59e0b" : "#10b981" },
            { label: "Ready Units", value: ready, color: "#10b981" },
          ]
            .map(
              (s) => `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
              <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;">${s.label}</p>
              <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:${s.color};">${s.value}</p>
            </div>`
            )
            .join("")}
        </div>
        <div style="margin-top:24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Open Dashboard →
          </a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;">
        ReadyTurn · Weekly digest every Monday morning.
      </div>
    </div>
  `;
}
