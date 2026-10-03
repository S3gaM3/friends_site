import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { contentService } from "@/services/contentService";

function revalidatePublicPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/booking");
  revalidatePath("/services");
  revalidatePath("/recommendations");
  revalidatePath("/manifest.webmanifest");
  revalidatePath("/sitemap.xml");
  revalidatePath("/opengraph-image");
  revalidatePath("/twitter-image");
}

export async function GET() {
  if (!(await authService.isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Нужна авторизация." }, { status: 401 });
  }

  const content = await contentService.getContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: Request) {
  if (!(await authService.isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Нужна авторизация." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON." }, { status: 400 });
  }

  try {
    const content = await contentService.saveContent(body);
    revalidatePublicPaths();
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
