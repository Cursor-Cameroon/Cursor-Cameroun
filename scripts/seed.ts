/**
 * Seed one-shot : importe les événements de `src/data/events.json`
 * (l'ancienne source de vérité) dans la table Postgres `events`.
 *
 * Prérequis :
 *   1. `npx vercel env pull .env.local`   (récupère DATABASE_URL)
 *   2. `npx drizzle-kit push`             (crée la table)
 *   3. `npm run db:seed`                  (ce script)
 *
 * Idempotent : utilise un upsert (onConflictDoUpdate) sur `slug`.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { events } from "../src/db/schema";
import type { Event } from "../src/data/events";

// Charge les variables d'environnement depuis .env.local puis .env (sans dépendance).
function loadEnv(file: string) {
  try {
    const content = readFileSync(path.join(process.cwd(), file), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* fichier absent : on ignore */
  }
}
loadEnv(".env.local");
loadEnv(".env");

// On privilégie la connexion DIRECTE (non poolée) : le pooler `-pooler` peut
// être injoignable en local (ETIMEDOUT), alors que l'hôte direct fonctionne.
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.STORAGE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL introuvable (as-tu fait `vercel env pull .env.local` ?)");
}

function normalize(event: Partial<Event>): Event {
  const startDateISO = event.startDateISO ?? event.dateISO ?? "";
  const endDateISO = event.endDateISO ?? startDateISO;
  return { ...(event as Event), dateISO: startDateISO, startDateISO, endDateISO };
}

async function main() {
  const raw = readFileSync(path.join(process.cwd(), "src/data/events.json"), "utf-8");
  const parsed = JSON.parse(raw) as Partial<Event>[];

  const client = postgres(connectionString!, { prepare: false });
  const db = drizzle(client);

  let count = 0;
  for (const item of parsed) {
    const event = normalize(item);
    await db
      .insert(events)
      .values({
        slug: event.slug,
        status: event.status,
        startDateISO: event.startDateISO,
        endDateISO: event.endDateISO,
        data: event,
      })
      .onConflictDoUpdate({
        target: events.slug,
        set: {
          status: event.status,
          startDateISO: event.startDateISO,
          endDateISO: event.endDateISO,
          data: event,
        },
      });
    count++;
    console.log(`  ✓ ${event.slug}`);
  }

  await client.end();
  console.log(`\n${count} événement(s) importé(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
