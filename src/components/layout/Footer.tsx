import { useTranslations } from "next-intl";
import { NewsletterBlock } from "./NewsletterBlock";

export function Footer() {
  const t = useTranslations("footer");
  const brand = useTranslations("brand");

  return (
    <footer className="border-t border-line bg-bg">
      <div className="container py-10">
        <NewsletterBlock />
      </div>
      <div className="border-t border-line py-6">
        <div className="container flex flex-col items-center gap-2 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:text-left">
          <span>{brand("name")}</span>
          <span>
            © {new Date().getFullYear()} {brand("name")} — {t("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
