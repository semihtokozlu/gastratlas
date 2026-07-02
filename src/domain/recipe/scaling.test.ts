import { describe, expect, it } from "vitest";
import {
  recalculateIngredients,
  roundKitchen,
  scaleQuantity,
} from "./scaling";

describe("roundKitchen", () => {
  it("küçük miktarlarda 2 ondalık korur (baharat hassasiyeti)", () => {
    expect(roundKitchen(0.333)).toBe(0.33);
  });
  it("orta miktarlarda 1 ondalık korur", () => {
    expect(roundKitchen(2.66)).toBe(2.7);
  });
  it("büyük miktarları tam sayıya yuvarlar", () => {
    expect(roundKitchen(12.4)).toBe(12);
  });
});

describe("scaleQuantity", () => {
  it("4 porsiyondan 6'ya doğru ölçekler", () => {
    expect(scaleQuantity(200, 4, 6)).toBe(300);
  });
  it("geçersiz porsiyonda hata fırlatır", () => {
    expect(() => scaleQuantity(100, 0, 4)).toThrow(RangeError);
  });
});

describe("recalculateIngredients", () => {
  const base = [
    { ingredientId: "butter", quantity: 100, unit: "G", isOptional: false },
    { ingredientId: "flour", quantity: 250, unit: "G", isOptional: false },
  ];

  it("ikame + porsiyon değişimini birlikte uygular", () => {
    const result = recalculateIngredients(base, 4, 8, [
      { ingredientId: "butter", alternativeId: "olive-oil", ratio: 0.75 },
    ]);
    expect(result[0]).toEqual({
      ingredientId: "olive-oil",
      quantity: 150, // 100 * 0.75 * (8/4)
      unit: "G",
      isOptional: false,
    });
    expect(result[1]?.quantity).toBe(500);
  });

  it("ikame yoksa yalnızca ölçekler", () => {
    const result = recalculateIngredients(base, 4, 2);
    expect(result.map((r) => r.quantity)).toEqual([50, 125]);
  });
});
