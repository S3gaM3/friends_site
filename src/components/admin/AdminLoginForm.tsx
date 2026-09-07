"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Не удалось войти.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Сеть недоступна.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <p className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {"Задайте "}
        <code className="font-mono">ADMIN_PASSWORD</code>
        {" в\u00A0"}
        <code className="font-mono">.env.local</code>
        {" и\u00A0перезапустите сервер."}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-2 w-full rounded-[var(--radius)] border border-line bg-white px-4 py-3 outline-none focus:border-clay"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Вхожу…" : "Войти"}
      </Button>
    </form>
  );
}
