"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem, SiteProfile } from "@/content/types";
import { Button } from "@/components/ui/Button";

export function Header({ site, nav }: { site: SiteProfile; nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/90 backdrop-blur-md">
      <div className="shell flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="group min-w-0 no-underline" onClick={() => setOpen(false)}>
          <span className="display block text-[1.25rem] leading-none text-ink transition-colors group-hover:text-clay-deep">
            {site.firstName} {site.name.split(" ").slice(1).join(" ")}
          </span>
          <span className="mt-1 block text-xs tracking-[0.04em] text-ink-soft">{site.title}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href.includes("#") && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm no-underline transition-colors ${
                  active ? "text-clay-deep" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Button href="/booking#form" className="!px-4 !py-2.5 text-sm">
            {"Записаться на\u00A0знакомство"}
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex w-4 flex-col gap-1.5" aria-hidden>
            <span className={`h-px bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-px bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Мобильная навигация">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 text-base text-ink no-underline"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/booking#form" className="mt-2 w-full" onClick={() => setOpen(false)}>
              {"Записаться на\u00A0знакомство"}
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
