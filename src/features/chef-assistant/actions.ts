"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/guards";
import { generateTextResponse, CHEF_CHAT_MODEL } from "@/lib/ai/textGeneration";
import { askChefAssistantSchema } from "./schemas";
import type { ActionResult } from "@/features/recipes/schemas";

const SYSTEM_TEMPLATE = {
  tr: (recipeContext: string) => `Sen GastrAtlas sitesindeki bir tarif sayfasında kullanıcılara yardımcı olan bir şef asistanısın.

Aşağıda kullanıcının şu anda baktığı tarifin tam içeriği var. Sorularını YALNIZCA bu tarifle ilgili konularda cevapla: malzeme alternatifleri, pişirme teknikleri, porsiyon ayarlama, saklama, olası hatalar. Tarifle ilgisiz bir soru sorulursa (ör. genel sohbet, alakasız konular), nazikçe bu tarif hakkında yardımcı olabileceğini belirt.

Tarihsel köken/icat iddialarında temkinli ol; kesin iddialar yerine "rivayete göre" gibi ifadeler kullan. Kısa ve pratik cevaplar ver. Türkçe cevap ver.

--- TARİF ---
${recipeContext}
--- TARİF SONU ---`,
  en: (recipeContext: string) => `You are a chef assistant helping users on a recipe page on the GastrAtlas site.

Below is the full content of the recipe the user is currently viewing. Answer questions ONLY about this recipe: ingredient substitutions, cooking techniques, adjusting portions, storage, common mistakes. If asked something unrelated to this recipe (general chat, off-topic subjects), politely note you can only help with this recipe.

Be cautious about historical origin/invention claims; use hedged language like "according to lore" rather than definitive claims. Keep answers short and practical. Answer in English.

--- RECIPE ---
${recipeContext}
--- END RECIPE ---`,
};

async function buildRecipeContext(recipeId: string, locale: "tr" | "en"): Promise<string | null> {
  const recipe = await db.recipe.findFirst({
    where: { id: recipeId, status: "PUBLISHED" },
    include: {
      translations: { where: { locale: { in: [locale, "tr"] } } },
      ingredients: {
        orderBy: { sortOrder: "asc" },
        include: { ingredient: { include: { translations: { where: { locale: { in: [locale, "tr"] } } } } } },
      },
      steps: { orderBy: { sortOrder: "asc" }, include: { translations: { where: { locale: { in: [locale, "tr"] } } } } },
    },
  });
  if (!recipe) return null;

  const t = recipe.translations.find((tr) => tr.locale === locale) ?? recipe.translations[0];
  if (!t) return null;

  const ingredientLines = recipe.ingredients.map((i) => {
    const name = i.ingredient.translations.find((tr) => tr.locale === locale)?.name ?? i.ingredient.translations[0]?.name ?? "";
    return `- ${i.quantity.toString()} ${i.unit} ${name}${i.note ? ` (${i.note})` : ""}`;
  });

  const stepLines = recipe.steps.map((s, idx) => {
    const st = s.translations.find((tr) => tr.locale === locale) ?? s.translations[0];
    return `${idx + 1}. ${st?.content ?? ""}`;
  });

  return [
    `Başlık / Title: ${t.title}`,
    `Özet / Summary: ${t.summary}`,
    `Porsiyon / Servings: ${recipe.servings}`,
    `Zorluk / Difficulty: ${recipe.difficulty}`,
    `Hazırlık+Pişirme / Prep+Cook: ${recipe.prepMinutes}+${recipe.cookMinutes} dk/min`,
    `Malzemeler / Ingredients:`,
    ...ingredientLines,
    `Adımlar / Steps:`,
    ...stepLines,
  ].join("\n");
}

/** Client component'in (ChefAssistant) mount'ta çağırdığı salt-okunur wrapper. */
export async function getChefAssistantAuthState(): Promise<{ isAuthenticated: boolean }> {
  const user = await getSessionUser();
  return { isAuthenticated: !!user };
}

/**
 * AI Şef Asistanı — USER+ (giriş yapmış kullanıcılar). Yalnızca üzerinde
 * bulunulan tarifin gerçek içeriğiyle sınırlı (sunucu tarafında yeniden
 * çekilir, client'ın iddia ettiği içeriğe güvenilmez). Her değişim
 * AIJob (type CHEF_CHAT) ile izlenir.
 */
export async function askChefAssistant(input: unknown): Promise<ActionResult<{ answer: string }>> {
  const parsed = askChefAssistantSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Şef asistanını kullanmak için giriş yapmalısınız" } };
  }

  const { recipeId, locale, history } = parsed.data;
  if (history.length === 0 || history[history.length - 1]?.role !== "user") {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz sohbet geçmişi" } };
  }

  const recipeContext = await buildRecipeContext(recipeId, locale);
  if (!recipeContext) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
  }

  const promptHistory = await db.promptHistory.upsert({
    where: { name_version: { name: "chef-assistant-chat", version: 1 } },
    create: {
      name: "chef-assistant-chat",
      version: 1,
      template: SYSTEM_TEMPLATE.tr("{{RECIPE_CONTEXT}}"),
      model: CHEF_CHAT_MODEL,
    },
    update: {},
  });

  const aiJob = await db.aIJob.create({
    data: {
      type: "CHEF_CHAT",
      status: "RUNNING",
      promptHistoryId: promptHistory.id,
      entityType: "Recipe",
      entityId: recipeId,
      createdById: user.id,
    },
  });

  // Son 10 turu gönder — token maliyetini sınırlamak için sohbet geçmişini kırpar.
  const trimmedHistory = history.slice(-10);

  try {
    const response = await generateTextResponse({
      model: CHEF_CHAT_MODEL,
      systemInstruction: SYSTEM_TEMPLATE[locale](recipeContext),
      history: trimmedHistory,
    });

    await db.aIJob.update({
      where: { id: aiJob.id },
      data: {
        status: "DONE",
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        result: { answer: response.text },
        completedAt: new Date(),
      },
    });

    return { ok: true, data: { answer: response.text } };
  } catch (e) {
    await db.aIJob.update({
      where: { id: aiJob.id },
      data: { status: "FAILED", error: e instanceof Error ? e.message : "Bilinmeyen hata", completedAt: new Date() },
    });
    return { ok: false, error: { code: "AI_ERROR", message: "Şef asistanı şu anda cevap veremedi, tekrar deneyin" } };
  }
}
