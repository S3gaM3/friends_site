import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { bookingService } from "@/services/bookingService";

export async function GET() {
  if (!(await authService.isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Нужна авторизация." }, { status: 401 });
  }

  const bookings = await bookingService.list();
  return NextResponse.json({ ok: true, bookings });
}
