"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { moderateComment } from "@/features/admin/actions";

export function CommentModerationControls({
  commentId,
  initialStatus,
}: {
  commentId: string;
  initialStatus: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
}) {
  const t = useTranslations("admin");
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  function apply(next: "APPROVED" | "REJECTED" | "HIDDEN") {
    startTransition(async () => {
      const res = await moderateComment({ commentId, status: next });
      if (res.ok) setStatus(res.data.status as typeof status);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="rounded bg-surface px-2 py-0.5 text-xs text-ink">{t(`commentStatus.${status}`)}</span>
      {status !== "APPROVED" && (
        <button
          onClick={() => apply("APPROVED")}
          disabled={isPending}
          className="text-xs text-primary underline disabled:opacity-60"
        >
          {t("approve")}
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          onClick={() => apply("REJECTED")}
          disabled={isPending}
          className="text-xs text-red-600 underline disabled:opacity-60"
        >
          {t("reject")}
        </button>
      )}
      {status !== "HIDDEN" && (
        <button
          onClick={() => apply("HIDDEN")}
          disabled={isPending}
          className="text-xs text-ink-muted underline disabled:opacity-60"
        >
          {t("hide")}
        </button>
      )}
    </div>
  );
}
