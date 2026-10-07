import { z } from "zod";
import {
  SESSION_COOKIE,
  checkCredentials,
  createSessionToken,
  isAdminConfigured,
  isJsonRequest,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ email: z.string().max(200), password: z.string().max(200) });

export async function POST(request: Request) {
  if (!isJsonRequest(request)) return Response.json({ error: "Bad request" }, { status: 415 });

  if (!isAdminConfigured()) {
    return Response.json(
      { error: "Admin login isn't set up yet. Add ADMIN_EMAIL and ADMIN_PASSWORD to the environment." },
      { status: 503 },
    );
  }

  if (!rateLimit(`login:${clientIp(request)}`, 10, 15 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Enter your email and password." }, { status: 400 });

  if (!checkCredentials(parsed.data.email, parsed.data.password)) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Response.json({ error: "That email or password isn't right." }, { status: 401 });
  }

  const secure =
    new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, createSessionToken(), sessionCookieOptions(secure)),
  );
  return response;
}

function serializeCookie(
  name: string,
  value: string,
  options: { httpOnly: boolean; sameSite: "lax"; secure: boolean; path: string; maxAge: number },
): string {
  return [
    `${name}=${value}`,
    `Path=${options.path}`,
    `Max-Age=${options.maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
    options.secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}
