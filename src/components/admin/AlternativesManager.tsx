"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { verifyIngredientAlternative } from "@/features/admin/actions";
import type { UnverifiedAlternativeRow } from "@/features/admin/queries";

export function AlternativesManager({ initialAlternatives }: { initialAlternatives: UnverifiedAlternativeRow[] }) {
  const t = useTranslations("admin");
  const [rows, setRows] = useState(initialAlternatives);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handle(id: string, approve: boolean) {
    setPendingId(id);
    const res = await verifyIngredientAlternative({ id, approve });
    setPendingId(null);
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  if (rows.length === 0) {
    return <p className="mt-6 text-ink-muted">{t("noAlternatives")}</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {rows.map((row) => (
        <div key={row.id} className="rounded-lg border border-line p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="text-sm">
              <p className="text-ink">
                <span className="font-medium">{row.ingredientName}</span>
                <span className="text-ink-muted"> → </span>
                <span className="font-medium">{row.alternativeName}</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-accent">
                {row.type} · {t("ratio")}: {row.ratio}
              </p>
              {row.aiExplanation && <p className="mt-2 text-sm text-ink-muted">{row.aiExplanation}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => handle(row.id, true)}
                disabled={pendingId === row.id}
                className="text-xs text-primary underline disabled:opacity-60"
              >
                {t("approve")}
              </button>
              <button
                onClick={() => handle(row.id, false)}
                disabled={pendingId === row.id}
                className="text-xs text-red-600 underline disabled:opacity-60"
              >
                {t("reject")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
