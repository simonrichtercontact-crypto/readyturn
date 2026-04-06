import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Users, Building2, ShieldAlert, ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/dashboard");

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-slate-800 bg-slate-900">
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-800 px-4">
          <LogoMark size={26} />
          <div className="leading-none">
            <span className="text-sm font-extrabold text-white tracking-tight">Ready<span className="text-blue-300">Turn</span></span>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldAlert className="h-2.5 w-2.5 text-red-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { href: "/admin", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/clients", label: "Clients", icon: Building2 },
            { href: "/admin/users", label: "All Users", icon: Users },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-800 px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
