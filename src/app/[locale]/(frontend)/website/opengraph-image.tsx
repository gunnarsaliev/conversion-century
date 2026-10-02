import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { SITE_NAME } from "@/lib/seo/site";

// Default social share image for every /website page. Pages with a CMS
// image override it via their own openGraph.images.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_NAME;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

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
          {t("home.title")}
        </div>
      </div>
    ),
    size,
  );
}
