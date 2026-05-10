"use client";

import dynamic from "next/dynamic";
import { type CityPoint } from "./DynamicMap";

// Export the type so other files can still import it
export type { CityPoint };

// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-1 min-h-[400px]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-text"></div>
    </div>
  ),
});

export function CameroonMap({
  points,
  selectedCityId,
  onSelectCity,
}: {
  points: CityPoint[];
  selectedCityId?: string | null;
  onSelectCity?: (cityId: string) => void;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-surface-1 min-h-[400px] md:min-h-full">
      <DynamicMap
        points={points}
        selectedCityId={selectedCityId}
        onSelectCity={onSelectCity}
      />
    </div>
  );
}
