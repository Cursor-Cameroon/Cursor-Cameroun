import { getTranslations } from "next-intl/server";
import { getEvents } from "@/data/events";
import { CITY_POINTS, GOALS_2026 } from "@/data/roadmap";
import { RoadmapMapSection } from "@/components/RoadmapMapSection";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";
import { RoadmapFilters } from "@/components/RoadmapFilters";

function percent(current: number, target: number) {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function formatEventDateRange(startDateISO: string, endDateISO: string) {
  return startDateISO === endDateISO ? startDateISO : `${startDateISO} → ${endDateISO}`;
}

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("roadmap.title"),
    description: t("roadmap.subtitle"),
    openGraph: {
      title: t("roadmap.title"),
      description: t("roadmap.subtitle"),
    },
  };
}

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations();
  const sp = (await searchParams) ?? {};
  const selectedCityId = typeof sp.city === "string" ? sp.city : null;

  const allEvents = await getEvents();
  const statusFilter = typeof sp.status === "string" ? sp.status : "all";

  const selectedCity = CITY_POINTS.find((c) => c.id === selectedCityId) ?? null;
  const cityName = selectedCity?.name ?? null;
  const cityEvents = cityName
    ? allEvents.filter((e) => e.city === cityName)
    : [];

  const timeline = [...allEvents]
    .filter((e) => statusFilter === "all" || e.status === statusFilter)
    .sort((a, b) => a.startDateISO.localeCompare(b.startDateISO));

  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <header className="flex flex-col gap-2 flex-shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight text-text">
            {t("roadmap.title")}
          </h1>
          <p className="text-sm text-text-2">{t("roadmap.subtitle")}</p>
        </header>
      </FadeIn>

      {/* Mobile: Map on top */}
      <div className="block md:hidden h-[45vh] min-h-[280px] w-full rounded-lg overflow-hidden shadow-md border border-border">
        <RoadmapMapSection points={CITY_POINTS} selectedCityId={selectedCityId} />
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:h-[75vh] md:min-h-[600px] md:overflow-hidden">
        {/* Left Panel: Timeline & Progress */}
        <div className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {selectedCity ? (
            <FadeIn>
              <section className="rounded-lg border border-border bg-surface-1 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-text">
                  {t("roadmap.cityEventsTitle", { city: selectedCity.name })}
                </h2>
                {cityEvents.length ? (
                  <ul className="mt-3 space-y-2 text-sm">
                    {cityEvents.map((e) => (
                      <li key={e.slug} className="rounded-md border border-border bg-bg-2 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-medium text-text">{e.name}</div>
                          <div className="text-xs text-text-2">{formatEventDateRange(e.startDateISO, e.endDateISO)}</div>
                        </div>
                        <div className="mt-2 text-xs text-text-2 line-clamp-2">{e.shortDescription}</div>
                        <div className="mt-2">
                          <a
                            className="text-xs font-medium text-text underline decoration-border hover:decoration-text"
                            href={`/events/${e.slug}`}
                          >
                            {t("events.viewDetails")}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-text-2">
                    {t("roadmap.cityEventsEmpty")}
                  </p>
                )}
              </section>
            </FadeIn>
          ) : null}

          <FadeIn delay={0.1}>
            <section className="rounded-lg border border-border bg-surface-1 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-text">
                {t("roadmap.timelineTitle")}
              </h2>

              {/* Status Filters */}
              <RoadmapFilters current={statusFilter} />

              <FadeInStagger className="mt-3 space-y-2">
                {timeline.length ? timeline.map((e) => (
                  <FadeIn key={e.slug}>
                    <a
                      href={`/events/${e.slug}`}
                      className="block rounded-md border border-border bg-bg-2 p-3 transition-transform hover:scale-[1.01] hover:border-text/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-medium text-text">{e.name}</div>
                        <span className="shrink-0 rounded-full border border-border bg-surface-1 px-2 py-0.5 text-[10px] text-text-2">
                          {e.status === "upcoming" ? t("events.statusUpcoming") : e.status === "ongoing" ? t("events.statusOngoing") : t("events.statusPast")}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-text-2">
                        <span>{e.city}</span>
                        <span>{formatEventDateRange(e.startDateISO, e.endDateISO)}</span>
                      </div>
                    </a>
                  </FadeIn>
                )) : (
                  <p className="py-4 text-center text-xs text-text-2">{t("roadmap.cityEventsEmpty")}</p>
                )}
              </FadeInStagger>
            </section>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div className="rounded-lg border border-border bg-surface-1 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-text">
                {t("roadmap.progressTitle")}
              </h2>
              <div className="mt-4 space-y-3">
                {GOALS_2026.map((g) => {
                  const p = percent(g.current, g.target);
                  return (
                    <div key={g.label} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-medium text-text">{g.label}</span>
                        <span className="text-text-2">
                          {g.current} / {g.target} · {p}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-bg-2">
                        <div
                          className="h-full bg-text transition-all duration-1000"
                          style={{ width: `${p}%` }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Panel: Map — Desktop only */}
        <FadeIn direction="right" className="hidden md:block flex-1 h-full min-h-[400px]">
          <div className="h-full w-full rounded-lg overflow-hidden shadow-md">
            <RoadmapMapSection points={CITY_POINTS} selectedCityId={selectedCityId} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
