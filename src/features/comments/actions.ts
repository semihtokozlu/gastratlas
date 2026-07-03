"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/guards";
import { submitCommentSchema } from "./schemas";
import { getComments, type CommentItem } from "./queries";
import type { ActionResult } from "@/features/recipes/schemas";

/** Client component'in (CommentSection) mount'ta çağırdığı salt-okunur wrapper. */
export async function getCommentSectionData(
  recipeId: string
): Promise<{ comments: CommentItem[]; isAuthenticated: boolean }> {
  const [user, comments] = await Promise.all([getSessionUser(), getComments(recipeId)]);
  return { comments, isAuthenticated: !!user };
}

/**
 * USER+ — planlama §9 rol tablosu ("USER: + ... yorum"). Yeni yorum her
 * zaman PENDING olarak kaydedilir; EDITOR+ moderasyonu bekler.
 */
export async function submitComment(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = submitCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Yorum yapmak için giriş yapmalısınız" } };
  }

  const recipe = await db.recipe.findFirst({ where: { id: parsed.data.recipeId, status: "PUBLISHED" } });
  if (!recipe) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
  }

  const comment = await db.comment.create({
    data: { recipeId: parsed.data.recipeId, userId: user.id, content: parsed.data.content, status: "PENDING" },
  });

  return { ok: true, data: { id: comment.id } };
}
