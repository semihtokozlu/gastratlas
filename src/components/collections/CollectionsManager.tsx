"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createCollection, deleteCollection } from "@/features/collections/actions";
import type { CollectionSummary } from "@/features/collections/queries";

export function CollectionsManager({ initialCollections }: { initialCollections: CollectionSummary[] }) {
  const t = useTranslations("collectionsPage");
  const [collections, setCollections] = useState(initialCollections);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await createCollection({ name, description: description || undefined, isPublic });
    setCreating(false);
    if (res.ok) {
      setCollections((prev) => [
        { id: res.data.id, name, description: description || null, isPublic, itemCount: 0, createdAt: new Date() },
        ...prev,
      ]);
      setName("");
      setDescription("");
      setIsPublic(false);
    } else {
      setError(res.error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("deleteConfirm"))) return;
    const res = await deleteCollection({ collectionId: id });
    if (res.ok) setCollections((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-10 max-w-md space-y-3 rounded-lg border border-line p-5">
        <p className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
          {t("createTitle")}
        </p>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">{t("nameLabel")}</label>
          <input
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-muted">
            {t("descriptionLabel")}
          </label>
          <textarea
            maxLength={500}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          {t("publicLabel")}
        </label>
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
        >
          {creating ? t("creating") : t("create")}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {collections.length === 0 ? (
        <p className="text-ink-muted">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div key={c.id} className="rounded-lg border border-line p-4">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/collections/${c.id}`} className="font-serif text-ink hover:underline" style={{ fontSize: "var(--text-h3)" }}>
                  {c.name}
                </Link>
                <button onClick={() => handleDelete(c.id)} className="shrink-0 text-xs text-red-600 underline">
                  {t("delete")}
                </button>
              </div>
              {c.description && <p className="mt-1 text-sm text-ink-muted">{c.description}</p>}
              <p className="mt-3 text-xs uppercase tracking-wide text-ink-muted">
                {t("itemCount", { count: c.itemCount })} · {c.isPublic ? t("public") : t("private")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
