"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { AlternativeType, Unit } from "@prisma/client";
import { recalculateRecipe } from "@/features/recipes/actions";

type AlternativeOption = { alternativeId: string; name: string; type: AlternativeType; aiExplanation: string | null };

type UiIngredient = {
  key: string;
  originalIngredientId: string;
  displayIngredientId: string;
  name: string;
  quantity: number;
  unit: Unit;
  note: string | null;
  groupLabel: string | null;
  isOptional: boolean;
  alternatives: AlternativeOption[];
  selectedAlternativeId: string | null;
};

export function IngredientList({
  recipeId,
  baseServings,
  initialIngredients,
  locale,
}: {
  recipeId: string;
  baseServings: number;
  initialIngredients: {
    id: string;
    ingredientId: string;
    name: string;
    quantity: number;
    unit: Unit;
    note: string | null;
    groupLabel: string | null;
    isOptional: boolean;
    alternatives: AlternativeOption[];
  }[];
  locale: string;
}) {
  const t = useTranslations("recipe");
  const [servings, setServings] = useState(baseServings);
  const [ingredients, setIngredients] = useState<UiIngredient[]>(
    initialIngredients.map((i) => ({
      key: i.id,
      originalIngredientId: i.ingredientId,
      displayIngredientId: i.ingredientId,
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      note: i.note,
      groupLabel: i.groupLabel,
      isOptional: i.isOptional,
      alternatives: i.alternatives,
      selectedAlternativeId: null,
    }))
  );
  const [isPending, startTransition] = useTransition();
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

  function recalculate(next: { servings: number; rows: UiIngredient[] }) {
    startTransition(async () => {
      const substitutions = next.rows
        .filter((r) => r.selectedAlternativeId)
        .map((r) => ({ ingredientId: r.originalIngredientId, alternativeId: r.selectedAlternativeId!, ratio: 1 }));

      const res = await recalculateRecipe({ recipeId, servings: next.servings, substitutions });
      if (res.ok) {
        // Domain fonksiyonu girdi sırasını korur (Array.map); actions.ts aynı
        // sortOrder'a göre sıralar, bu yüzden indeksle eşleştirmek güvenlidir
        // (ingredientId ikame sonrası değiştiği için find() ile eşleşmez).
        setIngredients((prev) =>
          prev.map((ing, idx) => {
            const updated = res.data.ingredients[idx];
            if (!updated) return ing;
            const altName = ing.alternatives.find((a) => a.alternativeId === updated.ingredientId)?.name;
            return { ...ing, displayIngredientId: updated.ingredientId, quantity: updated.quantity, name: altName ?? ing.name };
          })
        );
      }
    });
  }

  function applyServings(next: number) {
    setServings(next);
    recalculate({ servings: next, rows: ingredients });
  }

  function applySubstitution(key: string, alternativeId: string | null) {
    const next = ingredients.map((ing) => (ing.key === key ? { ...ing, selectedAlternativeId: alternativeId } : ing));
    setIngredients(next);
    recalculate({ servings, rows: next });
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
            <ul className="space-y-3">
              {items.map((ing) => (
                <li key={ing.key} className="border-b border-line pb-3 text-sm">
                  <div className="flex justify-between">
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
                  </div>
                  {ing.alternatives.length > 0 && (
                    <label className="mt-1.5 flex items-center gap-2 text-xs text-ink-muted">
                      {t("substitute")}:
                      <select
                        value={ing.selectedAlternativeId ?? ""}
                        onChange={(e) => applySubstitution(ing.key, e.target.value || null)}
                        className="rounded-md border border-line bg-bg px-2 py-1 text-xs text-ink"
                      >
                        <option value="">{t("original")}</option>
                        {ing.alternatives.map((alt) => (
                          <option key={alt.alternativeId} value={alt.alternativeId}>
                            {alt.name} ({t(`altType.${alt.type}`)})
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
