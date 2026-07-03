"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getHomeDashboardData, type HomeDashboardData } from "@/features/home/actions";
import { RecipeCard } from "@/components/recipe/RecipeCard";

export function PersonalizedHomeSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [data, setData] = useState<HomeDashboardData | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHomeDashboardData(locale).then((res) => {
      if (!cancelled) setData(res);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (!data?.isAuthenticated) return null;
  if (data.favoriteRecipes.length === 0 && data.collections.length === 0) return null;

  return (
    <section className="container py-12">
      <h2 className="mb-8 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("dashboardTitle")}
      </h2>

      {data.favoriteRecipes.length > 0 && (
        <div className="mb-10">
          <div className="mb-5 flex items-end justify-between">
            <p className="text-sm uppercase tracking-wide text-ink-muted">{t("yourFavorites")}</p>
            <Link href="/favorites" className="text-sm text-ink-muted hover:text-ink">
              {t("viewAllFavorites")} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.slug} {...recipe} />
            ))}
          </div>
        </div>
      )}

      {data.collections.length > 0 && (
        <div>
          <div className="mb-5 flex items-end justify-between">
            <p className="text-sm uppercase tracking-wide text-ink-muted">{t("yourCollections")}</p>
            <Link href="/collections" className="text-sm text-ink-muted hover:text-ink">
              {t("viewAllCollections")} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="rounded-lg border border-line p-5 transition-colors duration-200 ease-brand hover:border-accent"
              >
                <p className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
                  {c.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
