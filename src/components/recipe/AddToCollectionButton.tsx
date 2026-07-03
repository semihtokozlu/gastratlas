"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  getCollectionPickerData,
  createCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
} from "@/features/collections/actions";
import type { CollectionPickerItem } from "@/features/collections/queries";

export function AddToCollectionButton({ recipeId }: { recipeId: string }) {
  const t = useTranslations("collectionPicker");
  const locale = useLocale();
  const pathname = usePathname();
  const [state, setState] = useState<{ isAuthenticated: boolean; collections: CollectionPickerItem[] } | null>(null);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getCollectionPickerData(recipeId).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function toggleCollection(collection: CollectionPickerItem) {
    if (!state) return;
    const next = !collection.containsRecipe;
    setState({
      ...state,
      collections: state.collections.map((c) => (c.id === collection.id ? { ...c, containsRecipe: next } : c)),
    });
    if (next) {
      await addRecipeToCollection({ collectionId: collection.id, recipeId });
    } else {
      await removeRecipeFromCollection({ collectionId: collection.id, recipeId });
    }
  }

  async function handleCreate() {
    if (!newName.trim() || !state) return;
    setCreating(true);
    const res = await createCollection({ name: newName });
    if (res.ok) {
      await addRecipeToCollection({ collectionId: res.data.id, recipeId });
      setState({
        ...state,
        collections: [{ id: res.data.id, name: newName, containsRecipe: true }, ...state.collections],
      });
      setNewName("");
    }
    setCreating(false);
  }

  if (state === null) {
    return <div className="h-8 w-40" />;
  }

  if (!state.isAuthenticated) {
    return (
      <Link
        href={`/auth/login?next=${encodeURIComponent(`/${locale}${pathname}`)}`}
        className="rounded-md border border-line px-4 py-1.5 text-sm text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
      >
        {t("addToCollection")}
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-line px-4 py-1.5 text-sm text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
      >
        {t("addToCollection")}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-line bg-bg p-3 shadow-card">
          {state.collections.length === 0 ? (
            <p className="mb-3 text-sm text-ink-muted">{t("noCollections")}</p>
          ) : (
            <ul className="mb-3 max-h-48 space-y-2 overflow-y-auto">
              {state.collections.map((c) => (
                <li key={c.id}>
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={c.containsRecipe}
                      onChange={() => toggleCollection(c)}
                    />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2 border-t border-line pt-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("newCollectionPlaceholder")}
              maxLength={100}
              className="w-full rounded-md border border-line bg-bg px-2 py-1 text-sm text-ink"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-medium text-bg disabled:opacity-60"
            >
              {t("create")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
