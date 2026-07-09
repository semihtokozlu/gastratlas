import { GoogleGenAI } from "@google/genai";

/**
 * Sağlayıcı-bağımsız ince adapter katmanı (planlama §"K3 AI sağlayıcı" —
 * "Anthropic API birincil, sağlayıcı-bağımsız adapter katmanı"). Şu an
 * Gemini'nin ücretsiz katmanını kullanıyoruz; çağıran kod (features/ai-recipes)
 * bu fonksiyonun imzasına bağımlı, doğrudan Gemini SDK'sına değil — ileride
 * Anthropic'e veya başka bir sağlayıcıya geçmek yalnızca bu dosyayı değiştirmeyi
 * gerektirir.
 */

export const RECIPE_DRAFT_MODEL = "gemini-2.5-flash";
export const CHEF_CHAT_MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY tanımlı değil");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export async function generateStructuredContent(params: {
  model: string;
  systemInstruction: string;
  prompt: string;
  jsonSchema: unknown;
}): Promise<{ data: unknown; inputTokens: number; outputTokens: number }> {
  const response = await getClient().models.generateContent({
    model: params.model,
    contents: params.prompt,
    config: {
      systemInstruction: params.systemInstruction,
      responseMimeType: "application/json",
      responseJsonSchema: params.jsonSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("AI yanıtı boş");

  return {
    data: JSON.parse(text),
    inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
  };
}

export type ChatTurn = { role: "user" | "model"; text: string };

/** Serbest metin, çok turlu (multi-turn) sohbet için — yapılandırılmış JSON zorlaması yok. */
export async function generateTextResponse(params: {
  model: string;
  systemInstruction: string;
  history: ChatTurn[];
}): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const response = await getClient().models.generateContent({
    model: params.model,
    contents: params.history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
    config: {
      systemInstruction: params.systemInstruction,
    },
  });

  const text = response.text;
  if (!text) throw new Error("AI yanıtı boş");

  return {
    text,
    inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
  };
}
