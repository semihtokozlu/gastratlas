import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFoundPage");

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-accent">404</p>
      <h1 className="mt-4 font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-ink-muted">{t("subtitle")}</p>
      <Link
        href="/"
        className="mt-10 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
