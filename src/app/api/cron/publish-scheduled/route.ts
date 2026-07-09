import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Vercel Cron ile tetiklenir (bkz. vercel.json). Daha önce planlama
 * §admin/actions.ts'te "bilinen sınırlama" olarak işaretlenmiş boşluğu
 * kapatır: publishRecipe(scheduledAt: gelecek tarih) yalnızca alanı
 * kaydediyordu, gerçek zamanda kimse PUBLISHED'e çevirmiyordu.
 *
 * Yetkilendirme: Vercel Cron istekleri `Authorization: Bearer $CRON_SECRET`
 * header'ıyla gelir (Vercel'in resmi cron kimlik doğrulama deseni).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await db.recipe.findMany({
    where: { scheduledAt: { lte: new Date() } },
    select: { id: true, slug: true },
  });

  if (due.length > 0) {
    // Cron job'un kendi "kullanıcısı" yok — AuditLog.userId zorunlu bir FK
    // olduğundan sistem eylemini işaretlemek için ilk ADMIN kullanıcı referans
    // alınır; gerçek fail eden kişi değil, `after.source` bunu netleştirir.
    const systemUser = await db.user.findFirstOrThrow({ where: { role: "ADMIN" } });

    for (const recipe of due) {
      await db.recipe.update({
        where: { id: recipe.id },
        data: { status: "PUBLISHED", publishedAt: new Date(), scheduledAt: null },
      });
      await db.auditLog.create({
        data: {
          userId: systemUser.id,
          entityType: "Recipe",
          entityId: recipe.id,
          action: "PUBLISH",
          after: { status: "PUBLISHED", source: "scheduled-publish-cron" },
        },
      });
    }
  }

  return NextResponse.json({ ok: true, publishedCount: due.length, slugs: due.map((r) => r.slug) });
}
