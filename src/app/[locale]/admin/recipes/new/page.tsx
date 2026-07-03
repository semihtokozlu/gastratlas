import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminFormOptions } from "@/features/admin/queries";
import { RecipeForm } from "@/components/admin/RecipeForm";

export default async function NewRecipePage({
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
        {t("newRecipe")}
      </h1>
      <RecipeForm options={options} />
    </div>
  );
}
