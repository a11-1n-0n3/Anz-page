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
          /*
           * Dark, to match the hero. A shared link is judged against the page
           * it opens — a light preview in front of a dark site reads as the
           * wrong link.
           */
          background: "linear-gradient(135deg, #070d13 0%, #0e1720 55%, #10293b 100%)",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#e6f1f8" }}>
          {siteConfig.name}
        </div>
        {/* #67e8f9 is the dark-surface text blue — 13.5:1 here. */}
        <div style={{ marginTop: 20, fontSize: 34, color: "#67e8f9" }}>
          {siteConfig.ogTagline}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#93a7b6" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
