import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata = { title: "Terms of Service — ReadyTurn" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo size="sm" /></Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 7, 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By creating an account or using ReadyTurn ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Description of Service</h2>
            <p>ReadyTurn is a property management SaaS platform that helps property managers track unit turnovers, coordinate make-ready workflows, and manage teams. The Service is provided on a subscription basis.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorized use. You may not share your account with others outside of the team member invitation system.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Subscription & Billing</h2>
            <p>ReadyTurn offers a free plan and paid plans. Paid plan upgrades are processed manually and activated within 1 business hour. You may request a downgrade or cancellation at any time by contacting us at <a href="mailto:hello@readyturn.app" className="text-primary hover:underline">hello@readyturn.app</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Your Data</h2>
            <p>You retain ownership of all data you input into the Service. We do not sell your data to third parties. You may request a full export or deletion of your data at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Acceptable Use</h2>
            <p>You agree not to: (a) use the Service for any unlawful purpose, (b) attempt to gain unauthorized access to any part of the Service, (c) interfere with or disrupt the Service, (d) reverse engineer any part of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Limitation of Liability</h2>
            <p>ReadyTurn is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Termination</h2>
            <p>We may suspend or terminate your account if you violate these Terms. You may terminate your account at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:hello@readyturn.app" className="text-primary hover:underline">hello@readyturn.app</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
