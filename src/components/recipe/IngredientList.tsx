"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { Unit } from "@prisma/client";
import { recalculateRecipe } from "@/features/recipes/actions";

type UiIngredient = {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: Unit;
  note: string | null;
  groupLabel: string | null;
  isOptional: boolean;
};

export function IngredientList({
  recipeId,
  baseServings,
  initialIngredients,
  locale,
}: {
  recipeId: string;
  baseServings: number;
  initialIngredients: UiIngredient[];
  locale: string;
}) {
  const t = useTranslations("recipe");
  const [servings, setServings] = useState(baseServings);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [isPending, startTransition] = useTransition();
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

  function applyServings(next: number) {
    setServings(next);
    startTransition(async () => {
      const res = await recalculateRecipe({ recipeId, servings: next, substitutions: [] });
      if (res.ok) {
        setIngredients((prev) =>
          prev.map((ing) => {
            const updated = res.data.ingredients.find((r) => r.ingredientId === ing.ingredientId);
            return updated ? { ...ing, quantity: updated.quantity } : ing;
          })
        );
      }
    });
  }

  const groups = new Map<string, UiIngredient[]>();
  for (const ing of ingredients) {
    const key = ing.groupLabel ?? "";
    groups.set(key, [...(groups.get(key) ?? []), ing]);
  }

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("ingredientsTitle")}
      </h2>

      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="servings-slider" className="text-sm font-medium text-ink">
          {t("servings")}: {servings}
        </label>
        <input
          id="servings-slider"
          type="range"
          min={1}
          max={20}
          step={1}
          value={servings}
          aria-label={t("servings")}
          onChange={(e) => applyServings(Number(e.target.value))}
          className="max-w-xs flex-1 accent-primary"
        />
        <span className="text-sm text-ink-muted" aria-live="polite">
          {isPending ? "…" : `${servings} ${t("servingsUnit")}`}
        </span>
      </div>

      <div className="space-y-6">
        {[...groups.entries()].map(([groupLabel, items]) => (
          <div key={groupLabel || "default"}>
            {groupLabel && (
              <h3 className="mb-2 text-xs uppercase tracking-wide text-ink-muted">{groupLabel}</h3>
            )}
            <ul className="space-y-2">
              {items.map((ing) => (
                <li key={ing.ingredientId} className="flex justify-between border-b border-line pb-2 text-sm">
                  <span className="text-ink">
                    {ing.name}
                    {ing.isOptional && (
                      <span className="ml-2 text-xs text-ink-muted">({t("optional")})</span>
                    )}
                    {ing.note && <span className="ml-2 text-xs text-ink-muted">— {ing.note}</span>}
                  </span>
                  <span className="font-medium text-ink">
                    {numberFormat.format(ing.quantity)} {t(`units.${ing.unit}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
