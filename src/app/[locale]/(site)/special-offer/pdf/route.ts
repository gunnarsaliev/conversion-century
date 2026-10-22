import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { OfferPdf } from "@/components/offer/pdf/offer-pdf";
import offerData from "@/data/offers/ayurvedabio-seo-migration.json";
import staticData from "@/data/offers/static.json";
import type { Offer, OfferStatic } from "@/types/offer";

export const runtime = "nodejs";

// The offer page's images, bundled next to the /offer page.
const IMAGES_DIR = path.join(
  process.cwd(),
  "src/app/[locale]/(site)/offer",
);

// Downloads the special offer as a PDF built from the same JSON as the page.
export async function GET() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const offer = offerData as Offer;
  const [clientLogo, certifications] = await Promise.all([
    readFile(path.join(IMAGES_DIR, "Ayurvedabio.png")),
    readFile(path.join(IMAGES_DIR, "certifivations.png")),
  ]);

  const pdf = await renderToBuffer(
    createElement(OfferPdf, {
      content: staticData as OfferStatic,
      offer,
      images: { clientLogo: { data: clientLogo, format: "png" }, certifications },
    }) as ReactElement<DocumentProps>, // OfferPdf renders a <Document>.
  );

  const filename = `oferta-${offer.client.slug}-${offer.id}.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
