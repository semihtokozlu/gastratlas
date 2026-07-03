import { ImageResponse } from "next/og";
import { getRecipeBySlug } from "@/features/recipes/queries";

const size = { width: 1200, height: 630 };

/** @vercel/og tabanlı dinamik OG görseli (API sözleşmesi §8.2: GET /api/og?type=recipe&slug=...). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale") === "en" ? "en" : "tr";

  let title = "GastrAtlas";
  let subtitle = locale === "tr" ? "Tarihi lezzetle keşfedin" : "Explore history through flavor";

  if (type === "recipe" && slug) {
    const recipe = await getRecipeBySlug(slug, locale);
    if (recipe) {
      title = recipe.title;
      subtitle = recipe.eraName ? `${recipe.countryName} · ${recipe.eraName}` : recipe.countryName;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#FAF6EE",
          color: "#2B2A28",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#B4652D" }}>
          {subtitle}
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 68, fontWeight: 600, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 30, color: "#6E1F2E" }}>GastrAtlas</div>
      </div>
    ),
    { ...size }
  );
}
