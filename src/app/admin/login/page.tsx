import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { authService } from "@/services/authService";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await authService.isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col justify-center px-5 py-16">
      <p className="text-sm tracking-[0.14em] text-clay-deep uppercase">Админка</p>
      <h1 className="display mt-3 text-3xl text-ink">{"Вход в\u00A0управление сайтом"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {"Редактирование текстов сайта и\u00A0просмотр заявок на\u00A0запись."}
      </p>
      <div className="mt-8 rounded-[calc(var(--radius)+4px)] border border-line bg-white/80 p-6">
        <AdminLoginForm configured={authService.isConfigured()} />
      </div>
    </div>
  );
}
