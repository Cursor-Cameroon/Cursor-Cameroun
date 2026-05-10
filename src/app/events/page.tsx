import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOngoingEvents, getPastEvents, getUpcomingEvents } from "@/data/events";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";
import Image from "next/image";
import { MapPin } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("events.title"),
    description: t("events.intro"),
    openGraph: {
      title: t("events.title"),
      description: t("events.intro"),
    },
  };
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const sp = (await searchParams) ?? {};
  const tab = typeof sp.tab === "string" ? sp.tab : "upcoming";

  const upcoming = getUpcomingEvents();
  const ongoing = getOngoingEvents();
  const past = getPastEvents();
  const events = tab === "past" ? past : tab === "ongoing" ? ongoing : upcoming;

  return (
    <div className="flex flex-col gap-8">
      <FadeIn>
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-text">
            {t("events.title")}
          </h1>
          <p className="text-sm text-text-2">{t("events.intro")}</p>
        </header>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-2">
          <Link
            href={{ pathname: "/events", query: { tab: "upcoming" } }}
            className={[
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              tab === "upcoming"
                ? "border-border bg-surface-2 text-text"
                : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
            ].join(" ")}
          >
            {t("events.upcoming")}
          </Link>
          <Link
            href={{ pathname: "/events", query: { tab: "ongoing" } }}
            className={[
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              tab === "ongoing"
                ? "border-border bg-surface-2 text-text"
                : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
            ].join(" ")}
          >
            {t("events.statusOngoing")}
          </Link>
          <Link
            href={{ pathname: "/events", query: { tab: "past" } }}
            className={[
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              tab === "past"
                ? "border-border bg-surface-2 text-text"
                : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
            ].join(" ")}
          >
            {t("events.past")}
          </Link>
        </div>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {events.map((e) => {
          const startDate = new Date(e.startDateISO);
          const endDate = new Date(e.endDateISO);
          const monthShort = new Intl.DateTimeFormat(locale, { month: "short" }).format(startDate).toUpperCase();
          const day = startDate.getDate().toString();
          const startFullDate = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(startDate);
          const endFullDate = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(endDate);
          const fullDate =
            e.startDateISO === e.endDateISO
              ? startFullDate
              : `${startFullDate} → ${endFullDate}`;

          return (
            <FadeIn key={e.slug}>
            <article
              className="group overflow-hidden rounded-lg border border-border bg-surface-1 transition-all hover:border-text/20 hover:shadow-lg"
            >
              {e.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={e.coverImage}
                    alt={e.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-text">{e.name}</h2>
                <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs text-text-2">
                  {e.status === "ongoing"
                    ? t("events.statusOngoing")
                    : e.status === "upcoming"
                    ? t("events.statusUpcoming")
                    : t("events.statusPast")}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {/* Date Row */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface-1 w-10 h-10 shrink-0 overflow-hidden">
                    <div className="bg-surface-2 text-[8px] font-bold text-text-2 uppercase w-full text-center py-0.5 border-b border-border">
                      {monthShort.replace(".", "")}
                    </div>
                    <div className="text-base font-bold text-text leading-none flex-1 flex items-center justify-center pt-0.5">
                      {day}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center py-0.5">
                    <span className="text-sm font-semibold text-text capitalize">{fullDate}</span>
                    <span className="text-xs text-text-2">
                      {e.startTime && e.endTime ? `${e.startTime} - ${e.endTime}` : e.startTime || e.endTime || ""}
                    </span>
                  </div>
                </div>

                {/* Location Row */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center rounded-lg border border-border bg-surface-1 w-10 h-10 shrink-0 text-text-2">
                    <MapPin size={16} />
                  </div>
                  <div className="flex flex-col justify-center py-0.5">
                    <span className="text-sm font-semibold text-text">
                      {e.venue || t("events.addressOnRegistration")}
                    </span>
                    <span className="text-xs text-text-2">{e.city}</span>
                  </div>
                </div>
              </div>
              
              {e.participants ? (
                <p className="mt-4 text-xs font-medium text-text-2">
                  {e.participants} {t("events.participants")}
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-6 text-text">{e.shortDescription}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/events/${e.slug}`}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-3 py-2 text-sm font-medium text-text hover:bg-surface-2"
                >
                  {t("events.viewDetails")}
                </Link>
                {e.status === "upcoming" && e.lumaUrl ? (
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
            </article>
          </FadeIn>
          );
        })}
      </FadeInStagger>
    </div>
  );
}

