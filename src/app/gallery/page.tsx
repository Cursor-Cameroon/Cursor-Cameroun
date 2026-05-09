import { getTranslations, getLocale } from "next-intl/server";
import { getEvents } from "@/data/events";
import { GalleryGrid, type GalleryPhoto } from "@/components/GalleryGrid";
import { FadeIn } from "@/components/FadeIn";

function galleryHref(event: string, date: string) {
  const params = new URLSearchParams();
  if (event !== "all") params.set("event", event);
  if (date !== "all") params.set("date", date);
  const qs = params.toString();
  return `/gallery${qs ? `?${qs}` : ""}`;
}

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("gallery.title"),
    description: t("gallery.subtitle"),
    openGraph: {
      title: t("gallery.title"),
      description: t("gallery.subtitle"),
    },
  };
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);
  const sp = (await searchParams) ?? {};
  const filter = typeof sp.event === "string" ? sp.event : "all";
  const dateFilter = typeof sp.date === "string" ? sp.date : "all";

  const allEvents = getEvents();
  const photos: GalleryPhoto[] = allEvents.flatMap((e) =>
    (e.gallery ?? []).map((g) => ({
      src: g.src,
      alt: g.alt,
      caption: g.caption,
      eventSlug: e.slug,
      eventName: e.name,
      startDateISO: e.startDateISO,
      endDateISO: e.endDateISO,
      city: e.city,
    })),
  );

  const filtered = photos.filter(
    (p) =>
      (filter === "all" || p.eventSlug === filter) &&
      (dateFilter === "all" || p.startDateISO.startsWith(dateFilter)),
  );

  const eventOptions = allEvents.filter((e) => (e.gallery ?? []).length > 0).map(
    (e) => ({ slug: e.slug, name: e.name }),
  );

  const dateOptions = [
    ...new Set(photos.map((p) => p.startDateISO.substring(0, 7))),
  ].sort();

  const fmt = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const formatMonth = (ym: string) => fmt.format(new Date(`${ym}-01`));

  return (
    <div className="flex flex-col gap-8">
      <FadeIn>
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-text">
            {t("gallery.title")}
          </h1>
          <p className="text-sm text-text-2">{t("gallery.subtitle")}</p>
        </header>
      </FadeIn>

      {/* Filtre par événement */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-center gap-2">
          <a
            className={[
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              filter === "all"
                ? "border-border bg-surface-2 text-text"
                : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
            ].join(" ")}
            href={galleryHref("all", dateFilter)}
          >
            {t("gallery.filterAll")}
          </a>
          {eventOptions.map((e) => (
            <a
              key={e.slug}
              className={[
                "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                filter === e.slug
                  ? "border-border bg-surface-2 text-text"
                  : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
              ].join(" ")}
              href={galleryHref(e.slug, dateFilter)}
            >
              {e.name}
            </a>
          ))}
        </div>
      </FadeIn>

      {/* Filtre par date */}
      {dateOptions.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-2">{t("gallery.filterByDate")}</span>
            <a
              className={[
                "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                dateFilter === "all"
                  ? "border-border bg-surface-2 text-text"
                  : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
              ].join(" ")}
              href={galleryHref(filter, "all")}
            >
              {t("gallery.filterAllDates")}
            </a>
            {dateOptions.map((d) => (
              <a
                key={d}
                className={[
                  "rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors",
                  dateFilter === d
                    ? "border-border bg-surface-2 text-text"
                    : "border-border bg-surface-1 text-text-2 hover:bg-surface-2 hover:text-text",
                ].join(" ")}
                href={galleryHref(filter, d)}
              >
                {formatMonth(d)}
              </a>
            ))}
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.3}>
        {filtered.length ? (
          <GalleryGrid photos={filtered} />
        ) : (
          <div className="rounded-lg border border-border bg-surface-1 p-8 text-sm text-text-2">
            {t("gallery.empty")}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
