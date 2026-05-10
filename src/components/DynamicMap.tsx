"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";

export type CityPoint = {
  id: string;
  name: string;
  region: string;
  kind: "active" | "target";
  members?: number;
  events?: number;
};

type LonLat = readonly [number, number];
type RegionId =
  | "adamawa"
  | "centre"
  | "east"
  | "farNorth"
  | "littoral"
  | "north"
  | "northWest"
  | "west"
  | "south"
  | "southWest";

const CITY_COORDINATES: Record<string, LonLat> = {
  yaounde: [11.5021, 3.848],
  douala: [9.7043, 4.0511],
  buea: [9.2319, 4.1534],
  bamenda: [10.1591, 5.9631],
  bafoussam: [10.4176, 5.4778],
  garoua: [13.3943, 9.3014],
  maroua: [14.3227, 10.591],
  ngaoundere: [13.5833, 7.3167],
  bertoua: [13.6833, 4.5833],
  ebolowa: [11.15, 2.9167],
};

const REGION_DEFINITIONS: ReadonlyArray<{ id: RegionId; regionFr: string; coordinate: LonLat }> = [
  { id: "farNorth", regionFr: "Extrême-Nord", coordinate: [14.3227, 10.591] },
  { id: "north", regionFr: "Nord", coordinate: [13.3943, 9.3014] },
  { id: "adamawa", regionFr: "Adamaoua", coordinate: [13.5833, 7.3167] },
  { id: "northWest", regionFr: "Nord-Ouest", coordinate: [10.1591, 5.9631] },
  { id: "west", regionFr: "Ouest", coordinate: [10.4176, 5.4778] },
  { id: "littoral", regionFr: "Littoral", coordinate: [9.7043, 4.0511] },
  { id: "southWest", regionFr: "Sud-Ouest", coordinate: [9.2319, 4.1534] },
  { id: "centre", regionFr: "Centre", coordinate: [11.5021, 3.848] },
  { id: "east", regionFr: "Est", coordinate: [13.6833, 4.5833] },
  { id: "south", regionFr: "Sud", coordinate: [11.15, 2.9167] },
];

const activeIcon = new L.DivIcon({
  html: `<div style="background-color: var(--cursor-text); width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid var(--cursor-bg); box-shadow: 0 0 0 1px var(--cursor-border);"></div>`,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const targetIcon = new L.DivIcon({
  html: `<div style="background-color: transparent; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--cursor-text-2);"></div>`,
  className: "",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

function MapController({ selectedCityId }: { selectedCityId?: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCityId && CITY_COORDINATES[selectedCityId]) {
      const [lon, lat] = CITY_COORDINATES[selectedCityId];
      map.flyTo([lat, lon], 7, { animate: true, duration: 1.5 });
    }
  }, [selectedCityId, map]);

  return null;
}

export default function DynamicMap({
  points,
  selectedCityId,
  onSelectCity,
}: {
  points: CityPoint[];
  selectedCityId?: string | null;
  onSelectCity?: (cityId: string) => void;
}) {
  const t = useTranslations();
  
  // Create an array of markers that include all regions and active cities
  const allMarkers = REGION_DEFINITIONS.map(region => {
    const cityPoint = points.find(p => p.region === region.regionFr);
    
    // If the region has an active event, use the city point data
    if (cityPoint && cityPoint.kind === "active") {
      const coordinate = CITY_COORDINATES[cityPoint.id] || region.coordinate;
      return {
        id: cityPoint.id,
        name: cityPoint.name,
        region: cityPoint.region,
        lat: coordinate[1],
        lon: coordinate[0],
        kind: "active",
        events: cityPoint.events,
        members: cityPoint.members
      };
    }
    
    // Otherwise, mark it as target region
    return {
      id: region.id,
      name: region.regionFr,
      region: region.regionFr,
      lat: region.coordinate[1],
      lon: region.coordinate[0],
      kind: "target",
      events: 0,
      members: 0
    };
  });

  return (
    <MapContainer
      center={[6.5, 12.5]} // Center of Cameroon
      zoom={5.5}
      zoomControl={false} // Disable default zoom control to position it elsewhere if needed
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", background: "#000000" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {allMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lon]}
          icon={marker.kind === "active" ? activeIcon : targetIcon}
          eventHandlers={{
            click: () => {
              if (onSelectCity && marker.kind === "active") {
                onSelectCity(marker.id);
              }
            },
          }}
        >
          <Tooltip 
            direction="top" 
            offset={[0, -8]} 
            opacity={1}
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-[13px]">{marker.name}</span>
              {marker.kind === "active" ? (
                <span className="text-[11px] opacity-80">
                  {t("map.eventsCount", { count: marker.events ?? 0 })} · {t("map.membersCount", { count: marker.members ?? 0 })}
                </span>
              ) : (
                <span className="text-[11px] opacity-80">{t("map.statusTarget")}</span>
              )}
            </div>
          </Tooltip>
        </Marker>
      ))}

      <MapController selectedCityId={selectedCityId} />
    </MapContainer>
  );
}
