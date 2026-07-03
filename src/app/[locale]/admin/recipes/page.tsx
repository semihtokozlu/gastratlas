import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminRecipeList } from "@/features/admin/queries";
import { getSessionUser } from "@/lib/auth/guards";
import { StatusControls } from "@/components/admin/StatusControls";

export default async function AdminRecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const [recipes, user] = await Promise.all([getAdminRecipeList(locale), getSessionUser()]);
  const canPublish = user?.role === "HISTORIAN" || user?.role === "ADMIN";

  return (
    <div>
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("recipesTitle")}
      </h1>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">Recipe</th>
              <th className="px-4 py-3">{t("countryColumn")}</th>
              <th className="px-4 py-3">{t("statusColumn")}</th>
              <th className="px-4 py-3">{t("updatedColumn")}</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{r.title}</td>
                <td className="px-4 py-3 text-ink-muted">{r.countryName}</td>
                <td className="px-4 py-3">
                  <StatusControls recipeId={r.id} initialStatus={r.status} canPublish={canPublish} />
                </td>
                <td className="px-4 py-3 text-ink-muted">{r.updatedAt.toLocaleDateString(locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
