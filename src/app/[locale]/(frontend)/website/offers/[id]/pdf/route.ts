import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { OfferPdf, type OfferPdfImages } from "@/components/offer/pdf/offer-pdf";
import staticData from "@/data/offers/static.json";
import { getOffer } from "@/lib/offers";
import type { OfferStatic } from "@/types/offer";

export const runtime = "nodejs";

// The badge strip bundled next to the /website/offer page.
const CERTIFICATIONS_PATH = path.join(
  process.cwd(),
  "src/app/[locale]/(frontend)/website/offer/certifivations.png",
);

// react-pdf embeds only PNG and JPEG; other logo formats are skipped.
const LOGO_FORMATS: Record<string, "png" | "jpg"> = {
  "image/png": "png",
  "image/jpeg": "jpg",
};

async function fetchLogo(url: string, base: string): Promise<OfferPdfImages["clientLogo"]> {
  if (!url) return undefined;
  try {
    // Payload's own relative URLs (local storage) need an absolute base.
    const response = await fetch(new URL(url, base));
    const format = LOGO_FORMATS[response.headers.get("content-type")?.split(";")[0] ?? ""];
    if (!response.ok || !format) return undefined;
    return { data: Buffer.from(await response.arrayBuffer()), format };
  } catch {
    return undefined;
  }
}

// Downloads one client offer as a PDF, built from the same data as its page.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) return new Response("Not found", { status: 404 });

  const [clientLogo, contactAvatar, certifications] = await Promise.all([
    fetchLogo(offer.client.logo, request.url),
    fetchLogo(offer.contact?.avatar ?? "", request.url),
    readFile(CERTIFICATIONS_PATH),
  ]);

  const pdf = await renderToBuffer(
    createElement(OfferPdf, {
      content: staticData as OfferStatic,
      offer,
      images: { clientLogo, contactAvatar, certifications },
    }) as ReactElement<DocumentProps>, // OfferPdf renders a <Document>.
  );

  // ASCII-only file name; the client slug is the client's id.
  const filename = `oferta-${offer.client.slug || "client"}-${offer.id}.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
