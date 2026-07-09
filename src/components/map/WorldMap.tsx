"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, GeoJSON, Polyline, Tooltip } from "react-leaflet";
import L, { type PathOptions } from "leaflet";
import type { Feature } from "geojson";
import "leaflet/dist/leaflet.css";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getPublicImageUrl } from "@/lib/storage/publicUrl";
import type { RecipeGeoPoint } from "@/features/recipes/queries";
import type { TimelineEventData } from "@/features/timeline/queries";
import { EMPIRE_COLORS, EMPIRE_I18N_KEYS, empireKeyForYearRange } from "@/lib/history/empires";
import { REGION_LABELS } from "@/data/map-content/regionLabels";
import { TRADE_ROUTES } from "@/data/map-content/tradeRoutes";
import { INGREDIENT_ORIGINS } from "@/data/map-content/ingredientOrigins";
import { CULINARY_CITIES } from "@/data/map-content/culinaryCities";
import { DISH_CONNECTIONS } from "@/data/map-content/dishConnections";
import borders1400 from "@/data/historical-borders/1400.json";
import borders1492 from "@/data/historical-borders/1492.json";
import borders1600 from "@/data/historical-borders/1600.json";
import landData from "@/data/historical-borders/land.json";

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

const LAND_STYLE: PathOptions = {
  color: "transparent",
  fillColor: "#DDD2B8",
  fillOpacity: 1,
};

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

const REGION_LABEL_ICON = (text: string) =>
  L.divIcon({
    className: "",
    html: `<div class="map-region-label">${text}</div>`,
    iconSize: [0, 0],
  });

const INGREDIENT_ICON = L.divIcon({
  className: "",
  html: '<div class="map-ingredient-marker">🌿</div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const CITY_ICON = L.divIcon({
  className: "",
  html: '<div class="map-city-marker"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const EVENT_ICON = L.divIcon({
  className: "",
  html: '<div class="map-event-marker">★</div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const AUTOPLAY_STEP_YEARS = 8;
const AUTOPLAY_INTERVAL_MS = 220;
/** Bir tarihi olay, seçili yılın bu kadar yıl yakınındaysa haritada
 * belirir — ani kaybolma yerine kaydırıcıyla birlikte doğal bir
 * "yaklaşma/uzaklaşma" hissi verir. */
const EVENT_VISIBILITY_WINDOW_YEARS = 20;

export function WorldMap({ points, timelineEvents }: { points: RecipeGeoPoint[]; timelineEvents: TimelineEventData[] }) {
  const t = useTranslations("mapPage");
  const locale = useLocale();
  const isTr = locale === "tr";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");

  const [layers, setLayers] = useState({
    tradeRoutes: false,
    ingredients: false,
    cities: false,
    connections: false,
  });

  function toggleLayer(key: keyof typeof layers) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    if (!isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      return;
    }
    playIntervalRef.current = setInterval(() => {
      setSelectedYear((current) => {
        const next = (current ?? minYear) + AUTOPLAY_STEP_YEARS;
        if (next >= maxYear) {
          setIsPlaying(false);
          return maxYear;
        }
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, minYear, maxYear]);

  function handlePlayToggle() {
    if (!isPlaying && (selectedYear === null || selectedYear >= maxYear)) {
      setSelectedYear(minYear);
    }
    setIsPlaying((p) => !p);
  }

  const visiblePoints =
    selectedYear === null
      ? points
      : points.filter(
          (p) => p.eraStartYear !== null && p.eraEndYear !== null && selectedYear >= p.eraStartYear && selectedYear <= p.eraEndYear
        );

  const pointsBySlug = useMemo(() => new Map(points.map((p) => [p.slug, p])), [points]);

  const visibleEvents = timelineEvents.filter(
    (ev) =>
      ev.latitude !== null &&
      ev.longitude !== null &&
      (selectedYear === null || Math.abs(ev.year - selectedYear) <= EVENT_VISIBILITY_WINDOW_YEARS)
  );

  const borderData = bordersForYear(selectedYear);
  const activeEmpires = borderData
    ? [...new Set(borderData.features.map((f) => (f.properties as { name?: string }).name).filter((n): n is string => !!n))]
    : [];

  const yearSpan = Math.max(maxYear - minYear, 1);

  // Kaydırırken canlı özet — görünür tarif/ülke/imparatorluk sayısı
  const liveStats = useMemo(() => {
    const countries = new Set(visiblePoints.map((p) => p.countryName));
    return { recipeCount: visiblePoints.length, countryCount: countries.size, empireCount: activeEmpires.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePoints, activeEmpires.length]);

  const searchResults =
    searchQuery.trim().length >= 2
      ? points.filter((p) => p.title.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 6)
      : [];

  function jumpToRecipe(slug: string) {
    const point = pointsBySlug.get(slug);
    if (!point || !mapRef.current) return;
    setIsPlaying(false);
    setSelectedYear(null);
    setSearchQuery("");
    mapRef.current.flyTo([point.latitude, point.longitude], 6, { duration: 0.8 });
    // Popup'ı hemen açmaya çalışırsak flyTo animasyonu tamamlanmadan marker
    // henüz doğru konumda olmayabilir — kısa bir gecikme ile açıyoruz.
    setTimeout(() => {
      markerRefs.current.get(slug)?.openPopup();
    }, 850);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface/40 shadow-card">
      <div className="border-b border-line bg-bg p-5">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handlePlayToggle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-bg"
            aria-label={isPlaying ? t("pause") : t("play")}
            title={isPlaying ? t("pause") : t("play")}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedYear ?? maxYear}
            onChange={(e) => {
              setIsPlaying(false);
              setSelectedYear(Number(e.target.value));
            }}
            className="min-w-[180px] flex-1 accent-primary"
            aria-label={t("yearLabel", { year: selectedYear ?? maxYear })}
          />
          <span className="whitespace-nowrap font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
            {selectedYear === null ? t("allPeriods") : selectedYear}
          </span>
          {selectedYear !== null && (
            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedYear(null);
              }}
              className="whitespace-nowrap text-sm text-primary underline"
            >
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

        {/* Kaydırırken canlı özet */}
        <p className="mt-2 text-xs text-ink-muted">
          {t("liveStats", {
            recipes: liveStats.recipeCount,
            countries: liveStats.countryCount,
            empires: liveStats.empireCount,
          })}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Katman anahtarları — varsayılan kapalı, harita ilk bakışta sade kalsın */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["tradeRoutes", t("layerTradeRoutes")],
                ["ingredients", t("layerIngredients")],
                ["cities", t("layerCities")],
                ["connections", t("layerConnections")],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  layers[key]
                    ? "border-primary bg-primary text-bg"
                    : "border-line text-ink-muted hover:border-primary hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tarif arama/git */}
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-48 rounded-full border border-line bg-bg px-3 py-1 text-xs text-ink placeholder:text-ink-muted"
            />
            {searchResults.length > 0 && (
              <ul className="absolute right-0 top-full z-[1100] mt-1 w-56 overflow-hidden rounded-lg border border-line bg-bg shadow-card">
                {searchResults.map((r) => (
                  <li key={r.slug}>
                    <button
                      onClick={() => jumpToRecipe(r.slug)}
                      className="block w-full px-3 py-2 text-left text-xs text-ink hover:bg-surface"
                    >
                      {r.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {visiblePoints.length === 0 && <p className="px-5 pt-4 text-sm text-ink-muted">{t("noResultsForYear")}</p>}

      <div className="relative">
        <MapContainer
          center={[38, 25]}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height: "600px", width: "100%" }}
          className="map-atlas-canvas"
          attributionControl={false}
          ref={mapRef}
        >
          {/* Modern harita karoları yerine yalnızca kıta silueti — atlas
              plakası hissi (bkz. src/data/historical-borders/README.md). */}
          <GeoJSON data={landData as GeoJSON.FeatureCollection} style={LAND_STYLE} interactive={false} />
          {borderData && (
            // key: selectedYear değiştiğinde react-leaflet'in katmanı yeniden
            // oluşturması için (GeoJSON layer'ı `data` prop'unu imperatif
            // olarak izlemez).
            <GeoJSON key={selectedYear} data={borderData as GeoJSON.FeatureCollection} style={borderStyle} />
          )}

          {REGION_LABELS.map((label) => (
            <Marker
              key={label.slug}
              position={[label.lat, label.lng]}
              icon={REGION_LABEL_ICON(isTr ? label.nameTr : label.nameEn)}
              interactive={false}
            />
          ))}

          {layers.tradeRoutes &&
            TRADE_ROUTES.map((route) => {
              const isActiveNow =
                selectedYear === null || (selectedYear >= route.activeFrom && selectedYear <= route.activeUntil);
              return (
                <Polyline
                  key={route.slug}
                  positions={route.path}
                  pathOptions={{ color: route.color, weight: 2, opacity: isActiveNow ? 0.75 : 0.18, dashArray: "6 8" }}
                >
                  <Tooltip sticky className="map-route-tooltip">
                    <strong>{isTr ? route.nameTr : route.nameEn}</strong>
                  </Tooltip>
                  <Popup className="map-popup">
                    <p className="font-serif text-ink" style={{ fontSize: "1.05rem" }}>
                      {isTr ? route.nameTr : route.nameEn}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{isTr ? route.noteTr : route.noteEn}</p>
                  </Popup>
                </Polyline>
              );
            })}

          {layers.connections &&
            DISH_CONNECTIONS.map((conn) => {
              const a = pointsBySlug.get(conn.slugA);
              const b = pointsBySlug.get(conn.slugB);
              if (!a || !b) return null;
              return (
                <Polyline
                  key={`${conn.slugA}-${conn.slugB}`}
                  positions={[
                    [a.latitude, a.longitude],
                    [b.latitude, b.longitude],
                  ]}
                  pathOptions={{ color: "#C9A227", weight: 1.5, opacity: 0.65, dashArray: "2 6" }}
                >
                  <Tooltip sticky className="map-route-tooltip">
                    {isTr ? conn.labelTr : conn.labelEn}
                  </Tooltip>
                </Polyline>
              );
            })}

          {layers.ingredients &&
            INGREDIENT_ORIGINS.map((ing) => (
              <Marker key={ing.ingredientSlug} position={[ing.lat, ing.lng]} icon={INGREDIENT_ICON}>
                <Popup className="map-popup">
                  <p className="font-serif text-ink" style={{ fontSize: "1.05rem" }}>
                    {isTr ? ing.nameTr : ing.nameEn}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-accent">
                    {isTr ? ing.originTr : ing.originEn}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{isTr ? ing.noteTr : ing.noteEn}</p>
                </Popup>
              </Marker>
            ))}

          {layers.cities &&
            CULINARY_CITIES.map((city) => (
              <Marker key={city.slug} position={[city.lat, city.lng]} icon={CITY_ICON}>
                <Popup className="map-popup">
                  <p className="font-serif text-ink" style={{ fontSize: "1.05rem" }}>
                    {isTr ? city.nameTr : city.nameEn}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{isTr ? city.noteTr : city.noteEn}</p>
                </Popup>
              </Marker>
            ))}

          {visibleEvents.map((ev) => (
            <Marker key={ev.slug} position={[ev.latitude as number, ev.longitude as number]} icon={EVENT_ICON}>
              <Popup className="map-popup">
                <p className="text-xs uppercase tracking-[0.1em] text-accent">{ev.year}</p>
                <p className="mt-1 font-serif text-ink" style={{ fontSize: "1.05rem" }}>
                  {ev.title}
                </p>
                {ev.description && <p className="mt-1 text-xs text-ink-muted">{ev.description}</p>}
                {ev.recipeSlug && (
                  <Link href={`/recipes/${ev.recipeSlug}`} className="mt-2 inline-block text-xs text-primary underline">
                    {ev.recipeTitle}
                  </Link>
                )}
              </Popup>
            </Marker>
          ))}

          {visiblePoints.map((p) => (
            <Marker
              key={p.slug}
              position={[p.latitude, p.longitude]}
              icon={p.heroImage ? thumbnailIcon(getPublicImageUrl(p.heroImage.storagePath)) : DOT_ICON}
              ref={(marker) => {
                if (marker) markerRefs.current.set(p.slug, marker);
                else markerRefs.current.delete(p.slug);
              }}
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

        {/* Eskimiş kağıt dokusu + vinyet — tamamen kararlaştırılamayan bir
            atlas plakası hissi; tıklamaları engellemesin diye pointer-events
            kapalı. */}
        <div className="map-atlas-overlay" aria-hidden />

        {/* Pusula gülü — sabit köşe süsü, harita koordinat sistemine değil
            konteynere bağlı. */}
        <div className="map-compass" aria-hidden>
          <svg viewBox="0 0 100 100" width="56" height="56">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#6E1F2E" strokeWidth="1.5" opacity="0.55" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#6E1F2E" strokeWidth="0.75" opacity="0.4" />
            <polygon points="50,8 56,44 50,50 44,44" fill="#6E1F2E" opacity="0.85" />
            <polygon points="50,92 56,56 50,50 44,56" fill="#6E1F2E" opacity="0.5" />
            <polygon points="8,50 44,44 50,50 44,56" fill="#6E1F2E" opacity="0.5" />
            <polygon points="92,50 56,56 50,50 56,44" fill="#6E1F2E" opacity="0.5" />
            <circle cx="50" cy="50" r="3.5" fill="#C9A227" />
            <text x="50" y="21" textAnchor="middle" fontSize="9" fill="#6E1F2E" fontFamily="serif">N</text>
          </svg>
        </div>

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
      <p className="border-t border-line px-5 py-2 text-[11px] text-ink-muted">
        {t("dataCredit")}
      </p>
    </div>
  );
}
