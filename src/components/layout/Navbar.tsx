"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const pathname = usePathname();
  const locale = useLocale();
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/recipes", label: t("recipes") },
    { href: "/countries", label: t("countries") },
    { href: "/map", label: t("map") },
    { href: "/timeline", label: t("timeline") },
    { href: "/favorites", label: t("favorites") },
  ] as const;

  return (
    <header className="border-b border-line bg-bg">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-lg text-ink">
          {brand("name")}
        </Link>

        {/* Masaüstü: satır içi linkler */}
        <div className="hidden items-center gap-6 text-sm sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-200 ease-brand hover:text-ink ${
                pathname === link.href ? "text-ink" : "text-ink-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-md border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
          >
            {t("switchLocale")}
          </Link>
        </div>

        {/* Mobil: hamburger buton */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line sm:hidden"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-200 ease-brand ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink transition-opacity duration-200 ease-brand ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-200 ease-brand ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobil: açılır menü */}
      {menuOpen && (
        <div className="container flex flex-col gap-4 border-t border-line py-4 text-sm sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`transition-colors duration-200 ease-brand hover:text-ink ${
                pathname === link.href ? "text-ink" : "text-ink-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
            <Link
              href={pathname}
              locale={otherLocale}
              className="rounded-md border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink-muted"
            >
              {t("switchLocale")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
