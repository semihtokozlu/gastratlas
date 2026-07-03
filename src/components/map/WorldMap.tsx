"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "@/i18n/navigation";
import type { RecipeGeoPoint } from "@/features/recipes/queries";

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:14px;height:14px;border-radius:9999px;background:#6E1F2E;border:2px solid #FAF6EE;box-shadow:0 1px 2px rgb(0 0 0 / .3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export function WorldMap({ points }: { points: RecipeGeoPoint[] }) {
  return (
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
      {points.map((p) => (
        <Marker key={p.slug} position={[p.latitude, p.longitude]} icon={markerIcon}>
          <Popup>
            <Link href={`/recipes/${p.slug}`} className="font-medium text-primary underline">
              {p.title}
            </Link>
            <div className="text-xs text-ink-muted">{p.countryName}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
