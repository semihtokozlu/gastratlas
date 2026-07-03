import { useTranslations } from "next-intl";

export function NutritionTable({
  nutrition,
}: {
  nutrition: { calories: number; proteinG: number; fatG: number; carbsG: number; isAiEstimated: boolean } | null;
}) {
  const t = useTranslations("recipe");
  if (!nutrition) return null;

  const items = [
    { label: t("calories"), value: `${nutrition.calories} kcal` },
    { label: t("protein"), value: `${nutrition.proteinG} g` },
    { label: t("fat"), value: `${nutrition.fatG} g` },
    { label: t("carbs"), value: `${nutrition.carbsG} g` },
  ];

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("nutritionTitle")}
        {nutrition.isAiEstimated && (
          <span className="ml-2 align-middle text-xs font-normal uppercase tracking-wide text-accent">
            {t("aiEstimated")}
          </span>
        )}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border border-line px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-wide text-ink-muted">{item.label}</p>
            <p className="mt-1 font-medium text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
