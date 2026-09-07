import type { StoredBooking } from "@/content/types";
import type { BookingRequest, BookingResult } from "@/lib/types";
import { bookingRepository } from "@/repositories/bookingRepository";

export type BookingValidation =
  | { ok: true; request: BookingRequest }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function isNonEmptyString(value: unknown, max = 200): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

/** Чистая валидация тела заявки — без побочных эффектов. */
export function validateBookingInput(body: unknown): BookingValidation {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректные данные формы." };
  }

  const data = body as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};

  if (!isNonEmptyString(data.name, 80)) {
    fieldErrors.name = "Укажите имя.";
  }
  if (!isNonEmptyString(data.contact, 120)) {
    fieldErrors.contact = "Укажите Telegram (@username или ссылку).";
  }
  if (typeof data.message === "string" && data.message.length > 2000) {
    fieldErrors.message = "Сообщение слишком длинное.";
  }
  if (data.consent !== true) {
    fieldErrors.consent = "Нужно согласие на\u00A0обработку данных.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Проверьте поля формы.", fieldErrors };
  }

  return {
    ok: true,
    request: {
      name: String(data.name).trim(),
      contact: String(data.contact).trim(),
      message: typeof data.message === "string" ? data.message.trim() : "",
      consent: true,
    },
  };
}

export class BookingService {
  constructor(private readonly repo = bookingRepository) {}

  async createFromBody(body: unknown): Promise<BookingResult> {
    const validated = validateBookingInput(body);
    if (!validated.ok) return validated;
    return this.create(validated.request);
  }

  async create(request: BookingRequest): Promise<BookingResult> {
    const id = `bk_${Date.now().toString(36)}`;
    const record: StoredBooking = {
      id,
      name: request.name,
      contact: request.contact,
      format: "online",
      timeWindow: "flexible",
      message: request.message,
      createdAt: new Date().toISOString(),
    };

    await this.repo.append(record);
    console.info("[booking] created", { id, createdAt: record.createdAt });

    return { ok: true, id };
  }

  async list(): Promise<StoredBooking[]> {
    return this.repo.list();
  }
}

export const bookingService = new BookingService();
