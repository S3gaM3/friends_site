import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { StoredBooking } from "@/content/types";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_PATH = path.join(DATA_DIR, "bookings.json");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

/**
 * Файловое хранилище заявок с очередью записи,
 * чтобы параллельные POST не затирали друг друга.
 */
export class BookingRepository {
  private writeChain: Promise<void> = Promise.resolve();

  async list(): Promise<StoredBooking[]> {
    await ensureDataDir();
    try {
      const raw = await readFile(BOOKINGS_PATH, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as StoredBooking[]) : [];
    } catch {
      return [];
    }
  }

  async append(booking: StoredBooking): Promise<void> {
    const run = async () => {
      const list = await this.list();
      list.unshift(booking);
      await ensureDataDir();
      await writeFile(BOOKINGS_PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
    };

    this.writeChain = this.writeChain.then(run, run);
    await this.writeChain;
  }
}

export const bookingRepository = new BookingRepository();
