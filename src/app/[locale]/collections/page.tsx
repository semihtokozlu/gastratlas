import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSessionUser } from "@/lib/auth/guards";
import { getUserCollections } from "@/features/collections/queries";
import { CollectionsManager } from "@/components/collections/CollectionsManager";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (!user) {
    redirect(`/${locale}/auth/login?next=${encodeURIComponent(`/${locale}/collections`)}`);
  }

  const t = await getTranslations({ locale, namespace: "collectionsPage" });
  const collections = await getUserCollections(user.id);

  return (
    <main className="container max-w-5xl py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("subtitle")}</p>

      <div className="mt-10">
        <CollectionsManager initialCollections={collections} />
      </div>
    </main>
  );
}
