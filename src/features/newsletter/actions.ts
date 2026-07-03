"use server";

import { db } from "@/lib/db";
import { subscribeNewsletterSchema } from "./schemas";
import type { ActionResult } from "@/features/recipes/schemas";

/**
 * PUBLIC — planlama §8.1 "subscribeNewsletter". confirmedAt=null olarak
 * kaydedilir (double opt-in token'ı zaten NewsletterSubscriber.token
 * default'uyla üretilir), ANCAK bu onay e-postasını gönderen bir servis
 * (Resend/SendGrid vb.) HENÜZ KURULMADI — bu bilinen ve raporlanan bir
 * sınırlamadır, sahte bir "onay e-postası gönderildi" iddiası yapılmaz.
 * Rate-limit de aynı şekilde henüz yok (bkz. planlama notu).
 */
export async function subscribeNewsletter(
  input: unknown
): Promise<ActionResult<{ status: "subscribed" | "already-subscribed" }>> {
  const parsed = subscribeNewsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçerli bir e-posta adresi girin" } };
  }

  const { email, locale } = parsed.data;
  const existing = await db.newsletterSubscriber.findUnique({ where: { email } });

  if (existing) {
    if (existing.unsubscribedAt) {
      await db.newsletterSubscriber.update({ where: { id: existing.id }, data: { unsubscribedAt: null } });
    }
    return { ok: true, data: { status: "already-subscribed" } };
  }

  await db.newsletterSubscriber.create({ data: { email, locale } });
  return { ok: true, data: { status: "subscribed" } };
}
