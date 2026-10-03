import { ImageResponse } from "next/og";
import { contentService } from "@/services/contentService";

export const alt = "Даниил Шандалов — психолог";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const content = await contentService.getContent();
  const name = content.site.name;
  const title = content.site.title;
  const tagline = content.site.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(145deg, #f7f5f0 0%, #dde5df 55%, #c9b8a3 100%)",
          color: "#25312f",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#5a7168",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {name}
          </div>
          <div style={{ fontSize: 34, color: "#5a6864", maxWidth: 900, lineHeight: 1.3 }}>
            {tagline}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#5a7168" }}>dshan.ru</div>
      </div>
    ),
    { ...size },
  );
}
