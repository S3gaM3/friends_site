import { NextResponse } from "next/server";
import { clientIp } from "@/lib/clientIp";
import { consumeRateLimit } from "@/lib/rateLimit";
import { bookingService } from "@/services/bookingService";

const BOOKING_LIMIT = 8;
const BOOKING_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const limit = consumeRateLimit(`booking:${clientIp(request)}`, BOOKING_LIMIT, BOOKING_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Попробуйте позже." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось прочитать данные." },
      { status: 400 },
    );
  }

  const result = await bookingService.createFromBody(body);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
