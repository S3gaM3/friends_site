/**
 * Разрешает только безопасные ссылки для CMS и публичного UI.
 * Блокирует javascript:, data: и прочие опасные схемы.
 */
export function isSafeHref(value: string): boolean {
  const href = value.trim();
  if (!href) return false;

  if (href.startsWith("/") || href.startsWith("#")) return true;

  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:" || url.protocol === "tel:";
  } catch {
    return false;
  }
}

export function requireSafeHref(value: string, field: string): string {
  const href = value.trim();
  if (!isSafeHref(href)) {
    throw new Error(`Поле «${field}» содержит недопустимую ссылку.`);
  }
  return href;
}
