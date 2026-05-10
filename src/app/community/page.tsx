import { getTranslations } from "next-intl/server";
import { LINKS } from "@/data/links";
import { getEvents } from "@/data/events";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("community.title"),
    description: t("community.subtitle"),
    openGraph: {
      title: t("community.title"),
      description: t("community.subtitle"),
    },
  };
}

export default async function CommunityPage() {
  const t = await getTranslations();
  const events = getEvents();
  const projects = Array.from(
    new Map(
      events.flatMap((e) => e.projects ?? [])
        .filter(Boolean)
        .map((p) => [p.href, p]),
    ).values(),
  );

  return (
    <div className="flex flex-col gap-10">
      <FadeIn>
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-text">
            {t("community.title")}
          </h1>
          <p className="text-sm text-text-2">{t("community.subtitle")}</p>
        </header>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("community.missionTitle")}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-2">
            <li>{t("community.mission1")}</li>
            <li>{t("community.mission2")}</li>
            <li>{t("community.mission3")}</li>
            <li>{t("community.mission4")}</li>
          </ul>
        </section>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FadeIn>
          <div className="h-full rounded-lg border border-border bg-surface-1 p-8">
            <h2 className="text-lg font-semibold text-text">
              {t("community.joinTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-2">
              {t("community.joinBody")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                className="inline-flex items-center justify-center rounded-md bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
                href={LINKS.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                {t("community.groupWhatsapp")}
              </a>
              <a
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                href={LINKS.luma}
                target="_blank"
                rel="noreferrer"
              >
                {t("community.luma")}
              </a>
              <a
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {t("community.linkedin")}
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="h-full rounded-lg border border-border bg-surface-1 p-8">
            <h2 className="text-lg font-semibold text-text">
              {t("community.linksTitle")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  className="font-medium text-text underline decoration-border hover:decoration-text"
                  href={LINKS.githubOrg}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("community.orgGithub")}
                </a>
                <div className="mt-1 text-xs text-text-2">{LINKS.githubOrg}</div>
              </li>
              <li>
                <a
                  className="font-medium text-text underline decoration-border hover:decoration-text"
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("community.groupWhatsapp")}
                </a>
                <div className="mt-1 text-xs text-text-2">{LINKS.whatsapp}</div>
              </li>
              <li>
                <a
                  className="font-medium text-text underline decoration-border hover:decoration-text"
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("community.linkedin")}
                </a>
                <div className="mt-1 text-xs text-text-2">{LINKS.linkedin}</div>
              </li>
              <li>
                <a
                  className="font-medium text-text underline decoration-border hover:decoration-text"
                  href={LINKS.luma}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("community.luma")}
                </a>
                <div className="mt-1 text-xs text-text-2">{LINKS.luma}</div>
              </li>
            </ul>
          </div>
        </FadeIn>
      </FadeInStagger>

      <FadeIn delay={0.3}>
        <section className="rounded-lg border border-border bg-surface-1 p-8">
          <h2 className="text-lg font-semibold text-text">
            {t("community.githubTitle")}
          </h2>
          {projects.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {projects.map((p) => (
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
          ) : (
            <p className="mt-3 text-sm text-text-2">
              {t("community.noProjects")}
            </p>
          )}
        </section>
      </FadeIn>
    </div>
  );
}

