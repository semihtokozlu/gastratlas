import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AuthCodeErrorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <main className="container flex min-h-[60vh] max-w-md flex-col justify-center py-12 text-center">
      <p className="text-ink">{t("error")}</p>
    </main>
  );
}
