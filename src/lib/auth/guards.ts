import { createSupabaseServer } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

/** Rol hiyerarşisi — yüksek rol düşük rolün tüm yetkilerini kapsar. */
const ROLE_LEVEL: Record<Role, number> = {
  VISITOR: 0,
  USER: 1,
  EDITOR: 2,
  HISTORIAN: 3,
  ADMIN: 4,
};

export class AuthError extends Error {
  constructor(public code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code);
  }
}

export async function getSessionUser() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return db.user.findUnique({ where: { id: data.user.id } });
}

/**
 * Server Action girişlerinde birinci savunma katmanı.
 * İkinci katman PostgreSQL RLS'tir (bkz. planlama paketi §9).
 */
export async function requireRole(minimum: Role) {
  const user = await getSessionUser();
  if (!user) throw new AuthError("UNAUTHENTICATED");
  if (ROLE_LEVEL[user.role] < ROLE_LEVEL[minimum]) throw new AuthError("FORBIDDEN");
  return user;
}
