import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSessionUser } from "@/lib/auth/guards";
import { getFavoriteRecipeCards } from "@/features/favorites/queries";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Link } from "@/i18n/navigation";

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (!user) {
    redirect(`/${locale}/auth/login?next=${encodeURIComponent(`/${locale}/favorites`)}`);
  }

  const t = await getTranslations({ locale, namespace: "favoritesPage" });
  const recipes = await getFavoriteRecipeCards(user.id, locale);

  return (
    <main className="container max-w-5xl py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("subtitle")}</p>

      {recipes.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-ink-muted">{t("empty")}</p>
          <Link href="/recipes" className="mt-4 inline-block text-primary underline">
            {t("browseRecipes")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </main>
  );
}
