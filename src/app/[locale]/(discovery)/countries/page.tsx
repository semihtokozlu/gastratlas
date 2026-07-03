import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCountries } from "@/features/countries/queries";
import { CountryCard } from "@/components/discovery/CountryCard";

export const revalidate = 3600;

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countriesPage" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CountriesPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("countriesPage");
  const countries = await getCountries(locale);

  return (
    <main className="container py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">{t("subtitle")}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <CountryCard key={country.slug} {...country} />
        ))}
      </div>
    </main>
  );
}
