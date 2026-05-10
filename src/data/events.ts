import fs from "fs";
import path from "path";

export type EventStatus = "upcoming" | "past" | "ongoing";

export type EventLink = {
  label: string;
  href: string;
};

export type Event = {
  slug: string;
  name: string;
  dateISO: string; // kept for backward compatibility
  startDateISO: string; // YYYY-MM-DD
  endDateISO: string; // YYYY-MM-DD
  city: string;
  venue?: string;
  shortDescription: string;
  participants?: number;
  status: EventStatus;
  lumaUrl?: string;
  program?: string[];
  projects?: EventLink[];
  links?: EventLink[];
  gallery?: { src: string; alt: string; caption?: string }[];
  coverImage?: string;
  about?: string;
};

const DATA_PATH = path.join(process.cwd(), "src/data/events.json");

function normalizeEvent(event: Partial<Event>): Event {
  const fallbackDate = event.dateISO ?? "";
  const startDateISO = event.startDateISO ?? fallbackDate;
  const endDateISO = event.endDateISO ?? startDateISO;

  return {
    ...(event as Event),
    dateISO: startDateISO,
    startDateISO,
    endDateISO,
  };
}

export function getEvents(): Event[] {
  try {
    const data = fs.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(data) as Partial<Event>[];
    return parsed.map(normalizeEvent);
  } catch (error) {
    console.error("Error reading events.json:", error);
    return [];
  }
}

export function saveEvents(events: Event[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(events, null, 2), "utf-8");
}

export function getEvent(slug: string) {
  return getEvents().find((e) => e.slug === slug) ?? null;
}

export function getUpcomingEvents() {
  return getEvents()
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.startDateISO.localeCompare(b.startDateISO));
}

export function getOngoingEvents() {
  return getEvents()
    .filter((e) => e.status === "ongoing")
    .sort((a, b) => a.startDateISO.localeCompare(b.startDateISO));
}

export function getPastEvents() {
  return getEvents()
    .filter((e) => e.status === "past")
    .sort((a, b) => b.endDateISO.localeCompare(a.endDateISO));
}
