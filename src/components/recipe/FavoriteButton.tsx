"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { getFavoriteState, toggleFavorite } from "@/features/favorites/actions";

export function FavoriteButton({ recipeId }: { recipeId: string }) {
  const t = useTranslations("recipe");
  const locale = useLocale();
  const pathname = usePathname();
  const [state, setState] = useState<{ isAuthenticated: boolean; favorited: boolean } | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFavoriteState(recipeId).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  if (state === null) {
    return <div className="h-8 w-40" />;
  }

  if (!state.isAuthenticated) {
    return (
      <Link
        href={`/auth/login?next=${encodeURIComponent(`/${locale}${pathname}`)}`}
        className="inline-block rounded-md border border-line px-4 py-1.5 text-sm text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
      >
        {t("addToFavorites")}
      </Link>
    );
  }

  async function handleClick() {
    if (!state || pending) return;
    setPending(true);
    const res = await toggleFavorite({ recipeId });
    setPending(false);
    if (res.ok) setState({ isAuthenticated: true, favorited: res.data.favorited });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`rounded-md border px-4 py-1.5 text-sm transition-colors duration-200 ease-brand disabled:opacity-60 ${
        state.favorited
          ? "border-primary text-primary"
          : "border-line text-ink-muted hover:text-ink"
      }`}
    >
      {state.favorited ? t("removeFromFavorites") : t("addToFavorites")}
    </button>
  );
}
