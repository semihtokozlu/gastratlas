import Image from "next/image";
import { useTranslations } from "next-intl";
import { getPublicImageUrl } from "@/lib/storage/upload";
import type { HeroImage } from "@/features/recipes/queries";

export function RecipeHero({
  title,
  summary,
  countryName,
  eraName,
  heroImage,
}: {
  title: string;
  summary: string;
  countryName: string;
  eraName: string | null;
  heroImage: HeroImage | null;
}) {
  const t = useTranslations("recipe");

  return (
    <header className="mb-10 overflow-hidden rounded-lg border border-line">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-surface to-primary/10 sm:aspect-[21/9]">
        {heroImage ? (
          <>
            <Image
              src={getPublicImageUrl(heroImage.storagePath)}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 768px"
            />
            {heroImage.isAiGenerated && (
              <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs uppercase tracking-wide text-white">
                {t("aiGeneratedImage")}
              </span>
            )}
            {heroImage.credit && (
              <span className="absolute bottom-2 right-3 rounded bg-black/50 px-2 py-0.5 text-[11px] text-white">
                {heroImage.credit}
              </span>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-ink-muted">
              {t("heroImagePlaceholder")}
            </span>
          </div>
        )}
      </div>
      <div className="bg-bg px-6 py-8 sm:px-10">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-accent">
          {countryName}
          {eraName ? ` · ${eraName}` : ""}
        </p>
        <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-muted">{summary}</p>
      </div>
    </header>
  );
}
