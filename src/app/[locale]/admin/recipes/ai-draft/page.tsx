import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminFormOptions } from "@/features/admin/queries";
import { AIDraftForm } from "@/components/admin/AIDraftForm";

export default async function AIDraftPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const options = await getAdminFormOptions(locale);

  return (
    <div>
      <h1 className="mb-6 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("aiDraftTitle")}
      </h1>
      <AIDraftForm options={options} />
    </div>
  );
}
