import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

/** One shared preview image for every locale. */
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
          background: "linear-gradient(135deg, #ffffff 0%, #f3eee6 100%)",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#1d1d1f" }}>
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 20, fontSize: 34, color: "#b8935c" }}>
          {siteConfig.ogTagline}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#6e6e73" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
