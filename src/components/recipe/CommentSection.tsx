"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getCommentSectionData, submitComment } from "@/features/comments/actions";
import type { CommentItem } from "@/features/comments/queries";

export function CommentSection({ recipeId }: { recipeId: string }) {
  const t = useTranslations("comments");
  const locale = useLocale();
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCommentSectionData(recipeId).then((data) => {
      if (!cancelled) {
        setComments(data.comments);
        setIsAuthenticated(data.isAuthenticated);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await submitComment({ recipeId, content });
    setSubmitting(false);
    if (res.ok) {
      setContent("");
      const data = await getCommentSectionData(recipeId);
      setComments(data.comments);
    } else {
      setError(res.error.message);
    }
  }

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("title")}
      </h2>

      {comments === null ? (
        <p className="text-sm text-ink-muted">{t("loading")}</p>
      ) : (
        <>
          {comments.length === 0 ? (
            <p className="mb-6 text-sm text-ink-muted">{t("empty")}</p>
          ) : (
            <ul className="mb-6 space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="border-b border-line pb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">{c.userName}</span>
                    <span className="text-xs text-ink-muted">
                      {new Date(c.createdAt).toLocaleDateString(locale)}
                    </span>
                    {c.status === "PENDING" && (
                      <span className="rounded bg-surface px-1.5 py-0.5 text-xs text-accent">{t("pending")}</span>
                    )}
                  </div>
                  <p className="mt-1 text-ink-muted">{c.content}</p>
                </li>
              ))}
            </ul>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                required
                maxLength={2000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("placeholder")}
                rows={3}
                className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
              />
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          ) : (
            <p className="text-sm text-ink-muted">
              {t("loginPrompt")}{" "}
              <Link href="/auth/login" className="text-primary underline">
                {t("loginLink")}
              </Link>
              .
            </p>
          )}
        </>
      )}
    </section>
  );
}
