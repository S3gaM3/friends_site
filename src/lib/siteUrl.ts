const FALLBACK_SITE_URL = "https://dshan.ru";

/** Канонический origin сайта без завершающего слэша. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (fromEnv?.trim()) {
    return fromEnv.trim().replace(/\/+$/, "");
  }
  if (process.env.GITHUB_PAGES === "true") {
    const base = process.env.GITHUB_PAGES_BASE_PATH || "/friends_site";
    return `https://s3gam3.github.io${base.replace(/\/+$/, "")}`;
  }
  return FALLBACK_SITE_URL;
}

export function absoluteUrl(pathname = "/"): string {
  const base = getSiteUrl();
  if (!pathname || pathname === "/") return base;
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
