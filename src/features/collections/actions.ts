"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/guards";
import {
  createCollectionSchema,
  updateCollectionSchema,
  deleteCollectionSchema,
  collectionRecipeSchema,
} from "./schemas";
import { getCollectionsForRecipe, type CollectionPickerItem } from "./queries";
import type { ActionResult } from "@/features/recipes/schemas";

async function requireOwnedCollection(collectionId: string, userId: string) {
  return db.collection.findFirst({ where: { id: collectionId, userId } });
}

/** USER+ — RLS "Collection_owner_write" ile aynı kural. */
export async function createCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Koleksiyon oluşturmak için giriş yapmalısınız" } };
  }

  const collection = await db.collection.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description,
      isPublic: parsed.data.isPublic ?? false,
    },
  });

  return { ok: true, data: { id: collection.id } };
}

export async function updateCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = updateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Giriş yapmalısınız" } };
  }

  const owned = await requireOwnedCollection(parsed.data.collectionId, user.id);
  if (!owned) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Koleksiyon bulunamadı" } };
  }

  await db.collection.update({
    where: { id: parsed.data.collectionId },
    data: { name: parsed.data.name, description: parsed.data.description, isPublic: parsed.data.isPublic },
  });

  return { ok: true, data: { id: parsed.data.collectionId } };
}

export async function deleteCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = deleteCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Giriş yapmalısınız" } };
  }

  const owned = await requireOwnedCollection(parsed.data.collectionId, user.id);
  if (!owned) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Koleksiyon bulunamadı" } };
  }

  await db.collection.delete({ where: { id: parsed.data.collectionId } });
  return { ok: true, data: { id: parsed.data.collectionId } };
}

async function toggleCollectionRecipe(input: unknown, add: boolean): Promise<ActionResult<{ added: boolean }>> {
  const parsed = collectionRecipeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Giriş yapmalısınız" } };
  }

  const owned = await requireOwnedCollection(parsed.data.collectionId, user.id);
  if (!owned) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Koleksiyon bulunamadı" } };
  }

  if (add) {
    const recipe = await db.recipe.findFirst({ where: { id: parsed.data.recipeId, status: "PUBLISHED" } });
    if (!recipe) {
      return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
    }
    await db.collectionRecipe.upsert({
      where: { collectionId_recipeId: { collectionId: parsed.data.collectionId, recipeId: parsed.data.recipeId } },
      create: { collectionId: parsed.data.collectionId, recipeId: parsed.data.recipeId },
      update: {},
    });
  } else {
    await db.collectionRecipe.deleteMany({
      where: { collectionId: parsed.data.collectionId, recipeId: parsed.data.recipeId },
    });
  }

  return { ok: true, data: { added: add } };
}

export async function addRecipeToCollection(input: unknown) {
  return toggleCollectionRecipe(input, true);
}

export async function removeRecipeFromCollection(input: unknown) {
  return toggleCollectionRecipe(input, false);
}

/** Client component'in (AddToCollectionButton) mount'ta çağırdığı salt-okunur wrapper. */
export async function getCollectionPickerData(
  recipeId: string
): Promise<{ isAuthenticated: boolean; collections: CollectionPickerItem[] }> {
  const user = await getSessionUser();
  if (!user) return { isAuthenticated: false, collections: [] };
  const collections = await getCollectionsForRecipe(user.id, recipeId);
  return { isAuthenticated: true, collections };
}
