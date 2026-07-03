import { db } from "@/lib/db";

export type MethodologyStats = {
  publishedRecipeCount: number;
  sourceCount: number;
  avgReliability: number | null;
  cuisineCount: number;
};

/** Metodoloji sayfasındaki iddiaları gerçek sayılarla destekler (iddia değil, ölçülebilir gerçek). */
export async function getMethodologyStats(): Promise<MethodologyStats> {
  const [publishedRecipeCount, sources, cuisineCount] = await Promise.all([
    db.recipe.count({ where: { status: "PUBLISHED" } }),
    db.historicalSource.findMany({ select: { reliability: true } }),
    db.cuisine.count(),
  ]);

  const avgReliability =
    sources.length > 0 ? sources.reduce((sum, s) => sum + s.reliability, 0) / sources.length : null;

  return {
    publishedRecipeCount,
    sourceCount: sources.length,
    avgReliability,
    cuisineCount,
  };
}
