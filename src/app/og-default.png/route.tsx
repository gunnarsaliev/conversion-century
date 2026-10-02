import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo/site";

// Default social share image (1200×630), used by buildMetadata when a page
// has no CMS image. Lives at a fixed, dotted path (/og-default.png) so the
// URL is stable and src/proxy.ts never login-gates or locale-rewrites it.
export const dynamic = "force-static";

export function GET() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.8 }}>{SITE_NAME}</div>
        <div style={{ marginTop: 24, fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          SEO agency for organic growth
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
