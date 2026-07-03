"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createSupabaseBrowser();
    const callbackUrl = new URL(`${window.location.origin}/${locale}/auth/callback`);
    if (next) callbackUrl.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl.toString() },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="container flex min-h-[60vh] max-w-md flex-col justify-center py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("loginTitle")}
      </h1>
      <p className="mt-3 text-ink-muted">{t("loginSubtitle")}</p>

      {status === "sent" ? (
        <p className="mt-8 text-ink">{t("checkEmail")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-md border border-line bg-bg px-4 py-2.5 text-ink"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark disabled:opacity-60"
          >
            {status === "sending" ? t("sending") : t("sendLink")}
          </button>
          {status === "error" && <p className="text-sm text-red-600">{t("error")}</p>}
        </form>
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
