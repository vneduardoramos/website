import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default function CatchAll({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (routing.locales.includes(locale as "en" | "es")) {
    setRequestLocale(locale);
  }
  notFound();
}
