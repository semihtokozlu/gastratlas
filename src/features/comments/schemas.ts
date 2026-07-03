import { z } from "zod";

export const submitCommentSchema = z.object({
  recipeId: z.string().cuid(),
  content: z.string().min(1).max(2000),
});
