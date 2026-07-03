"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { ContentStatus } from "@prisma/client";
import { setRecipeStatus, publishRecipe } from "@/features/admin/actions";

const EDITOR_STATUSES: ContentStatus[] = ["DRAFT", "AI_REVIEW", "EDITOR_REVIEW", "ARCHIVED"];

export function StatusControls({
  recipeId,
  initialStatus,
  canPublish,
}: {
  recipeId: string;
  initialStatus: ContentStatus;
  canPublish: boolean;
}) {
  const t = useTranslations("admin");
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStatusChange(next: ContentStatus) {
    setError(null);
    startTransition(async () => {
      const res = await setRecipeStatus({ recipeId, status: next });
      if (res.ok) setStatus(res.data.status);
      else setError(res.error.message);
    });
  }

  function handlePublish() {
    setError(null);
    startTransition(async () => {
      const res = await publishRecipe({ recipeId });
      if (res.ok) setStatus(res.data.status);
      else setError(res.error.message);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value as ContentStatus)}
        className="rounded-md border border-line bg-bg px-2 py-1 text-xs text-ink"
      >
        {EDITOR_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t(`status.${s}`)}
          </option>
        ))}
        {status === "PUBLISHED" && <option value="PUBLISHED">{t("status.PUBLISHED")}</option>}
      </select>
      {canPublish && status !== "PUBLISHED" && (
        <button
          onClick={handlePublish}
          disabled={isPending}
          className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
        >
          {isPending ? t("saving") : t("publish")}
        </button>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
