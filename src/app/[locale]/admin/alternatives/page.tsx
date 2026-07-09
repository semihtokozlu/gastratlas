import { getTranslations, setRequestLocale } from "next-intl/server";
import { getUnverifiedAlternatives } from "@/features/admin/queries";
import { AlternativesManager } from "@/components/admin/AlternativesManager";

export default async function AdminAlternativesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const alternatives = await getUnverifiedAlternatives(locale);

  return (
    <div>
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("alternativesTitle")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("alternativesIntro")}</p>
      <AlternativesManager initialAlternatives={alternatives} />
    </div>
  );
}
