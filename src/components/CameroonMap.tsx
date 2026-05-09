"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export type CityPoint = {
  id: string;
  name: string;
  region: string;
  x: number; // 0..100
  y: number; // 0..160
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

const MAP_WIDTH = 100;
const MAP_HEIGHT = 148;

// Natural Earth Admin 0 country boundary for Cameroon, public domain.
// Coordinates are [longitude, latitude] and projected into the SVG viewBox.
const CAMEROON_BOUNDARY: LonLat[] = [
  [14.495787387762846, 12.859396267137329],
  [14.89336, 12.21905],
  [14.960151808337599, 11.555574042197224],
  [14.923564894274961, 10.891325181517473],
  [15.467872755605242, 9.982336737503545],
  [14.909353875394716, 9.992129421422732],
  [14.62720055508106, 9.920919297724538],
  [14.171466098699028, 10.021378282099931],
  [13.954218377344006, 9.549494940626687],
  [14.54446658698177, 8.965861314322268],
  [14.97999555833769, 8.796104234243472],
  [15.120865512765306, 8.382150173369439],
  [15.436091749745742, 7.692812404811889],
  [15.279460483469109, 7.421924546737969],
  [14.776545444404576, 6.408498033062045],
  [14.536560092841114, 6.22695872642069],
  [14.459407179429348, 5.4517605656103],
  [14.558935988023507, 5.03059764243153],
  [14.478372430080469, 4.732605495620447],
  [14.950953403389661, 4.210389309094921],
  [15.036219516671252, 3.851367295747124],
  [15.405395948964383, 3.33530060466434],
  [15.862732374747482, 3.013537298998983],
  [15.907380812247652, 2.557389431158612],
  [16.012852410555354, 2.267639675298085],
  [15.940918816805066, 1.727672634280296],
  [15.146341993885244, 1.964014797367184],
  [14.337812534246581, 2.227874660649491],
  [13.075822381246752, 2.267097072759015],
  [12.951333855855609, 2.32161570882694],
  [12.359380323952221, 2.19281220133945],
  [11.75166548019979, 2.326757513839993],
  [11.276449008843713, 2.261050930180872],
  [9.649158155972628, 2.283866075037736],
  [9.795195753629457, 3.073404445809117],
  [9.404366896206, 3.734526882335203],
  [8.948115675501072, 3.904128933117136],
  [8.744923943729418, 4.35221527751996],
  [8.48881554529089, 4.495617377129918],
  [8.500287713259695, 4.771982937026849],
  [8.757532993208628, 5.479665839047911],
  [9.233162876023044, 6.444490668153335],
  [9.522705926154401, 6.453482367372117],
  [10.118276808318257, 7.03876963950988],
  [10.497375115611419, 7.055357774275564],
  [11.058787876030351, 6.644426784690594],
  [11.745774366918511, 6.981382961449754],
  [11.839308709366803, 7.397042344589437],
  [12.063946160539558, 7.799808457872302],
  [12.218872104550599, 8.305824082874324],
  [12.753671502339216, 8.717762762888995],
  [12.955467970438974, 9.417771714714704],
  [13.167599724997103, 9.640626328973411],
  [13.308676385153918, 10.160362046748928],
  [13.572949659894562, 10.798565985553566],
  [14.415378859116684, 11.572368882692075],
  [14.468192172918975, 11.904751695193411],
  [14.577177768622533, 12.085360826053503],
  [14.181336297266794, 12.483656927943116],
  [14.213530714584635, 12.802035427293347],
  [14.495787387762846, 12.859396267137329],
];

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

const LABEL_OFFSETS: Record<string, readonly [number, number]> = {
  yaounde: [3, 5],
  douala: [3, -3],
  buea: [3, 6],
  bamenda: [3, -4],
  bafoussam: [3, 6],
  garoua: [3, -3],
  maroua: [-3, -3],
  ngaoundere: [3, 5],
  bertoua: [-3, -3],
  ebolowa: [3, 6],
};

const bounds = CAMEROON_BOUNDARY.reduce(
  (acc, [lon, lat]) => ({
    minLon: Math.min(acc.minLon, lon),
    maxLon: Math.max(acc.maxLon, lon),
    minLat: Math.min(acc.minLat, lat),
    maxLat: Math.max(acc.maxLat, lat),
  }),
  {
    minLon: Infinity,
    maxLon: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity,
  },
);

const lonSpan = bounds.maxLon - bounds.minLon;
const latSpan = bounds.maxLat - bounds.minLat;
const innerWidth = 92;
const innerHeight = innerWidth * (latSpan / lonSpan);
const offsetX = (MAP_WIDTH - innerWidth) / 2;
const offsetY = (MAP_HEIGHT - innerHeight) / 2;

function project([lon, lat]: LonLat) {
  return {
    x: offsetX + ((lon - bounds.minLon) / lonSpan) * innerWidth,
    y: offsetY + ((bounds.maxLat - lat) / latSpan) * innerHeight,
  };
}

const cameroonPath = CAMEROON_BOUNDARY.map((coordinate, index) => {
  const { x, y } = project(coordinate);
  return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
}).join(" ");

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function CameroonMap({
  points,
  onSelectCity,
}: {
  points: CityPoint[];
  onSelectCity?: (cityId: string) => void;
}) {
  const t = useTranslations();
  const [hovered, setHovered] = useState<CityPoint | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  const regions = useMemo(
    () =>
      REGION_DEFINITIONS.map((region) => {
        const relatedPoints = points.filter((p) => p.region === region.regionFr);
        return {
          ...region,
          covered: relatedPoints.some((p) => p.kind === "active"),
        };
      }),
    [points],
  );

  const coveredRegions = regions.filter((region) => region.covered).length;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-surface-1 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text">{t("map.title")}</p>
          <p className="text-xs text-text-2">
            {t("map.subtitle")}
          </p>
        </div>
        {selected ? (
          <div className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text">
            <span className="font-medium">{selected.name}</span>
            <span className="text-text-2">
              {" "}
              · {t("map.eventsCount", { count: selected.events ?? 0 })} ·{" "}
              {t("map.membersCount", { count: selected.members ?? 0 })}
            </span>
          </div>
        ) : null}
      </div>

      <div className="rounded-md border border-border bg-bg-2 px-3 py-4">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="mx-auto h-auto max-h-[430px] w-full"
          role="img"
          aria-label="Carte du Cameroun avec les 10 régions et les villes de la communauté"
        >
          <g className="origin-center animate-[fadeInUp_900ms_ease-out]">
            <path
              d={`${cameroonPath} Z`}
              fill="var(--cursor-surface-1)"
              stroke="var(--cursor-border)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />

            {regions.map((region) => {
              const position = project(region.coordinate);
              return (
                <g key={region.id}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="1.2"
                    className={region.covered ? "fill-[var(--cursor-text)]" : "fill-[var(--cursor-text-2)]"}
                  />
                  <text
                    x={position.x + 1.8}
                    y={position.y - 1.2}
                    className="pointer-events-none fill-[var(--cursor-text-2)] text-[2.5px]"
                  >
                    {t(`map.regionShort.${region.id}`)}
                  </text>
                </g>
              );
            })}

            {points.map((p) => {
              const coordinate = CITY_COORDINATES[p.id];
              const position = coordinate ? project(coordinate) : { x: p.x, y: p.y };
              const active = p.id === selectedId;
              const covered = p.kind === "active";
              const [dx, dy] = LABEL_OFFSETS[p.id] ?? [3, -3];
              const labelAnchor = dx < 0 ? "end" : "start";
              const labelX = position.x + dx;
              const labelY = position.y + dy;

              return (
                <g key={p.id}>
                  {p.id === "yaounde" ? (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="10"
                      fill="none"
                      stroke="var(--cursor-border)"
                      strokeWidth="0.8"
                      className="animate-[pulseRing_2.8s_ease-out_infinite]"
                    />
                  ) : null}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={active ? 2.6 : covered ? 2.3 : 1.8}
                    className={cx(
                      covered
                        ? "fill-[var(--cursor-text)]"
                        : "fill-[var(--cursor-bg)] stroke-[var(--cursor-text-2)]",
                      "cursor-pointer transition-transform",
                      active && "scale-110",
                    )}
                    strokeWidth={covered ? 0 : 1.2}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered((h) => (h?.id === p.id ? null : h))}
                    onFocus={() => setHovered(p)}
                    onBlur={() => setHovered((h) => (h?.id === p.id ? null : h))}
                    onClick={() => {
                      setSelectedId(p.id);
                      onSelectCity?.(p.id);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${p.name}, ${p.events ?? 0} événement(s)`}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelAnchor}
                    className="pointer-events-none fill-[var(--cursor-text)] text-[3.2px] font-medium"
                  >
                    {p.name}
                  </text>
                  <text
                    x={labelX}
                    y={labelY + 3.8}
                    textAnchor={labelAnchor}
                    className="pointer-events-none fill-[var(--cursor-text-2)] text-[2.6px]"
                  >
                    {p.region}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-text" />
          {t("map.statusCovered")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-text-2 bg-bg" />
          {t("map.statusTarget")}
        </span>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg-2 p-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-text">{t("map.regionsTitle")}</span>
          <span className="text-text-2">
            {t("map.regionsCoverage", { covered: coveredRegions, total: regions.length })}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-text-2 sm:grid-cols-3">
          {regions.map((region) => (
            <span key={region.id} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-1 px-2 py-1">
              <span
                className={cx(
                  "h-1.5 w-1.5 rounded-full",
                  region.covered ? "bg-text" : "border border-text-2 bg-bg",
                )}
              />
              {t(`map.region.${region.id}`)}
            </span>
          ))}
        </div>
      </div>

      {hovered ? (
        <div className="pointer-events-none absolute left-5 top-20 max-w-[calc(100%-2.5rem)] rounded-md border border-border bg-bg px-3 py-2 text-xs text-text shadow-sm">
          <div className="font-medium">{hovered.name}</div>
          <div className="text-text-2">
            {hovered.region} · {t("map.eventsCount", { count: hovered.events ?? 0 })}{" "}
            · {t("map.membersCount", { count: hovered.members ?? 0 })}
          </div>
          <div className="text-text-2">
            {t("map.statusLabel")}{" "}
            {hovered.kind === "active"
              ? t("map.statusCovered")
              : t("map.statusTarget")}
          </div>
        </div>
      ) : null}
    </div>
  );
}
