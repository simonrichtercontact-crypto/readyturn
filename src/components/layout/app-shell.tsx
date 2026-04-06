"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { LogoMark } from "@/components/logo";
import { HelpWidget } from "@/components/shared/help-widget";
import { LangSwitcher } from "@/components/lang-switcher";
import type { Locale } from "@/lib/i18n/locales";

interface AppShellProps {
  children: React.ReactNode;
  companyName?: string;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
  locale?: Locale;
}

export function AppShell({ children, companyName, userInitials, userName, userEmail, locale = "en" }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:relative md:flex md:shrink-0 ${
          sidebarOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <button
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg hover:bg-accent md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
        <Sidebar companyName={companyName} userInitials={userInitials} userName={userName} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center border-b border-border bg-background md:hidden px-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 ml-2 flex-1 min-w-0">
            <LogoMark size={24} />
            <span className="font-extrabold text-sm tracking-tight text-slate-900">Turn<span className="text-[#0891b2]">Tiva</span></span>
          </div>
          <div className="shrink-0">
            <LangSwitcher current={locale} />
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block">
          <Header userName={userName} userEmail={userEmail} userInitials={userInitials} locale={locale} />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Floating help widget — always visible inside app */}
      <HelpWidget />
    </div>
  );
}
