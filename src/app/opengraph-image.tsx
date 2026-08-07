import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1e1e1e 60%, #141433 100%)",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#ffffff" }}>
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 20, fontSize: 34, color: "#8b9bff" }}>
          {siteConfig.ogTagline}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#a1a1a1" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
