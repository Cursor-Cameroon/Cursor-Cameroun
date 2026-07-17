import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events as eventsTable } from "@/db/schema";

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
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
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

/** Assure la cohérence des champs de date (dateISO ↔ startDateISO ↔ endDateISO). */
export function normalizeEvent(event: Partial<Event>): Event {
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

export async function getEvents(): Promise<Event[]> {
  const rows = await db.select().from(eventsTable);
  return rows.map((row) => normalizeEvent(row.data));
}

export async function getEvent(slug: string): Promise<Event | null> {
  const [row] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.slug, slug))
    .limit(1);
  return row ? normalizeEvent(row.data) : null;
}

export async function eventExists(slug: string): Promise<boolean> {
  return (await getEvent(slug)) !== null;
}

/** Insère un nouvel événement. Retourne l'événement normalisé. */
export async function createEvent(input: Event): Promise<Event> {
  const event = normalizeEvent(input);
  await db.insert(eventsTable).values(toRow(event));
  return event;
}

/** Met à jour (merge) un événement existant. Retourne `null` si introuvable. */
export async function updateEvent(
  slug: string,
  patch: Partial<Event>
): Promise<Event | null> {
  const current = await getEvent(slug);
  if (!current) return null;

  const merged = normalizeEvent({ ...current, ...patch, slug });
  await db.update(eventsTable).set(toRow(merged)).where(eq(eventsTable.slug, slug));
  return merged;
}

/** Supprime un événement. Retourne `true` si une ligne a été supprimée. */
export async function deleteEvent(slug: string): Promise<boolean> {
  const deleted = await db
    .delete(eventsTable)
    .where(eq(eventsTable.slug, slug))
    .returning({ slug: eventsTable.slug });
  return deleted.length > 0;
}

function toRow(event: Event) {
  return {
    slug: event.slug,
    status: event.status,
    startDateISO: event.startDateISO,
    endDateISO: event.endDateISO,
    data: event,
  };
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return (await getEvents())
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.startDateISO.localeCompare(b.startDateISO));
}

export async function getOngoingEvents(): Promise<Event[]> {
  return (await getEvents())
    .filter((e) => e.status === "ongoing")
    .sort((a, b) => a.startDateISO.localeCompare(b.startDateISO));
}

export async function getPastEvents(): Promise<Event[]> {
  return (await getEvents())
    .filter((e) => e.status === "past")
    .sort((a, b) => b.endDateISO.localeCompare(a.endDateISO));
}
