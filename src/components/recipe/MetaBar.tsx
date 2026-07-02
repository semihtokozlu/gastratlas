import { useTranslations } from "next-intl";
import type { Difficulty } from "@prisma/client";

export function MetaBar({
  prepMinutes,
  cookMinutes,
  restMinutes,
  servings,
  difficulty,
}: {
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number | null;
  servings: number;
  difficulty: Difficulty;
}) {
  const t = useTranslations("recipe");

  const items: { label: string; value: string }[] = [
    { label: t("prepTime"), value: `${prepMinutes} ${t("minutesAbbr")}` },
    { label: t("cookTime"), value: `${cookMinutes} ${t("minutesAbbr")}` },
    ...(restMinutes ? [{ label: t("restTime"), value: `${restMinutes} ${t("minutesAbbr")}` }] : []),
    { label: t("servings"), value: `${servings} ${t("servingsUnit")}` },
  ];

  return (
    <div className="mb-10 flex flex-wrap items-end gap-x-8 gap-y-3 border-y border-line py-4 text-sm">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-ink-muted">{item.label}</span>
          <span className="font-medium text-ink">{item.value}</span>
        </div>
      ))}
      <span className="ml-auto rounded-md bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink">
        {t(`difficulty.${difficulty}`)}
      </span>
    </div>
  );
}
