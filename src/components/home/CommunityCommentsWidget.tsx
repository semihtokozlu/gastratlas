import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRecentApprovedComments } from "@/features/comments/queries";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

export async function CommunityCommentsWidget({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const comments = await getRecentApprovedComments(locale);

  if (comments.length === 0) return null;

  return (
    <section className="container py-12">
      <h2 className="mb-8 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("communityTitle")}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {comments.map((c) => (
          <Link
            key={c.id}
            href={`/recipes/${c.recipeSlug}`}
            className="block rounded-lg border border-line p-5 transition-colors duration-200 ease-brand hover:border-accent"
          >
            <p className="line-clamp-3 text-sm text-ink">&ldquo;{c.content}&rdquo;</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-ink-muted">
              {c.userName} · {c.recipeTitle} · {formatRelativeTime(c.createdAt, locale)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
