import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function GET() {
  const authenticated = await authService.isAuthenticated();
  return NextResponse.json({
    ok: true,
    authenticated,
    configured: authService.isConfigured(),
  });
}
