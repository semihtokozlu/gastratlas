const USER_AGENT = "GastrAtlas/1.0 (educational culinary history project; https://gastratlas.vercel.app)";
const API_BASE = "https://commons.wikimedia.org/w/api.php";

// Wikimedia'nın LicenseShortName alanı "CC BY-SA 4.0" gibi BOŞLUKLU bir
// format kullanır (tire değil) — karşılaştırmadan önce hem boşluk hem tire
// kaldırılarak normalize edilir (ör. "ccbysa").
const ACCEPTABLE_LICENSE_SUBSTRINGS = ["cc0", "publicdomain", "pdm", "ccbysa", "ccby"];

function normalizeLicense(input: string): string {
  return input.toLowerCase().replace(/[\s-]+/g, "");
}

export type WikimediaImageResult = {
  url: string;
  width: number;
  height: number;
  license: string;
  attributionText: string;
};

type WikimediaSearchResult = { title: string };
type WikimediaImageInfo = {
  url: string;
  width: number;
  height: number;
  extmetadata?: {
    LicenseShortName?: { value: string };
    Artist?: { value: string };
  };
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "").trim();
}

async function fetchJson(url: URL): Promise<unknown> {
  const res = await fetch(url.toString(), { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Wikimedia API hatası (${res.status})`);
  return res.json();
}

/**
 * Wikimedia Commons'ta verilen sorgu için CC0/CC-BY/CC-BY-SA/kamu malı
 * lisanslı, yeterli çözünürlükte (>=800x600) bir görsel arar. Bulamazsa
 * null döner — bu best-effort bir özelliktir, tarif oluşturmayı bloklamaz.
 */
export async function searchWikimediaImage(query: string): Promise<WikimediaImageResult | null> {
  const searchUrl = new URL(API_BASE);
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", `${query} filetype:bitmap`);
  searchUrl.searchParams.set("srnamespace", "6");
  searchUrl.searchParams.set("srlimit", "10");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("origin", "*");

  let searchResults: WikimediaSearchResult[];
  try {
    const searchData = (await fetchJson(searchUrl)) as { query?: { search?: WikimediaSearchResult[] } };
    searchResults = searchData.query?.search ?? [];
  } catch {
    return null;
  }
  if (searchResults.length === 0) return null;

  for (const result of searchResults) {
    const infoUrl = new URL(API_BASE);
    infoUrl.searchParams.set("action", "query");
    infoUrl.searchParams.set("titles", result.title);
    infoUrl.searchParams.set("prop", "imageinfo");
    infoUrl.searchParams.set("iiprop", "url|size|extmetadata");
    infoUrl.searchParams.set("format", "json");
    infoUrl.searchParams.set("origin", "*");

    let imageInfo: WikimediaImageInfo | undefined;
    try {
      const infoData = (await fetchJson(infoUrl)) as {
        query?: { pages?: Record<string, { imageinfo?: WikimediaImageInfo[] }> };
      };
      const pages = infoData.query?.pages ?? {};
      const page = Object.values(pages)[0];
      imageInfo = page?.imageinfo?.[0];
    } catch {
      continue;
    }
    if (!imageInfo) continue;

    if (imageInfo.width < 800 || imageInfo.height < 600) continue;

    const licenseShort = normalizeLicense(imageInfo.extmetadata?.LicenseShortName?.value ?? "");
    const isAcceptable = ACCEPTABLE_LICENSE_SUBSTRINGS.some((l) => licenseShort.includes(l));
    if (!isAcceptable) continue;

    const artist = imageInfo.extmetadata?.Artist?.value ? stripHtml(imageInfo.extmetadata.Artist.value) : null;
    const licenseLabel = imageInfo.extmetadata?.LicenseShortName?.value ?? "Wikimedia Commons";

    return {
      url: imageInfo.url,
      width: imageInfo.width,
      height: imageInfo.height,
      license: licenseLabel,
      attributionText: artist ? `${artist} — Wikimedia Commons, ${licenseLabel}` : `Wikimedia Commons, ${licenseLabel}`,
    };
  }

  return null;
}
