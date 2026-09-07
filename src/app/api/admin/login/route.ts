import { NextResponse } from "next/server";
import { clientIp } from "@/lib/clientIp";
import { consumeRateLimit } from "@/lib/rateLimit";
import { authService } from "@/services/authService";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  if (!authService.isConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Задайте ADMIN_PASSWORD и\u00A0ADMIN_SECRET в\u00A0.env.local",
      },
      { status: 503 },
    );
  }

  const limit = consumeRateLimit(`login:${clientIp(request)}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Слишком много попыток. Попробуйте позже." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос." }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  if (!authService.verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Неверный пароль." }, { status: 401 });
  }

  await authService.createSession();
  return NextResponse.json({ ok: true });
}
