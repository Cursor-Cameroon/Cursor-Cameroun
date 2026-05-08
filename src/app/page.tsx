import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { CameroonMap } from "@/components/CameroonMap";
import { LINKS } from "@/data/links";
import { getPastEvents, getUpcomingEvents } from "@/data/events";
import { CITY_POINTS } from "@/data/roadmap";
import { FadeIn } from "@/components/FadeIn";

export default async function Home() {
  const t = await getTranslations();
  const upcoming = getUpcomingEvents().slice(0, 3);
  const past = getPastEvents().slice(0, 2);

  const members = CITY_POINTS.reduce((acc, c) => acc + (c.members ?? 0), 0);
  const eventsCount = upcoming.length + getPastEvents().length;
  const citiesCovered = CITY_POINTS.filter((c) => c.kind === "active").length;

  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <FadeIn>
        <section className="rounded-xl border border-border bg-bg-2 p-8 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-text-2">{t("meta.tagline")}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text md:text-5xl">
                {t("home.heroTitle")}
              </h1>
              <p className="mt-4 text-lg leading-8 text-text-2">
                {t("home.heroSubtitle")}
              </p>
            </div>

            <a
              className="inline-flex items-center justify-center rounded-md bg-text px-5 py-3 text-sm font-medium text-bg hover:opacity-90"
              href={LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              {t("home.heroCta")}
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface-1 p-5">
              <div className="text-2xl font-semibold text-text">
                <AnimatedNumber value={members} />
              </div>
              <div className="mt-1 text-sm text-text-2">{t("home.statsMembers")}</div>
            </div>
            <div className="rounded-lg border border-border bg-surface-1 p-5">
              <div className="text-2xl font-semibold text-text">
                <AnimatedNumber value={eventsCount} />
              </div>
              <div className="mt-1 text-sm text-text-2">{t("home.statsEvents")}</div>
            </div>
            <div className="rounded-lg border border-border bg-surface-1 p-5">
              <div className="text-2xl font-semibold text-text">
                <AnimatedNumber value={citiesCovered} />
              </div>
              <div className="mt-1 text-sm text-text-2">{t("home.statsCities")}</div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* About */}
      <FadeIn delay={0.2}>
        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-10">
          <div className="rounded-lg border border-border bg-surface-1 p-8">
            <h2 className="text-xl font-semibold tracking-tight text-text">
              {t("home.sectionAboutTitle")}
            </h2>
            <p className="mt-3 leading-7 text-text-2">{t("home.sectionAboutBody")}</p>
            <div className="mt-6">
              <Link
                href="/community"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
              >
                {t("nav.community")}
              </Link>
            </div>
          </div>

          <CameroonMap points={CITY_POINTS} />
        </section>
      </FadeIn>

      {/* Upcoming */}
      <FadeIn delay={0.3}>
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-text">
                {t("home.sectionNextEventsTitle")}
              </h2>
              <p className="mt-1 text-sm text-text-2">
                {upcoming.length ? t("home.upcomingHintSome") : t("home.upcomingHintNone")}
              </p>
            </div>
            <Link
              href="/events"
              className="text-sm font-medium text-text underline decoration-border hover:decoration-text"
            >
              {t("nav.events")}
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {upcoming.map((e) => (
              <div
                key={e.slug}
                className="rounded-lg border border-border bg-surface-1 p-6 transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-text">{e.name}</h3>
                  <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs text-text-2">
                    {t("events.statusUpcoming")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-2">
                  {e.city} · {e.dateISO}
                  {e.participants ? ` · ${e.participants} ${t("events.participants")}` : ""}
                </p>
                <p className="mt-4 text-sm leading-6 text-text">{e.shortDescription}</p>
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/events/${e.slug}`}
                    className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-3 py-2 text-sm font-medium text-text hover:bg-surface-2"
                  >
                    {t("events.viewDetails")}
                  </Link>
                  {e.lumaUrl ? (
                    <a
                      className="inline-flex items-center justify-center rounded-md bg-text px-3 py-2 text-sm font-medium text-bg hover:opacity-90"
                      href={e.lumaUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("events.register")}
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Past highlights */}
      <FadeIn delay={0.4}>
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-text">
            {t("home.sectionPastHighlightsTitle")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {past.map((e) => (
              <div
                key={e.slug}
                className="rounded-lg border border-border bg-surface-1 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-text">{e.name}</h3>
                  <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs text-text-2">
                    {t("events.statusPast")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-2">
                  {e.city} · {e.dateISO}
                  {e.participants ? ` · ${e.participants} ${t("events.participants")}` : ""}
                </p>
                <p className="mt-4 text-sm leading-6 text-text">{e.shortDescription}</p>
                <div className="mt-5">
                  <Link
                    href={`/events/${e.slug}`}
                    className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-3 py-2 text-sm font-medium text-text hover:bg-surface-2"
                  >
                    {t("events.viewDetails")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Closing CTA */}
      <FadeIn delay={0.5}>
        <section className="rounded-xl border border-border bg-bg-2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {t("home.closingCtaTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-2">
            {t("home.closingCtaBody")}
          </p>
          <div className="mt-6">
            <a
              className="inline-flex items-center justify-center rounded-md bg-text px-5 py-3 text-sm font-medium text-bg hover:opacity-90"
              href={LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              {t("home.closingCtaButton")}
            </a>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
