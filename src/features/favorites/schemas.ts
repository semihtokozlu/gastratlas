import { z } from "zod";

export const toggleFavoriteSchema = z.object({
  recipeId: z.string().cuid(),
});
