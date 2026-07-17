import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import type { Event } from "../data/events";

/**
 * Table `events`.
 *
 * Approche hybride : les champs scalaires utiles au tri/filtre sont des
 * colonnes dédiées, l'objet `Event` complet (avec ses tableaux program/links/
 * projects/gallery) est stocké dans la colonne `data` (jsonb). On garde ainsi
 * le type `Event` intact sans avoir à normaliser chaque sous-champ.
 */
export const events = pgTable("events", {
  slug: text("slug").primaryKey(),
  status: text("status").notNull(),
  startDateISO: text("start_date_iso").notNull(),
  endDateISO: text("end_date_iso").notNull(),
  data: jsonb("data").$type<Event>().notNull(),
});
