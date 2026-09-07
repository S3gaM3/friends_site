import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const MIN_SECRET_LENGTH = 16;

function getPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function getSecret(): string | null {
  const secret = process.env.ADMIN_SECRET?.trim() ?? "";
  if (secret.length >= MIN_SECRET_LENGTH) return secret;

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const fallback = process.env.ADMIN_PASSWORD?.trim();
  if (fallback && fallback.length >= MIN_SECRET_LENGTH) return fallback;
  return "dev-insecure-secret-change-me";
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(expiresAt: number, secret: string): string {
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt }), "utf8").toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function decodeSession(token: string, secret: string): { exp: number } | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    return { exp: data.exp };
  } catch {
    return null;
  }
}

export class AuthService {
  isConfigured(): boolean {
    return getPassword().length > 0 && getSecret() !== null;
  }

  /** Сравнение через SHA-256 + timingSafeEqual — без утечки длины пароля. */
  verifyPassword(password: string): boolean {
    const expected = getPassword();
    if (!expected) return false;
    return timingSafeEqual(digest(password), digest(expected));
  }

  async createSession(): Promise<void> {
    const secret = getSecret();
    if (!secret) {
      throw new Error("ADMIN_SECRET не задан.");
    }

    const token = encodeSession(Date.now() + SESSION_TTL_MS, secret);
    const jar = await cookies();
    jar.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    });
  }

  async clearSession(): Promise<void> {
    const jar = await cookies();
    jar.delete(COOKIE_NAME);
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.isConfigured()) return false;
    const secret = getSecret();
    if (!secret) return false;

    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return decodeSession(token, secret) !== null;
  }
}

export const authService = new AuthService();
