import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { requireRole, AuthError } from "@/lib/auth/guards";
import { Link } from "@/i18n/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    await requireRole("EDITOR");
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.code === "UNAUTHENTICATED") {
        redirect(`/${locale}/auth/login?next=/${locale}/admin/recipes`);
      }
      const t = await getTranslations({ locale, namespace: "admin" });
      return (
        <main className="container flex min-h-[60vh] items-center justify-center py-12 text-center">
          <p className="text-ink-muted">{t("forbidden")}</p>
        </main>
      );
    }
    throw e;
  }

  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="border-t border-line bg-surface/40">
      <div className="container py-10">
        <nav className="mb-8 flex gap-6 border-b border-line pb-4 text-sm">
          <Link href="/admin/recipes" className="text-ink-muted hover:text-ink">
            {t("recipesNav")}
          </Link>
          <Link href="/admin/comments" className="text-ink-muted hover:text-ink">
            {t("commentsNav")}
          </Link>
          <Link href="/admin/recipes/ai-draft" className="text-ink-muted hover:text-ink">
            {t("aiDraftNav")}
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
