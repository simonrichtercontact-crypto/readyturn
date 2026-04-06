import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata = { title: "Privacy Policy — ReadyTurn" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo size="sm" /></Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 7, 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. What We Collect</h2>
            <p>We collect information you provide when creating an account (name, email, company name), data you enter into the Service (properties, units, turnovers, tasks), and usage data (pages visited, features used) to improve the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. How We Use Your Data</h2>
            <p>We use your data to: provide and maintain the Service, send important account notifications, improve the Service, and respond to support requests. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Data Storage & Security</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL) with row-level security. All data is encrypted in transit (HTTPS) and at rest. We follow industry best practices to protect your information.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Cookies</h2>
            <p>We use cookies for: authentication (session management) and language preference (your preferred language). We do not use advertising cookies or tracking pixels.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Third-Party Services</h2>
            <p>We use: <strong>Supabase</strong> for database and authentication, <strong>Vercel</strong> for hosting, and <strong>Resend</strong> for transactional emails. Each has their own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Your Rights</h2>
            <p>You have the right to: access your personal data, correct inaccurate data, request deletion of your data, export your data in CSV format (Pro plan), and withdraw consent at any time. Contact us at <a href="mailto:hello@readyturn.app" className="text-primary hover:underline">hello@readyturn.app</a> to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Data Retention</h2>
            <p>We retain your data as long as your account is active. Upon account deletion, your data is permanently deleted within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. GDPR Compliance</h2>
            <p>For users in the European Union: we process your data under the legal basis of contract performance (to provide the Service you signed up for). You may contact us to exercise any GDPR rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Contact</h2>
            <p>For privacy concerns, contact us at <a href="mailto:hello@readyturn.app" className="text-primary hover:underline">hello@readyturn.app</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
