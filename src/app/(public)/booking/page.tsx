import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { contentService } from "@/services/contentService";

export async function generateMetadata(): Promise<Metadata> {
  const content = await contentService.getContent();
  return {
    title: "Запись",
    description: content.booking.lead,
  };
}

export default async function BookingPage() {
  const { booking, site, hero } = await contentService.getContent();

  return (
    <div className="bg-sand/40">
      <div className="shell grid gap-12 py-14 md:grid-cols-[1fr_1.1fr] md:py-20">
        <div>
          <p className="eyebrow">Знакомство</p>
          <h1 className="display mt-3 text-[clamp(2rem,4.2vw,3.2rem)] text-ink">{booking.title}</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{booking.lead}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">{hero.metaLine}</p>

          <ul className="mt-10 space-y-3 text-sm text-ink-soft">
            <li>
              <span className="text-ink">Telegram:</span>{" "}
              <a href={site.telegram} target="_blank" rel="noreferrer">
                @d_shandalov
              </a>
            </li>
            <li>
              <span className="text-ink">Телефон:</span>{" "}
              <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a>
            </li>
          </ul>
        </div>

        <div className="booking-panel p-6 md:p-8">
          <BookingForm booking={booking} site={site} />
        </div>
      </div>
    </div>
  );
}
