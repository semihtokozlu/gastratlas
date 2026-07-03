"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { subscribeNewsletter } from "@/features/newsletter/actions";

export function NewsletterBlock() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await subscribeNewsletter({ email, locale });
    if (res.ok) {
      setStatus("done");
      setMessage(res.data.status === "already-subscribed" ? t("alreadySubscribed") : t("success"));
    } else {
      setStatus("error");
      setMessage(res.error.message);
    }
  }

  return (
    <div>
      <p className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
        {t("title")}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{t("subtitle")}</p>

      {status === "done" ? (
        <p className="mt-4 text-sm text-ink">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex max-w-sm gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
          >
            {status === "sending" ? t("submitting") : t("submit")}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </div>
  );
}
