import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-owner admin auth.
 * The owner's email + password live in environment variables (ADMIN_EMAIL,
 * ADMIN_PASSWORD) so there is no public sign-up at all. A successful login sets
 * an HMAC-signed, HTTP-only cookie that expires after 7 days.
 */
export const SESSION_COOKIE = "yc_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function createSessionToken(): string {
  const key = secret();
  if (!key) throw new Error("Admin auth is not configured");
  const payload = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  return `${payload}.${sign(payload, key)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const key = secret();
  if (!token || !key) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload, key));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  return Number(payload) > Date.now();
}

export function checkCredentials(email: string, password: string): boolean {
  const ownerEmail = process.env.ADMIN_EMAIL;
  const ownerPassword = process.env.ADMIN_PASSWORD;
  if (!ownerEmail || !ownerPassword) return false;
  const emailOk = timingSafeEqual(digest(email.trim().toLowerCase()), digest(ownerEmail.trim().toLowerCase()));
  const passwordOk = timingSafeEqual(digest(password), digest(ownerPassword));
  return emailOk && passwordOk;
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/** Browsers can't send a JSON content type cross-site without a CORS preflight. */
export function isJsonRequest(request: Request): boolean {
  return (request.headers.get("content-type") ?? "").includes("application/json");
}
