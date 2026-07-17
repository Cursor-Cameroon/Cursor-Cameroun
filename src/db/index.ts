import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Connexion Postgres (Neon via l'intégration Vercel).
 *
 * - Sur Vercel (serverless) : on utilise la connexion POOLÉE (`-pooler`),
 *   recommandée pour ne pas épuiser les connexions.
 * - En local : le pooler peut être injoignable (ETIMEDOUT) ; on utilise donc
 *   la connexion DIRECTE (`_UNPOOLED`) qui, elle, fonctionne.
 */
const pooled =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.STORAGE_URL;
const direct = process.env.DATABASE_URL_UNPOOLED ?? process.env.POSTGRES_URL_NON_POOLING;

const connectionString = process.env.VERCEL
  ? pooled ?? direct
  : direct ?? pooled;

if (!connectionString) {
  throw new Error(
    "Aucune URL de base de données trouvée (DATABASE_URL / POSTGRES_URL / STORAGE_URL)"
  );
}

// `prepare: false` recommandé avec les connexions poolées Neon/pgbouncer.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export { schema };
