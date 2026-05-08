export type EventStatus = "upcoming" | "past";

export type EventLink = {
  label: string;
  href: string;
};

export type Event = {
  slug: string;
  name: string;
  dateISO: string; // YYYY-MM-DD
  city: string;
  venue?: string;
  shortDescription: string;
  participants?: number;
  status: EventStatus;
  lumaUrl?: string;
  program?: string[];
  projects?: EventLink[];
  links?: EventLink[];
  gallery?: { src: string; alt: string; caption: string }[];
};

export const EVENTS: Event[] = [
  {
    slug: "cafe-cursor-yaounde-01",
    name: "Café Cursor · Yaoundé #01",
    dateISO: "2026-05-10",
    city: "Yaoundé",
    venue: "Lieu à confirmer",
    shortDescription:
      "Découverte de Cursor, setup, workflows et mini-défis en binôme.",
    participants: 40,
    status: "upcoming",
    lumaUrl: "https://lu.ma/cursor-cameroun-01",
    program: [
      "Accueil & setup",
      "Démos Cursor (prompts, agents, refactors)",
      "Mini hack: page landing en 45 minutes",
      "Partage projets & networking",
    ],
    links: [{ label: "Inscription Luma", href: "https://lu.ma/cursor-cameroun-01" }],
  },
  {
    slug: "night-of-code-yaounde-01",
    name: "Night of Code · Yaoundé #01",
    dateISO: "2026-06-07",
    city: "Yaoundé",
    venue: "Lieu à confirmer",
    shortDescription:
      "Soirée coding : construire un produit complet avec Cursor, en équipe.",
    participants: 60,
    status: "upcoming",
    lumaUrl: "https://lu.ma/cursor-cameroun-02",
  },
  {
    slug: "mini-hackathon-1",
    name: "Mini Hackathon #1 · Site officiel",
    dateISO: "2026-05-06",
    city: "En ligne",
    shortDescription:
      "Construire le site officiel de la communauté Cursor Cameroun en une semaine.",
    participants: 25,
    status: "past",
    projects: [
      { label: "Repo du site", href: "https://github.com/cursor-cameroun/official-site" }
    ],
    links: [
      { label: "Cahier des charges", href: "/" }
    ],
    gallery: [
      {
        src: "/gallery/HOME.png",
        alt: "HOME",
        caption: "Session de travail collective — Mini Hackathon #1, mai 2026",
      },
      {
        src: "/gallery/ROADMAP.png",
        alt: "Mini Hackathon #1 · revue de code en binôme",
        caption: "Revue de code et retours — Mini Hackathon #1",
      },
      {
        src: "/gallery/EVENTS.png",
        alt: "Mini Hackathon #1 · démo finale du site",
        caption: "Démonstration finale du site — Mini Hackathon #1",
      },
    ],
  },
  {
    slug: "cafe-cursor-yaounde-00",
    name: "Café Cursor · Yaoundé #01",
    dateISO: "2026-04-17",
    city: "En ligne",
    shortDescription:
      "Construire le site officiel de la communauté Cursor Cameroun en une semaine.",
    participants: 25,
    status: "past",
    projects: [
      { label: "Repo du site", href: "https://github.com/cursor-cameroun/official-site" }
    ],
    links: [
      { label: "Cahier des charges", href: "/" }
    ],
    gallery: [
      {
        src: "/gallery/session-travail.png",
        alt: "Café Cursor · Yaoundé #01 · session de travail collective",
        caption: "Session de travail collective — Café Cursor · Yaoundé #01, mai 2026",
      },
      {
        src: "/gallery/revue-code.png",
        alt: "Café Cursor · Yaoundé #01 · revue de code en binôme",
        caption: "Revue de code et retours — Café Cursor · Yaoundé #01",
      },
      {
        src: "/gallery/demo-finale.png",
        alt: "Café Cursor · Yaoundé #01 · démo finale du site",
        caption: "Démonstration finale du site — Café Cursor · Yaoundé #01",
      },
    ],
  }
];

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug) ?? null;
}

export function getUpcomingEvents() {
  return EVENTS.filter((e) => e.status === "upcoming").sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO),
  );
}

export function getPastEvents() {
  return EVENTS.filter((e) => e.status === "past").sort((a, b) =>
    b.dateISO.localeCompare(a.dateISO),
  );
}

