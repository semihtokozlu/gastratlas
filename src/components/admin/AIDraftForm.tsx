"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { generateRecipeDraft } from "@/features/ai-recipes/actions";
import type { AdminFormOptions } from "@/features/admin/queries";

const inputClass = "w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink";

export function AIDraftForm({ options }: { options: AdminFormOptions }) {
  const t = useTranslations("admin");
  const [topic, setTopic] = useState("");
  const [cuisineId, setCuisineId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [eraId, setEraId] = useState("");
  const [civilizationId, setCivilizationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; slug: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("generating");
    setError(null);
    const res = await generateRecipeDraft({
      topic,
      cuisineId,
      countryId,
      cityId: cityId || undefined,
      eraId: eraId || undefined,
      civilizationId: civilizationId || undefined,
      categoryId: categoryId || undefined,
      authorId,
    });
    if (res.ok) {
      setStatus("done");
      setResult({ id: res.data.id, slug: res.data.slug });
    } else {
      setStatus("error");
      setError(res.error.message || t("aiDraftError"));
    }
  }

  if (status === "done" && result) {
    return (
      <div className="rounded-lg border border-line p-6">
        <p className="text-ink">{t("aiDraftSuccess")}</p>
        <Link href={`/admin/recipes/${result.id}/edit`} className="mt-4 inline-block text-primary underline">
          {t("aiDraftReviewLink")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <p className="text-sm text-ink-muted">{t("aiDraftIntro")}</p>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">
          {t("aiDraftTopicLabel")}
        </label>
        <input
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("aiDraftTopicPlaceholder")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("form.cuisine")}</label>
          <select required value={cuisineId} onChange={(e) => setCuisineId(e.target.value)} className={inputClass}>
            <option value="" />
            {options.cuisines.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("form.country")}</label>
          <select required value={countryId} onChange={(e) => setCountryId(e.target.value)} className={inputClass}>
            <option value="" />
            {options.countries.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("form.city")}</label>
          <select value={cityId} onChange={(e) => setCityId(e.target.value)} className={inputClass}>
            <option value="">{t("form.none")}</option>
            {options.cities.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("form.era")}</label>
          <select value={eraId} onChange={(e) => setEraId(e.target.value)} className={inputClass}>
            <option value="">{t("form.none")}</option>
            {options.eras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">
            {t("form.civilization")}
          </label>
          <select value={civilizationId} onChange={(e) => setCivilizationId(e.target.value)} className={inputClass}>
            <option value="">{t("form.none")}</option>
            {options.civilizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("form.category")}</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
            <option value="">{t("form.none")}</option>
            {options.categories.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("form.author")}</label>
        <select required value={authorId} onChange={(e) => setAuthorId(e.target.value)} className={inputClass}>
          <option value="" />
          {options.authors.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "generating"}
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
      >
        {status === "generating" ? t("aiDraftGenerating") : t("aiDraftGenerate")}
      </button>
      {status === "error" && error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
