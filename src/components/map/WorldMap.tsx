"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L, { type PathOptions } from "leaflet";
import type { Feature } from "geojson";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getPublicImageUrl } from "@/lib/storage/publicUrl";
import type { RecipeGeoPoint } from "@/features/recipes/queries";
import borders1400 from "@/data/historical-borders/1400.json";
import borders1492 from "@/data/historical-borders/1492.json";
import borders1600 from "@/data/historical-borders/1600.json";

/**
 * Kaynak: aourednik/historical-basemaps (GPLv3) — bkz.
 * src/data/historical-borders/README.md. Üç ayrı yıl anlık görüntüsü,
 * sürekli bir zaman serisi değil (kabaca yaklaşıklık).
 */
function bordersForYear(year: number | null) {
  if (year === null) return null;
  if (year < 1453) return borders1400;
  if (year < 1501) return borders1492;
  return borders1600;
}

const EMPIRE_COLORS: Record<string, string> = {
  "Ottoman Empire": "#6E1F2E",
  "Safavid Empire": "#B4652D",
  "Byzantine Empire": "#3D5A6C",
};

function borderStyle(feature?: Feature): PathOptions {
  const color = EMPIRE_COLORS[(feature?.properties as { name?: string } | undefined)?.name ?? ""] ?? "#6B6660";
  return { color, weight: 1.5, fillColor: color, fillOpacity: 0.18 };
}

const DOT_ICON = L.divIcon({
  className: "",
  html: '<div style="width:14px;height:14px;border-radius:9999px;background:#6E1F2E;border:2px solid #FAF6EE;box-shadow:0 1px 2px rgb(0 0 0 / .3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function thumbnailIcon(imageUrl: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:9999px;background-image:url('${imageUrl}');background-size:cover;background-position:center;border:2px solid #FAF6EE;box-shadow:0 1px 3px rgb(0 0 0 / .4)"></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function WorldMap({ points }: { points: RecipeGeoPoint[] }) {
  const t = useTranslations("mapPage");

  const { minYear, maxYear } = useMemo(() => {
    const starts = points.flatMap((p) => (p.eraStartYear !== null ? [p.eraStartYear] : []));
    const ends = points.flatMap((p) => (p.eraEndYear !== null ? [p.eraEndYear] : []));
    return {
      minYear: starts.length > 0 ? Math.min(...starts) : 0,
      maxYear: ends.length > 0 ? Math.max(...ends) : 2000,
    };
  }, [points]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const visiblePoints =
    selectedYear === null
      ? points
      : points.filter(
          (p) => p.eraStartYear !== null && p.eraEndYear !== null && selectedYear >= p.eraStartYear && selectedYear <= p.eraEndYear
        );

  const borderData = bordersForYear(selectedYear);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-4 rounded-lg border border-line p-4">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={selectedYear ?? maxYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="min-w-[200px] flex-1 accent-primary"
        />
        <span className="whitespace-nowrap text-sm text-ink">
          {selectedYear === null ? t("allPeriods") : t("yearLabel", { year: selectedYear })}
        </span>
        {selectedYear !== null && (
          <button onClick={() => setSelectedYear(null)} className="text-sm text-primary underline">
            {t("showAll")}
          </button>
        )}
      </div>

      {visiblePoints.length === 0 && <p className="mb-4 text-sm text-ink-muted">{t("noResultsForYear")}</p>}

      <MapContainer
        center={[38, 25]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {borderData && (
          // key: selectedYear değiştiğinde react-leaflet'in katmanı yeniden
          // oluşturması için (GeoJSON layer'ı `data` prop'unu imperatif
          // olarak izlemez).
          <GeoJSON key={selectedYear} data={borderData as GeoJSON.FeatureCollection} style={borderStyle} />
        )}
        {visiblePoints.map((p) => (
          <Marker
            key={p.slug}
            position={[p.latitude, p.longitude]}
            icon={p.heroImage ? thumbnailIcon(getPublicImageUrl(p.heroImage.storagePath)) : DOT_ICON}
          >
            <Popup>
              <Link href={`/recipes/${p.slug}`} className="font-medium text-primary underline">
                {p.title}
              </Link>
              <div className="text-xs text-ink-muted">
                {p.countryName}
                {p.eraName ? ` · ${p.eraName}` : ""}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
