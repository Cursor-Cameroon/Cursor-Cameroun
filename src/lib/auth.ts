/**
 * Session admin signée (HMAC-SHA256).
 *
 * Le cookie ne contient plus une valeur statique ("true") triviale à forger :
 * il contient un payload signé côté serveur. Toute modification du cookie
 * invalide la signature. Compatible Edge (proxy) et Node (routes API) via
 * l'API Web Crypto (`globalThis.crypto.subtle`).
 */

export const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 1 semaine (secondes)

/** Secret de signature. `AUTH_SECRET` en priorité, sinon `ADMIN_PASSWORD`. */
function getSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("AUTH_SECRET (ou ADMIN_PASSWORD) doit être défini");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

/** Comparaison à temps constant pour éviter les timing attacks. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Crée un token signé `payloadB64.signatureB64` valide `SESSION_MAX_AGE`. */
export async function createSessionToken(): Promise<string> {
  const payload = { role: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = toBase64Url(await hmac(payloadB64));
  return `${payloadB64}.${signature}`;
}

/** Vérifie signature + expiration. Retourne `true` si la session est valide. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, signatureB64] = token.split(".");
  if (!payloadB64 || !signatureB64) return false;

  try {
    const expected = await hmac(payloadB64);
    if (!timingSafeEqual(fromBase64Url(signatureB64), expected)) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    if (payload.role !== "admin") return false;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Garde pour les routes API de mutation. Lit le cookie de session sur la
 * requête et vérifie sa signature. Retourne `true` si l'appelant est admin.
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  const token = match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : null;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_MAX_AGE,
  path: "/",
};
