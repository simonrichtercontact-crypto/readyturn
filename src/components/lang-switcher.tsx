"use client";

import { useTransition } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";
import { setLocale } from "@/lib/i18n/actions";
import { useRouter } from "next/navigation";

interface LangSwitcherProps {
  current: Locale;
  variant?: "light" | "dark";
}

export function LangSwitcher({ current, variant = "light" }: LangSwitcherProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(locale: Locale) {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  const isDark = variant === "dark";

  return (
    <div className="relative">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value as Locale)}
        disabled={pending}
        className={`text-xs font-medium rounded-lg px-2.5 py-1.5 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          isDark
            ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
            : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
        }`}
        style={{ backgroundImage: "none" }}
        aria-label="Select language"
      >
        {LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_LABELS[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
