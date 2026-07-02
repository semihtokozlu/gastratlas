import { useTranslations } from "next-intl";

export function StepList({
  steps,
}: {
  steps: { id: string; sortOrder: number; durationMinutes: number | null; title: string | null; content: string }[];
}) {
  const t = useTranslations("recipe");

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("stepsTitle")}
      </h2>
      <ol className="space-y-6">
        {steps.map((step, idx) => (
          <li key={step.id} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-bg">
              {idx + 1}
            </span>
            <div>
              {step.title && <p className="font-medium text-ink">{step.title}</p>}
              <p className="mt-1 text-ink-muted">{step.content}</p>
              {step.durationMinutes != null && (
                <p className="mt-1 text-xs uppercase tracking-wide text-accent">
                  {step.durationMinutes} {t("minutesAbbr")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
