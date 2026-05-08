import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPastEvents, getUpcomingEvents } from "@/data/events";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations();
  const sp = (await searchParams) ?? {};
  const tab = typeof sp.tab === "string" ? sp.tab : "upcoming";

  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  const events = tab === "past" ? past : upcoming;

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
        {events.map((e) => (
          <FadeIn key={e.slug}>
            <article
              className="rounded-lg border border-border bg-surface-1 p-6 transition-transform hover:scale-[1.01]"
            >
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
              <p className="mt-2 text-sm text-text-2">
                {e.city} · {e.dateISO}
                {e.venue ? ` · ${e.venue}` : ""}
                {e.participants ? ` · ${e.participants} ${t("events.participants")}` : ""}
              </p>
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
            </article>
          </FadeIn>
        ))}
      </FadeInStagger>
    </div>
  );
}

