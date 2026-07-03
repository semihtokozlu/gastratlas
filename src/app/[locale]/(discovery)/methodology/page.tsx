import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getMethodologyStats } from "@/features/methodology/queries";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodologyPage" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/methodology`])),
    },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "methodologyPage" });
  const stats = await getMethodologyStats();

  const statItems = [
    { value: stats.publishedRecipeCount, label: t("statRecipes") },
    { value: stats.cuisineCount, label: t("statCuisines") },
    { value: stats.sourceCount, label: t("statSources") },
    {
      value: stats.avgReliability !== null ? stats.avgReliability.toFixed(1) : "—",
      label: t("statReliability"),
    },
  ];

  const sections = [
    { title: t("workflowTitle"), body: t("workflowBody") },
    { title: t("aiTitle"), body: t("aiBody") },
    { title: t("sourcesTitle"), body: t("sourcesBody") },
    { title: t("rolesTitle"), body: t("rolesBody") },
    { title: t("commentsTitle"), body: t("commentsBody") },
    { title: t("correctionsTitle"), body: t("correctionsBody") },
  ];

  return (
    <main className="container max-w-3xl py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-ink-muted" style={{ lineHeight: "var(--leading-body)" }}>
        {t("intro")}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-8 sm:grid-cols-4">
        {statItems.map((item) => (
          <div key={item.label}>
            <p className="font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
              {item.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
              {section.title}
            </h2>
            <p className="max-w-2xl text-ink-muted" style={{ lineHeight: "var(--leading-body)" }}>
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
