import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/guards";

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
