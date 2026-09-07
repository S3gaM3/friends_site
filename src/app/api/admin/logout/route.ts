import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function POST() {
  await authService.clearSession();
  return NextResponse.json({ ok: true });
}
