import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterBlock } from "./NewsletterBlock";

export function Footer() {
  const t = useTranslations("footer");
  const brand = useTranslations("brand");
  const methodology = useTranslations("methodologyPage");

  return (
    <footer className="border-t border-line bg-bg">
      <div className="container py-10">
        <NewsletterBlock />
      </div>
      <div className="border-t border-line py-6">
        <div className="container flex flex-col items-center gap-3 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:text-left">
          <span>{brand("name")}</span>
          <Link href="/methodology" className="hover:text-ink">
            {methodology("title")}
          </Link>
          <span>
            © {new Date().getFullYear()} {brand("name")} — {t("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
