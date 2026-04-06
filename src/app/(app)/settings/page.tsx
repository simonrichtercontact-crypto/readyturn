import { getUser, getUserCompany, getUserProfile } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [user, profile, companyData] = await Promise.all([
    getUser(),
    getUserProfile(),
    getUserCompany(),
  ]);

  const company = companyData?.companies as { name?: string } | null;

  return (
    <SettingsClient
      userEmail={user?.email ?? ""}
      defaultName={profile?.full_name ?? ""}
      defaultCompanyName={company?.name ?? ""}
    />
  );
}
