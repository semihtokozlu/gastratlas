import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const brand = useTranslations("brand");

  return (
    <footer className="border-t border-line bg-bg py-8">
      <div className="container flex flex-col items-center gap-2 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:text-left">
        <span>{brand("name")}</span>
        <span>
          © {new Date().getFullYear()} {brand("name")} — {t("rights")}
        </span>
      </div>
    </footer>
  );
}
