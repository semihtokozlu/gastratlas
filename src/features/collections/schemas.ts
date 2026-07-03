import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

export const updateCollectionSchema = z.object({
  collectionId: z.string().cuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean(),
});

export const deleteCollectionSchema = z.object({
  collectionId: z.string().cuid(),
});

export const collectionRecipeSchema = z.object({
  collectionId: z.string().cuid(),
  recipeId: z.string().cuid(),
});
