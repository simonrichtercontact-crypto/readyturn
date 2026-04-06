import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser, getUserCompany, getUserProfile } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { getInitials } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locales";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, profile, companyData] = await Promise.all([
    getUser(),
    getUserProfile(),
    getUserCompany(),
  ]);

  if (!user) {
    redirect("/sign-in");
  }

  if (!companyData) {
    if (user.email === process.env.ADMIN_EMAIL) {
      redirect("/admin");
    }
    redirect("/setup");
  }

  const company = companyData.companies as { id: string; name: string; created_at: string } | null;
  const displayName = profile?.full_name || user.email || "User";
  const initials = getInitials(displayName);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("rt_locale")?.value ?? "en") as Locale;

  return (
    <AppShell
      companyName={company?.name}
      userInitials={initials}
      userName={displayName}
      userEmail={user.email}
      locale={locale}
    >
      {children}
    </AppShell>
  );
}
