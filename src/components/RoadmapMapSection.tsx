"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { CameroonMap, type CityPoint } from "@/components/CameroonMap";

export function RoadmapMapSection({
  points,
  selectedCityId,
}: {
  points: CityPoint[];
  selectedCityId?: string | null;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const selected = useMemo(
    () => points.find((p) => p.id === selectedCityId) ?? null,
    [points, selectedCityId],
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-[400px]">
        <CameroonMap
          points={points}
          selectedCityId={selectedCityId}
          onSelectCity={(id) => {
            router.replace(
              { pathname, query: { city: id } },
              { scroll: false },
            );
          }}
        />
      </div>
      {selected ? (
        <div className="mt-3 text-xs text-text-2 px-1">
          {t("roadmap.selectedCityLabel")}{" "}
          <span className="text-text font-medium">{selected.name}</span>
        </div>
      ) : null}
    </div>
  );
}

