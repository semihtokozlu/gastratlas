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

// Bizans için mor: Bizans imparatorluk moru (Tyrian purple) tarihi bir
// referans — sıcak bordo/bakır paletinden bilinçli olarak ayrışır.
const EMPIRE_COLORS: Record<string, string> = {
  "Ottoman Empire": "#6E1F2E",
  "Safavid Empire": "#B4652D",
  "Byzantine Empire": "#5C3566",
};

const EMPIRE_I18N_KEYS: Record<string, string> = {
  "Ottoman Empire": "empireOttoman",
  "Safavid Empire": "empireSafavid",
  "Byzantine Empire": "empireByzantine",
};

/** Bant rengi, çevrilmiş dönem adının kırılgan string eşleşmesi yerine
 * yıl aralığına göre belirlenir (bkz. Era modeli: Bizans 330-1453,
 * Osmanlı Klasik 1453-1600, Safevi 1501-1736). */
function empireKeyForYearRange(startYear: number): string {
  if (startYear < 1453) return "Byzantine Empire";
  if (startYear >= 1501) return "Safavid Empire";
  return "Ottoman Empire";
}

function borderStyle(feature?: Feature): PathOptions {
  const color = EMPIRE_COLORS[(feature?.properties as { name?: string } | undefined)?.name ?? ""] ?? "#6B6660";
  // smoothFactor Leaflet'te gerçekten desteklenir (Polygon/Polyline
  // render'ında kullanılır) ama @types/leaflet'in StyleFunction dönüş tipi
  // yalnızca PathOptions'ı tanır — bu yüzden cast gerekiyor.
  return {
    color,
    weight: 1.25,
    opacity: 0.5,
    fillColor: color,
    fillOpacity: 0.14,
    lineJoin: "round",
    lineCap: "round",
    smoothFactor: 3,
  } as PathOptions;
}

const DOT_ICON = L.divIcon({
  className: "",
  html: '<div style="width:14px;height:14px;border-radius:9999px;background:#6E1F2E;border:2px solid #FAF6EE;box-shadow:0 1px 3px rgb(43 42 40 / .35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function thumbnailIcon(imageUrl: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="map-thumb" style="background-image:url('${imageUrl}')"></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

export function WorldMap({ points }: { points: RecipeGeoPoint[] }) {
  const t = useTranslations("mapPage");

  const { minYear, maxYear, eraBands } = useMemo(() => {
    const seen = new Map<string, { name: string; start: number; end: number }>();
    for (const p of points) {
      if (p.eraStartYear !== null && p.eraEndYear !== null && p.eraName) {
        seen.set(p.eraName, { name: p.eraName, start: p.eraStartYear, end: p.eraEndYear });
      }
    }
    const bands = [...seen.values()].sort((a, b) => a.start - b.start);
    const starts = bands.map((b) => b.start);
    const ends = bands.map((b) => b.end);
    return {
      minYear: starts.length > 0 ? Math.min(...starts) : 0,
      maxYear: ends.length > 0 ? Math.max(...ends) : 2000,
      eraBands: bands,
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
  const activeEmpires = borderData
    ? [...new Set(borderData.features.map((f) => (f.properties as { name?: string }).name).filter((n): n is string => !!n))]
    : [];

  const yearSpan = Math.max(maxYear - minYear, 1);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface/40 shadow-card">
      <div className="border-b border-line bg-bg p-5">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedYear ?? maxYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="min-w-[220px] flex-1 accent-primary"
            aria-label={t("yearLabel", { year: selectedYear ?? maxYear })}
          />
          <span className="whitespace-nowrap font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
            {selectedYear === null ? t("allPeriods") : selectedYear}
          </span>
          {selectedYear !== null && (
            <button onClick={() => setSelectedYear(null)} className="whitespace-nowrap text-sm text-primary underline">
              {t("showAll")}
            </button>
          )}
        </div>

        {/* Dönem bantları — kaydırıcının altında hangi yılın hangi döneme denk geldiğini gösterir */}
        <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-line/60">
          {eraBands.map((band) => (
            <div
              key={band.name}
              className="absolute inset-y-0"
              style={{
                left: `${((band.start - minYear) / yearSpan) * 100}%`,
                width: `${((band.end - band.start) / yearSpan) * 100}%`,
                background: EMPIRE_COLORS[empireKeyForYearRange(band.start)],
                opacity: 0.55,
              }}
              title={`${band.name} (${band.start}–${band.end})`}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>

      {visiblePoints.length === 0 && <p className="px-5 pt-4 text-sm text-ink-muted">{t("noResultsForYear")}</p>}

      <div className="relative">
        <MapContainer center={[38, 25]} zoom={4} scrollWheelZoom={false} style={{ height: "600px", width: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
              <Popup className="map-popup">
                <Link href={`/recipes/${p.slug}`} className="font-serif text-ink hover:text-primary" style={{ fontSize: "1.05rem" }}>
                  {p.title}
                </Link>
                <div className="mt-1 text-xs uppercase tracking-[0.1em] text-accent">
                  {p.countryName}
                  {p.eraName ? ` · ${p.eraName}` : ""}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {activeEmpires.length > 0 && (
          <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5 rounded-lg border border-line bg-bg/90 px-3 py-2 text-xs shadow-card backdrop-blur-sm">
            {activeEmpires.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: EMPIRE_COLORS[name] }}
                />
                <span className="text-ink-muted">{EMPIRE_I18N_KEYS[name] ? t(EMPIRE_I18N_KEYS[name]) : name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
