"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type StatusFilter = "all" | "upcoming" | "ongoing" | "past";

const LABELS: Record<StatusFilter, string> = {
  all: "Tous",
  upcoming: "À venir",
  ongoing: "En cours",
  past: "Passé",
};

const FILTERS: StatusFilter[] = ["all", "upcoming", "ongoing", "past"];

export function RoadmapFilters({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleFilter(status: StatusFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className={`mt-3 flex flex-wrap gap-1.5 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}>
      {FILTERS.map((s) => (
        <button
          key={s}
          onClick={() => handleFilter(s)}
          disabled={isPending}
          className={[
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors disabled:cursor-wait",
            current === s || (s === "all" && current === "all")
              ? "border-text bg-text text-bg"
              : "border-border bg-surface-2 text-text-2 hover:text-text hover:bg-border",
          ].join(" ")}
        >
          {LABELS[s]}
        </button>
      ))}
    </div>
  );
}
