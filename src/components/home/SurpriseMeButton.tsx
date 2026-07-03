"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getRandomRecipeSlug } from "@/features/recipes/actions";

export function SurpriseMeButton() {
  const t = useTranslations("home");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await getRandomRecipeSlug();
      if (res.ok) router.push(`/recipes/${res.data.slug}`);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md border border-line px-8 py-3 text-sm text-ink-muted transition-colors duration-200 ease-brand hover:text-ink disabled:opacity-60"
    >
      {isPending ? t("surpriseMeLoading") : t("surpriseMe")}
    </button>
  );
}
