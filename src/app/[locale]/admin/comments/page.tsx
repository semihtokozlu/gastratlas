import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminCommentList } from "@/features/admin/queries";
import { CommentModerationControls } from "@/components/admin/CommentModerationControls";
import { Link } from "@/i18n/navigation";

export default async function AdminCommentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const comments = await getAdminCommentList(locale, "PENDING");

  return (
    <div>
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("commentsTitle")}
      </h1>

      {comments.length === 0 ? (
        <p className="mt-6 text-ink-muted">{t("noComments")}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-lg border border-line bg-bg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-ink">{c.userName}</span>
                  <span className="text-ink-muted"> — </span>
                  <Link href={`/recipes/${c.recipeSlug}`} className="text-primary underline">
                    {c.recipeTitle}
                  </Link>
                </div>
                <CommentModerationControls commentId={c.id} initialStatus={c.status} />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
