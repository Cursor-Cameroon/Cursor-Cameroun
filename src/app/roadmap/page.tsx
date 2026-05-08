import { getTranslations } from "next-intl/server";
import { EVENTS } from "@/data/events";
import { CITY_POINTS, GOALS_2026 } from "@/data/roadmap";
import { RoadmapMapSection } from "@/components/RoadmapMapSection";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";

function percent(current: number, target: number) {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations();
  const sp = (await searchParams) ?? {};
  const selectedCityId = typeof sp.city === "string" ? sp.city : null;

  const selectedCity = CITY_POINTS.find((c) => c.id === selectedCityId) ?? null;
  const cityName = selectedCity?.name ?? null;
  const cityEvents = cityName
    ? EVENTS.filter((e) => e.city === cityName)
    : [];

  const timeline = [...EVENTS].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return (
    <div className="flex flex-col gap-10">
      <FadeIn>
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-text">
            {t("roadmap.title")}
          </h1>
          <p className="text-sm text-text-2">{t("roadmap.subtitle")}</p>
        </header>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <FadeIn direction="right">
          <RoadmapMapSection points={CITY_POINTS} selectedCityId={selectedCityId} />
        </FadeIn>

        <FadeIn direction="left">
          <div className="rounded-lg border border-border bg-surface-1 p-8">
            <h2 className="text-lg font-semibold text-text">
              {t("roadmap.progressTitle")}
            </h2>
            <div className="mt-5 space-y-4">
              {GOALS_2026.map((g) => {
                const p = percent(g.current, g.target);
                return (
                  <div key={g.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-text">{g.label}</span>
                      <span className="text-text-2">
                        {g.current} / {g.target} · {p}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-bg-2">
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

            <div className="mt-8 rounded-md border border-border bg-bg-2 p-4 text-sm text-text-2">
              <div className="font-medium text-text">{t("roadmap.ambitionsTitle")}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>{t("roadmap.ambition1")}</li>
                <li>{t("roadmap.ambition2")}</li>
                <li>{t("roadmap.ambition3")}</li>
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>

      {selectedCity ? (
        <FadeIn>
          <section className="rounded-lg border border-border bg-surface-1 p-8">
            <h2 className="text-lg font-semibold text-text">
              {t("roadmap.cityEventsTitle", { city: selectedCity.name })}
            </h2>
            {cityEvents.length ? (
              <ul className="mt-4 space-y-3 text-sm">
                {cityEvents.map((e) => (
                  <li key={e.slug} className="rounded-md border border-border bg-bg-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium text-text">{e.name}</div>
                      <div className="text-xs text-text-2">{e.dateISO}</div>
                    </div>
                    <div className="mt-2 text-text-2">{e.shortDescription}</div>
                    <div className="mt-3">
                      <a
                        className="text-sm font-medium text-text underline decoration-border hover:decoration-text"
                        href={`/events/${e.slug}`}
                      >
                        {t("events.viewDetails")}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-text-2">
                {t("roadmap.cityEventsEmpty")}
              </p>
            )}
          </section>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.2}>
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("roadmap.timelineTitle")}
          </h2>
          <FadeInStagger className="mt-5 space-y-3">
            {timeline.map((e) => (
              <FadeIn key={e.slug}>
                <li
                  className="rounded-md border border-border bg-bg-2 p-4 transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-medium text-text">{e.name}</div>
                    <div className="text-xs text-text-2">{e.dateISO}</div>
                  </div>
                  <div className="mt-2 text-sm text-text-2">
                    {e.city} · {e.status === "upcoming" ? t("events.statusUpcoming") : t("events.statusPast")}
                  </div>
                </li>
              </FadeIn>
            ))}
          </FadeInStagger>
        </section>
      </FadeIn>
    </div>
  );
}

