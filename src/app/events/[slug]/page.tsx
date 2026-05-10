import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEvent } from "@/data/events";
import { MapPin } from "lucide-react";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const startDate = new Date(event.startDateISO);
  const endDate = new Date(event.endDateISO);
  const monthShort = new Intl.DateTimeFormat(locale, { month: "short" }).format(startDate).toUpperCase();
  const day = startDate.getDate().toString();
  const startFullDate = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(startDate);
  const endFullDate = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(endDate);
  const fullDate =
    event.startDateISO === event.endDateISO
      ? startFullDate
      : `${startFullDate} → ${endFullDate}`;

  return (
    <div className="flex flex-col gap-10">
      <header className="overflow-hidden rounded-xl border border-border bg-bg-2">
        {event.coverImage && (
          <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-border">
            <Image
              src={event.coverImage}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="p-8">
          <h1 className="text-3xl font-bold tracking-tight text-text mb-6">
            {event.name}
          </h1>

          <div className="flex flex-col gap-6 mb-8">
            {/* Date Row */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface-1 w-12 h-12 shrink-0 overflow-hidden">
                <div className="bg-surface-2 text-[10px] font-bold text-text-2 uppercase w-full text-center py-0.5 border-b border-border">
                  {monthShort.replace(".", "")}
                </div>
                <div className="text-lg font-bold text-text leading-none flex-1 flex items-center justify-center pt-0.5">
                  {day}
                </div>
              </div>
              <div className="flex flex-col justify-center py-1">
                <span className="text-base font-semibold text-text capitalize">{fullDate}</span>
                <span className="text-sm text-text-2">
                  {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime || event.endTime || ""}
                </span>
              </div>
            </div>

            {/* Location Row */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center rounded-lg border border-border bg-surface-1 w-12 h-12 shrink-0 text-text-2">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col justify-center py-1">
                <span className="text-base font-semibold text-text">
                  {event.venue || t("events.addressOnRegistration")}
                </span>
                <span className="text-sm text-text-2">{event.city}</span>
              </div>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-text-2">
            {event.shortDescription}
          </p>
        {event.participants ? (
          <p className="mt-2 text-sm text-text-2">
            {event.participants} {t("events.participants")}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
          >
            ← {t("events.title")}
          </Link>
          {event.status === "upcoming" && event.lumaUrl ? (
            <a
              className="inline-flex items-center justify-center rounded-md bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
              href={event.lumaUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t("events.register")}
            </a>
          ) : null}
        </div>
        </div>
      </header>

      {event.about && (
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("events.detailAbout")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-text-2 whitespace-pre-wrap">
            {event.about}
          </p>
        </section>
      )}

      {event.program?.length ? (
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("events.detailProgram")}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-2">
            {event.program.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.projects?.length ? (
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("events.detailProjects")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {event.projects.map((p) => (
              <li key={p.href}>
                <a
                  className="font-medium text-text underline decoration-border hover:decoration-text"
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.links?.length ? (
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("events.detailLinks")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {event.links.map((l) => (
              <li key={l.href}>
                <a
                  className="font-medium text-text underline decoration-border hover:decoration-text"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.gallery?.length ? (
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("events.detailPhotos")}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {event.gallery.map((img) => (
              <figure
                key={img.src}
                className="overflow-hidden rounded-md border border-border bg-bg-2"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-3 text-xs text-text-2">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

