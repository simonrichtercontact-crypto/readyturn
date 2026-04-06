import { createServiceClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";
import { MessageCircle, Mail } from "lucide-react";

export const metadata = { title: "Support Inbox — Admin" };

export default async function AdminSupportPage() {
  const admin = createServiceClient();

  // Try to fetch support tickets — table may not exist yet
  const { data: tickets, error } = await admin
    .from("support_tickets" as "companies") // type cast to avoid TS error
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const tableExists = !error;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Support Inbox</h1>
        <p className="mt-1 text-sm text-slate-400">Messages sent by clients via the help widget.</p>
      </div>

      {!tableExists ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <MessageCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Support table not yet created</p>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Run this SQL in Supabase to enable the support inbox:
          </p>
          <pre className="mt-4 text-left text-xs bg-slate-800 text-slate-300 rounded-lg p-4 overflow-x-auto max-w-lg mx-auto">{`CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text,
  user_email text,
  company_name text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;`}</pre>
          <p className="text-slate-500 text-xs mt-3">Tickets are still emailed to your admin email even without this table.</p>
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <MessageCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No support tickets yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(tickets as unknown as {
            id: string; user_name: string; user_email: string; company_name: string;
            subject: string; message: string; status: string; created_at: string;
          }[]).map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{t.subject}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.user_name} · {t.company_name} · {formatRelativeTime(t.created_at)}
                  </p>
                </div>
                <a
                  href={`mailto:${t.user_email}?subject=Re: ${t.subject}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors shrink-0"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply
                </a>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
