"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { askChefAssistant, getChefAssistantAuthState } from "@/features/chef-assistant/actions";

type Turn = { role: "user" | "model"; text: string };

export function ChefAssistant({ recipeId }: { recipeId: string }) {
  const t = useTranslations("chefAssistant");
  const locale = useLocale() as "tr" | "en";
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getChefAssistantAuthState().then((res) => {
      if (!cancelled) setIsAuthenticated(res.isAuthenticated);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || sending) return;

    const nextTurns: Turn[] = [...turns, { role: "user", text: question.trim() }];
    setTurns(nextTurns);
    setQuestion("");
    setSending(true);
    setError(null);

    const res = await askChefAssistant({ recipeId, locale, history: nextTurns });
    setSending(false);

    if (res.ok) {
      setTurns((prev) => [...prev, { role: "model", text: res.data.answer }]);
    } else {
      setError(res.error.message || t("error"));
    }
  }

  return (
    <section className="mb-12 rounded-lg border border-line p-5">
      <h2 className="mb-1 font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
        {t("title")}
      </h2>

      {isAuthenticated === null ? (
        <div className="mt-3 h-16" />
      ) : !isAuthenticated ? (
        <p className="mt-3 text-sm text-ink-muted">
          {t("loginPrompt")}{" "}
          <Link href={`/auth/login?next=${encodeURIComponent(`/${locale}${pathname}`)}`} className="text-primary underline">
            {t("loginLink")}
          </Link>
          .
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-muted">{t("hint")}</p>

          {turns.length > 0 && (
            <div ref={listRef} className="mb-4 max-h-80 space-y-3 overflow-y-auto">
              {turns.map((turn, idx) => (
                <div
                  key={idx}
                  className={`rounded-md px-3 py-2 text-sm ${
                    turn.role === "user" ? "ml-8 bg-primary/10 text-ink" : "mr-8 bg-surface text-ink"
                  }`}
                >
                  {turn.text}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("placeholder")}
              maxLength={2000}
              className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
            />
            <button
              type="submit"
              disabled={sending || !question.trim()}
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
            >
              {sending ? t("sending") : t("send")}
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </>
      )}
    </section>
  );
}
