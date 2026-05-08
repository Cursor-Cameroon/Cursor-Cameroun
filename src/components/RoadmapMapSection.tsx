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
    <div className="flex flex-col gap-3">
      <CameroonMap
        points={points}
        onSelectCity={(id) => {
          router.replace(
            { pathname, query: { city: id } },
            { scroll: false },
          );
        }}
      />
      {selected ? (
        <div className="text-xs text-text-2">
          {t("roadmap.selectedCityLabel")}{" "}
          <span className="text-text">{selected.name}</span>
        </div>
      ) : null}
    </div>
  );
}

