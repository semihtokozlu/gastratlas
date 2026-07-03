"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ShareBar({ title, url }: { title: string; url: string }) {
  const t = useTranslations("recipe");
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API erişilemez olabilir — sessizce yok say
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-wide text-ink-muted">
      <span>{t("share")}:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-ink"
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-ink"
      >
        WhatsApp
      </a>
      <button onClick={copyLink} className="hover:text-ink">
        {copied ? t("linkCopied") : t("copyLink")}
      </button>
    </div>
  );
}
