"use client";

import dynamic from "next/dynamic";
import type { RecipeGeoPoint } from "@/features/recipes/queries";

/** Leaflet `window`'a bağımlı olduğu için SSR'da çalışmaz (mimari doküman §2.3). */
const WorldMap = dynamic(() => import("./WorldMap").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse rounded-lg bg-surface" />,
});

export function MapLoader({ points }: { points: RecipeGeoPoint[] }) {
  return <WorldMap points={points} />;
}
