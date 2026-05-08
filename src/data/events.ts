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

const DATA_PATH = path.join(process.cwd(), "src/data/events.json");

export function getEvents(): Event[] {
  try {
    const data = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(data);
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
    .filter((e) => e.status === "upcoming" || e.status === "ongoing")
    .sort((a, b) => {
      // "ongoing" first, then sort by date
      if (a.status === "ongoing" && b.status !== "ongoing") return -1;
      if (a.status !== "ongoing" && b.status === "ongoing") return 1;
      return a.dateISO.localeCompare(b.dateISO);
    });
}

export function getPastEvents() {
  return getEvents()
    .filter((e) => e.status === "past")
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}
