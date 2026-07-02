import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const brand = await getTranslations("brand");

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center py-24 text-center">
      <p className="mb-6 text-sm uppercase tracking-[0.25em] text-accent">
        {brand("name")}
      </p>
      <h1
        className="max-w-3xl text-ink"
        style={{ fontSize: "var(--text-display)", lineHeight: 1.1 }}
      >
        {t("heroTitle")}
      </h1>
      <p className="mt-6 max-w-xl text-ink-muted">{t("heroSubtitle")}</p>
      <a
        href="#"
        className="mt-10 rounded-md bg-primary px-8 py-3 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark"
      >
        {t("cta")}
      </a>
      <p className="mt-16 text-xs uppercase tracking-widest text-ink-muted">
        {t("statusNote")}
      </p>
    </main>
  );
}
