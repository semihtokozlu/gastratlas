import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminFormOptions, getAdminRecipeDetail } from "@/features/admin/queries";
import { RecipeForm } from "@/components/admin/RecipeForm";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const [options, recipe] = await Promise.all([getAdminFormOptions(locale), getAdminRecipeDetail(id)]);
  if (!recipe) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("editRecipe")}
      </h1>
      <RecipeForm options={options} initialData={recipe} />
    </div>
  );
}
