import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEvent } from "@/data/events";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations();
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

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
        <p className="text-sm text-text-2">
          {event.city} · {event.dateISO}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text">
          {event.name}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-text">
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

