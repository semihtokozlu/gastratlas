"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function Navbar() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const pathname = usePathname();
  const locale = useLocale();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const links = [
    { href: "/recipes", label: t("recipes") },
    { href: "/countries", label: t("countries") },
    { href: "/map", label: t("map") },
    { href: "/timeline", label: t("timeline") },
  ] as const;

  return (
    <header className="border-b border-line bg-bg">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-lg text-ink">
          {brand("name")}
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-md border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
          >
            {t("switchLocale")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
