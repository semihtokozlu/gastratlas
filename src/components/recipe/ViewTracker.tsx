"use client";

import { useEffect } from "react";
import { incrementViewCount } from "@/features/recipes/actions";

/** Sayfa SSG olduğu için görüntülenme sayısı render'da değil, mount'ta client'tan artırılır. */
export function ViewTracker({ recipeId }: { recipeId: string }) {
  useEffect(() => {
    const key = `gastratlas:viewed:${recipeId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    incrementViewCount(recipeId).catch(() => {});
  }, [recipeId]);

  return null;
}
