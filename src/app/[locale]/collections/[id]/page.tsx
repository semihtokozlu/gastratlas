import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSessionUser } from "@/lib/auth/guards";
import { getCollectionDetail } from "@/features/collections/queries";
import { CollectionDetailManager } from "@/components/collections/CollectionDetailManager";
import { Link } from "@/i18n/navigation";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  const t = await getTranslations({ locale, namespace: "collectionPage" });
  const collection = await getCollectionDetail(id, user?.id ?? null, locale);

  return (
    <main className="container max-w-5xl py-12">
      <Link href="/collections" className="text-sm text-ink-muted hover:text-ink">
        &larr; {t("backToCollections")}
      </Link>

      <div className="mt-6">
        {collection ? (
          <CollectionDetailManager collection={collection} />
        ) : (
          <p className="mt-10 text-ink-muted">{t("notFound")}</p>
        )}
      </div>
    </main>
  );
}
