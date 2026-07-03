"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { updateCollection, deleteCollection, removeRecipeFromCollection } from "@/features/collections/actions";
import type { CollectionDetail } from "@/features/collections/queries";

export function CollectionDetailManager({ collection }: { collection: CollectionDetail }) {
  const t = useTranslations("collectionPage");
  const router = useRouter();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description ?? "");
  const [isPublic, setIsPublic] = useState(collection.isPublic);
  const [recipes, setRecipes] = useState(collection.recipes);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await updateCollection({
      collectionId: collection.id,
      name,
      description: description || undefined,
      isPublic,
    });
    setSaving(false);
    if (res.ok) setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirm"))) return;
    const res = await deleteCollection({ collectionId: collection.id });
    if (res.ok) router.push("/collections");
  }

  async function handleRemove(recipeId: string) {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    await removeRecipeFromCollection({ collectionId: collection.id, recipeId });
  }

  return (
    <div>
      {editing ? (
        <div className="max-w-md space-y-3 rounded-lg border border-line p-5">
          <input
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
          />
          <textarea
            maxLength={500}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
          />
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            {t("public")}
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-bg disabled:opacity-60"
            >
              {saving ? t("saving") : t("save")}
            </button>
            <button onClick={() => setEditing(false)} className="text-sm text-ink-muted underline">
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
                {name}
              </h1>
              {description && <p className="mt-2 text-ink-muted">{description}</p>}
              <p className="mt-2 text-xs uppercase tracking-wide text-ink-muted">
                {isPublic ? t("public") : t("private")}
                {!collection.isOwner && ` · ${t("byUser")} ${collection.ownerName}`}
              </p>
            </div>
            {collection.isOwner && (
              <div className="flex shrink-0 gap-3 text-sm">
                <button onClick={() => setEditing(true)} className="text-ink-muted underline hover:text-ink">
                  {t("edit")}
                </button>
                <button onClick={handleDelete} className="text-red-600 underline">
                  {t("delete")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {recipes.length === 0 ? (
        <p className="mt-10 text-ink-muted">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard {...recipe} />
              {collection.isOwner && (
                <button
                  onClick={() => handleRemove(recipe.id)}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  {t("remove")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
