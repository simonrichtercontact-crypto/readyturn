export const LOCALES = ["en", "de", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
};

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const langs = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().substring(0, 2).toLowerCase());
  for (const lang of langs) {
    if (LOCALES.includes(lang as Locale)) return lang as Locale;
  }
  return DEFAULT_LOCALE;
}
