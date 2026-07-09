import { z } from "zod";

const chatTurnSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().min(1).max(2000),
});

export const askChefAssistantSchema = z.object({
  recipeId: z.string().cuid(),
  locale: z.enum(["tr", "en"]),
  history: z.array(chatTurnSchema).max(20),
});
