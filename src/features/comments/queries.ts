import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/guards";
import { routing } from "@/i18n/routing";

export type CommentItem = {
  id: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  createdAt: Date;
  userName: string;
  isOwn: boolean;
};

/**
 * Görünürlük kuralı RLS "Comment_read" ile aynıdır (§9 çift katman savunma):
 * APPROVED herkese açık; kendi yorumun her zaman görünür; EDITOR+ hepsini görür.
 */
export async function getComments(recipeId: string): Promise<CommentItem[]> {
  const user = await getSessionUser();
  const isEditorPlus = user?.role === "EDITOR" || user?.role === "HISTORIAN" || user?.role === "ADMIN";

  const comments = await db.comment.findMany({
    where: isEditorPlus
      ? { recipeId }
      : { recipeId, OR: [{ status: "APPROVED" }, ...(user ? [{ userId: user.id }] : [])] },
    include: { user: { select: { displayName: true } } },
    orderBy: { createdAt: "asc" },
  });

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    status: c.status,
    createdAt: c.createdAt,
    userName: c.user.displayName ?? "GastrAtlas Kullanıcısı",
    isOwn: user?.id === c.userId,
  }));
}

export type RecentComment = {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
  recipeSlug: string;
  recipeTitle: string;
};

/** PUBLIC — herkese açık, yalnızca onaylanmış yorumlar (moderasyon kuyruğunu atlamaz). */
export async function getRecentApprovedComments(locale: string, limit = 3): Promise<RecentComment[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const comments = await db.comment.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { displayName: true } },
      recipe: { select: { slug: true, translations: { where: localeFilter } } },
    },
  });

  return comments.flatMap((c) => {
    const t = c.recipe.translations.find((tr) => tr.locale === locale) ?? c.recipe.translations[0];
    if (!t) return [];
    return [
      {
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        userName: c.user.displayName ?? "GastrAtlas Kullanıcısı",
        recipeSlug: c.recipe.slug,
        recipeTitle: t.title,
      },
    ];
  });
}
