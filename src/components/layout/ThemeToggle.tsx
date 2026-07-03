"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "gastratlas-theme";

export function ThemeToggle() {
  const t = useTranslations("nav");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage erişilemez olabilir (gizli sekme vb.) — sessizce yok say
    }
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
      aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
    >
      {theme === "dark" ? t("lightMode") : t("darkMode")}
    </button>
  );
}
