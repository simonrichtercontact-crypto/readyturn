"use server";

import { cookies } from "next/headers";
import { LOCALES, type Locale } from "./locales";

export async function setLocale(locale: Locale) {
  if (!LOCALES.includes(locale)) return;
  const store = await cookies();
  store.set("rt_locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
