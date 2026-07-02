/**
 * Tarif dinamik yeniden hesaplama motoru — DOMAIN katmanı.
 * Framework'süz, saf fonksiyonlar. "Tarif dinamik olarak yeniden
 * hesaplanabilmelidir" gereksiniminin (master prompt) çekirdeği.
 */

export type ScalableIngredient = {
  ingredientId: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
};

export type Substitution = {
  /** Değiştirilecek malzeme */
  ingredientId: string;
  /** Yerine geçecek malzeme */
  alternativeId: string;
  /** 1 birim yerine kaç birim (IngredientAlternative.ratio) */
  ratio: number;
};

/** Porsiyon ölçekleme: mutfakta anlamlı hassasiyete yuvarlar. */
export function scaleQuantity(
  quantity: number,
  baseServings: number,
  targetServings: number
): number {
  if (baseServings <= 0 || targetServings <= 0) {
    throw new RangeError("Servings must be positive");
  }
  const scaled = (quantity * targetServings) / baseServings;
  return roundKitchen(scaled);
}

/** Mutfak yuvarlaması: <1 → 2 ondalık, <10 → 1 ondalık, ≥10 → tam sayı. */
export function roundKitchen(value: number): number {
  if (value < 1) return Math.round(value * 100) / 100;
  if (value < 10) return Math.round(value * 10) / 10;
  return Math.round(value);
}

/**
 * Porsiyon + alternatif ikamelerini birlikte uygular.
 * İkame edilen malzemenin miktarı ratio ile çarpılır, kimliği alternatifle değişir.
 */
export function recalculateIngredients(
  ingredients: ScalableIngredient[],
  baseServings: number,
  targetServings: number,
  substitutions: Substitution[] = []
): ScalableIngredient[] {
  const subMap = new Map(substitutions.map((s) => [s.ingredientId, s]));

  return ingredients.map((item) => {
    const sub = subMap.get(item.ingredientId);
    const effectiveQty = sub ? item.quantity * sub.ratio : item.quantity;
    return {
      ...item,
      ingredientId: sub ? sub.alternativeId : item.ingredientId,
      quantity: scaleQuantity(effectiveQty, baseServings, targetServings),
    };
  });
}
