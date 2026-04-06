import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      {/* Auth header */}
      <header className="p-6">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ReadyTurn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
