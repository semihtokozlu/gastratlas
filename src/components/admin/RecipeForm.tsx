"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { upsertRecipe } from "@/features/admin/actions";
import type { AdminFormOptions, AdminRecipeDetail } from "@/features/admin/queries";

const UNITS = ["G", "KG", "ML", "L", "TSP", "TBSP", "CUP", "PIECE", "PINCH", "SLICE", "BUNCH"] as const;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "EXPERT"] as const;

type IngredientRow = {
  ingredientId: string;
  quantity: number;
  unit: (typeof UNITS)[number];
  note: string;
  groupLabel: string;
  isOptional: boolean;
};

type StepRow = {
  durationMinutes: number | null;
  tr: { title: string; content: string };
  en: { title: string; content: string };
};

const inputClass = "w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink";
const labelClass = "mb-1 block text-xs uppercase tracking-wide text-ink-muted";

export function RecipeForm({
  options,
  initialData,
}: {
  options: AdminFormOptions;
  initialData?: AdminRecipeDetail;
}) {
  const t = useTranslations("admin");
  const tf = useTranslations("admin.form");
  const td = useTranslations("recipe");
  const router = useRouter();

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [cuisineId, setCuisineId] = useState(initialData?.cuisineId ?? options.cuisines[0]?.id ?? "");
  const [countryId, setCountryId] = useState(initialData?.countryId ?? options.countries[0]?.id ?? "");
  const [cityId, setCityId] = useState(initialData?.cityId ?? "");
  const [eraId, setEraId] = useState(initialData?.eraId ?? "");
  const [civilizationId, setCivilizationId] = useState(initialData?.civilizationId ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [authorId, setAuthorId] = useState(initialData?.authorId ?? options.authors[0]?.id ?? "");
  const [prepMinutes, setPrepMinutes] = useState(initialData?.prepMinutes ?? 15);
  const [cookMinutes, setCookMinutes] = useState(initialData?.cookMinutes ?? 30);
  const [restMinutes, setRestMinutes] = useState<number | "">(initialData?.restMinutes ?? "");
  const [servings, setServings] = useState(initialData?.servings ?? 4);
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>(initialData?.difficulty ?? "MEDIUM");
  const [tr, setTr] = useState(initialData?.tr ?? { title: "", summary: "", history: "", metaTitle: "", metaDesc: "" });
  const [en, setEn] = useState(initialData?.en ?? { title: "", summary: "", history: "", metaTitle: "", metaDesc: "" });
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initialData?.ingredients.map((i) => ({
      ingredientId: i.ingredientId,
      quantity: i.quantity,
      unit: i.unit as (typeof UNITS)[number],
      note: i.note,
      groupLabel: i.groupLabel,
      isOptional: i.isOptional,
    })) ?? []
  );
  const [steps, setSteps] = useState<StepRow[]>(
    initialData?.steps.map((s) => ({ durationMinutes: s.durationMinutes, tr: s.tr, en: s.en })) ?? []
  );
  const [includeNutrition, setIncludeNutrition] = useState(!!initialData?.nutrition);
  const [nutrition, setNutrition] = useState(
    initialData?.nutrition ?? { calories: 0, proteinG: 0, fatG: 0, carbsG: 0, isAiEstimated: true }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      { ingredientId: options.ingredients[0]?.id ?? "", quantity: 1, unit: "G", note: "", groupLabel: "", isOptional: false },
    ]);
  }
  function updateIngredient(idx: number, patch: Partial<IngredientRow>) {
    setIngredients((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }
  function removeIngredient(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  function addStep() {
    setSteps((prev) => [...prev, { durationMinutes: null, tr: { title: "", content: "" }, en: { title: "", content: "" } }]);
  }
  function updateStep(idx: number, patch: Partial<StepRow>) {
    setSteps((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }
  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: initialData?.id,
      slug,
      cuisineId,
      countryId,
      cityId: cityId || undefined,
      eraId: eraId || undefined,
      civilizationId: civilizationId || undefined,
      categoryId: categoryId || undefined,
      authorId,
      prepMinutes: Number(prepMinutes),
      cookMinutes: Number(cookMinutes),
      restMinutes: restMinutes === "" ? undefined : Number(restMinutes),
      servings: Number(servings),
      difficulty,
      tr: {
        title: tr.title,
        summary: tr.summary,
        history: tr.history || undefined,
        metaTitle: tr.metaTitle || undefined,
        metaDesc: tr.metaDesc || undefined,
      },
      en: {
        title: en.title,
        summary: en.summary,
        history: en.history || undefined,
        metaTitle: en.metaTitle || undefined,
        metaDesc: en.metaDesc || undefined,
      },
      ingredients: ingredients.map((row, idx) => ({
        ingredientId: row.ingredientId,
        quantity: Number(row.quantity),
        unit: row.unit,
        note: row.note || undefined,
        groupLabel: row.groupLabel || undefined,
        isOptional: row.isOptional,
        sortOrder: idx + 1,
      })),
      steps: steps.map((row, idx) => ({
        sortOrder: idx + 1,
        durationMinutes: row.durationMinutes ?? undefined,
        tr: { title: row.tr.title || undefined, content: row.tr.content },
        en: { title: row.en.title || undefined, content: row.en.content },
      })),
      nutrition: includeNutrition
        ? {
            calories: Number(nutrition.calories),
            proteinG: Number(nutrition.proteinG),
            fatG: Number(nutrition.fatG),
            carbsG: Number(nutrition.carbsG),
            isAiEstimated: nutrition.isAiEstimated,
          }
        : undefined,
    };

    const res = await upsertRecipe(payload);
    setSaving(false);
    if (res.ok) {
      router.push("/admin/recipes");
      router.refresh();
    } else {
      setError(res.error.message);
    }
  }

  const optionalSelect = (
    value: string,
    onChange: (v: string) => void,
    items: { id: string; label: string }[],
    label: string
  ) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">{tf("none")}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Temel bilgiler */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>{tf("slug")}</label>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tf("cuisine")}</label>
          <select required value={cuisineId} onChange={(e) => setCuisineId(e.target.value)} className={inputClass}>
            {options.cuisines.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{tf("country")}</label>
          <select required value={countryId} onChange={(e) => setCountryId(e.target.value)} className={inputClass}>
            {options.countries.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {optionalSelect(cityId, setCityId, options.cities, tf("city"))}
        {optionalSelect(eraId, setEraId, options.eras, tf("era"))}
        {optionalSelect(civilizationId, setCivilizationId, options.civilizations, tf("civilization"))}
        {optionalSelect(categoryId, setCategoryId, options.categories, tf("category"))}
        <div>
          <label className={labelClass}>{tf("author")}</label>
          <select required value={authorId} onChange={(e) => setAuthorId(e.target.value)} className={inputClass}>
            {options.authors.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{tf("difficulty")}</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as (typeof DIFFICULTIES)[number])} className={inputClass}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {td(`difficulty.${d}`)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className={labelClass}>{tf("prepMinutes")}</label>
          <input type="number" min={0} required value={prepMinutes} onChange={(e) => setPrepMinutes(Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tf("cookMinutes")}</label>
          <input type="number" min={0} required value={cookMinutes} onChange={(e) => setCookMinutes(Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tf("restMinutes")}</label>
          <input
            type="number"
            min={0}
            value={restMinutes}
            onChange={(e) => setRestMinutes(e.target.value === "" ? "" : Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{tf("servings")}</label>
          <input type="number" min={1} required value={servings} onChange={(e) => setServings(Number(e.target.value))} className={inputClass} />
        </div>
      </section>

      {/* Çeviriler */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className={labelClass}>{tf("titleTr")}</label>
            <input required value={tr.title} onChange={(e) => setTr({ ...tr, title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{tf("summaryTr")}</label>
            <textarea required value={tr.summary} onChange={(e) => setTr({ ...tr, summary: e.target.value })} className={inputClass} rows={2} />
          </div>
          <div>
            <label className={labelClass}>{tf("historyTr")}</label>
            <textarea value={tr.history} onChange={(e) => setTr({ ...tr, history: e.target.value })} className={inputClass} rows={6} />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>{tf("titleEn")}</label>
            <input required value={en.title} onChange={(e) => setEn({ ...en, title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{tf("summaryEn")}</label>
            <textarea required value={en.summary} onChange={(e) => setEn({ ...en, summary: e.target.value })} className={inputClass} rows={2} />
          </div>
          <div>
            <label className={labelClass}>{tf("historyEn")}</label>
            <textarea value={en.history} onChange={(e) => setEn({ ...en, history: e.target.value })} className={inputClass} rows={6} />
          </div>
        </div>
      </section>

      {/* Malzemeler */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
            {tf("ingredientsTitle")}
          </h2>
          <button type="button" onClick={addIngredient} className="rounded-md border border-line px-3 py-1.5 text-xs text-ink hover:border-primary">
            + {tf("addIngredient")}
          </button>
        </div>
        <div className="space-y-3">
          {ingredients.map((row, idx) => (
            <div key={idx} className="grid grid-cols-2 items-end gap-2 rounded-md border border-line p-3 sm:grid-cols-7">
              <div className="sm:col-span-2">
                <label className={labelClass}>{tf("ingredient")}</label>
                <select value={row.ingredientId} onChange={(e) => updateIngredient(idx, { ingredientId: e.target.value })} className={inputClass}>
                  {options.ingredients.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{tf("quantity")}</label>
                <input type="number" step="any" min={0} value={row.quantity} onChange={(e) => updateIngredient(idx, { quantity: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{tf("unit")}</label>
                <select value={row.unit} onChange={(e) => updateIngredient(idx, { unit: e.target.value as (typeof UNITS)[number] })} className={inputClass}>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{tf("groupLabel")}</label>
                <input value={row.groupLabel} onChange={(e) => updateIngredient(idx, { groupLabel: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{tf("note")}</label>
                <input value={row.note} onChange={(e) => updateIngredient(idx, { note: e.target.value })} className={inputClass} />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <input type="checkbox" checked={row.isOptional} onChange={(e) => updateIngredient(idx, { isOptional: e.target.checked })} />
                  {tf("optional")}
                </label>
                <button type="button" onClick={() => removeIngredient(idx)} className="ml-auto text-xs text-red-600">
                  {tf("remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Adımlar */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
            {tf("stepsTitle")}
          </h2>
          <button type="button" onClick={addStep} className="rounded-md border border-line px-3 py-1.5 text-xs text-ink hover:border-primary">
            + {tf("addStep")}
          </button>
        </div>
        <div className="space-y-4">
          {steps.map((row, idx) => (
            <div key={idx} className="space-y-2 rounded-md border border-line p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  placeholder={tf("stepTitleTr")}
                  value={row.tr.title}
                  onChange={(e) => updateStep(idx, { tr: { ...row.tr, title: e.target.value } })}
                  className={inputClass}
                />
                <input
                  placeholder={tf("stepTitleEn")}
                  value={row.en.title}
                  onChange={(e) => updateStep(idx, { en: { ...row.en, title: e.target.value } })}
                  className={inputClass}
                />
                <textarea
                  required
                  placeholder={tf("stepContentTr")}
                  value={row.tr.content}
                  onChange={(e) => updateStep(idx, { tr: { ...row.tr, content: e.target.value } })}
                  className={inputClass}
                  rows={2}
                />
                <textarea
                  required
                  placeholder={tf("stepContentEn")}
                  value={row.en.content}
                  onChange={(e) => updateStep(idx, { en: { ...row.en, content: e.target.value } })}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                  {tf("duration")}
                  <input
                    type="number"
                    min={0}
                    value={row.durationMinutes ?? ""}
                    onChange={(e) => updateStep(idx, { durationMinutes: e.target.value === "" ? null : Number(e.target.value) })}
                    className="w-20 rounded-md border border-line bg-bg px-2 py-1"
                  />
                </label>
                <button type="button" onClick={() => removeStep(idx)} className="ml-auto text-xs text-red-600">
                  {tf("remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Besin değerleri */}
      <section>
        <label className="mb-3 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={includeNutrition} onChange={(e) => setIncludeNutrition(e.target.checked)} />
          {tf("includeNutrition")}
        </label>
        {includeNutrition && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className={labelClass}>{tf("calories")}</label>
              <input type="number" min={0} value={nutrition.calories} onChange={(e) => setNutrition({ ...nutrition, calories: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tf("protein")}</label>
              <input type="number" min={0} value={nutrition.proteinG} onChange={(e) => setNutrition({ ...nutrition, proteinG: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tf("fat")}</label>
              <input type="number" min={0} value={nutrition.fatG} onChange={(e) => setNutrition({ ...nutrition, fatG: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tf("carbs")}</label>
              <input type="number" min={0} value={nutrition.carbsG} onChange={(e) => setNutrition({ ...nutrition, carbsG: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>
        )}
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? t("saving") : t("save")}
        </button>
        <button type="button" onClick={() => router.push("/admin/recipes")} className="rounded-md border border-line px-6 py-2.5 text-sm text-ink">
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
