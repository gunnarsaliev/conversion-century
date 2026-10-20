"use server";

import { revalidatePath } from "next/cache";
import { headers as getHeaders } from "next/headers";
import { getPayload, type RequiredDataFromCollectionSlug } from "payload";
import config from "@payload-config";

import { offerFormSchema, type OfferFormValues } from "@/lib/offer-form";
import type { Offer as OfferDoc } from "../../../../../../payload-types";

// ---------------------------------------------------------------------------
// Offer create / update (Server Actions, Payload local API)
// ---------------------------------------------------------------------------
//
// Run as the signed-in user with `overrideAccess: false`, so the Offers
// collection's access rules (admins only) apply. Status and "Оферта от"
// aren't part of the form: new offers get the default status ("draft") and
// the signed-in user as preparer; updates keep both as they are.

type OfferFormResult =
  | { success: true; id: number }
  | { success: false; error: string };

// One paragraph per non-empty line, in the shape Payload's Lexical field stores.
function textToLexical(text: string): NonNullable<OfferDoc["description"]> {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          textFormat: 0,
          textStyle: "",
          children: [
            { type: "text", text: line, format: 0, style: "", mode: "normal", detail: 0, version: 1 },
          ],
        })),
    },
  };
}

const toIso = (day: string) => new Date(day).toISOString();

function toOfferData(values: OfferFormValues) {
  const { metrics } = values;
  return {
    client: values.client,
    date: toIso(values.date),
    validUntil: toIso(values.validUntil),
    services: values.services,
    // null clears a previously set fixed price on update.
    fixedPrice: values.fixedPrice ?? null,
    discount: values.discount ?? null,
    description: values.description ? textToLexical(values.description) : null,
    metrics: {
      source: metrics.source,
      date: metrics.date ? toIso(metrics.date) : null,
      domainRating: metrics.domainRating ?? null,
      backlinks: metrics.backlinks ?? null,
      organicKeywords: metrics.organicKeywords ?? null,
      organicTraffic: metrics.organicTraffic ?? null,
    },
    keywords: values.keywords,
  };
}

async function saveOffer(
  input: OfferFormValues,
  id?: number,
): Promise<OfferFormResult> {
  const parsed = offerFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Невалидни данни",
    };
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });

  if (user?.role !== "admin") {
    return { success: false, error: "Само администратори могат да създават оферти." };
  }

  try {
    const data = toOfferData(parsed.data);
    const offer =
      id === undefined
        ? await payload.create({
            collection: "offers",
            // The signed-in user prepares the offer; `status` is filled in
            // by the collection's defaultValue.
            data: { ...data, preparedBy: user.id } as RequiredDataFromCollectionSlug<"offers">,
            user,
            overrideAccess: false,
          })
        : await payload.update({ collection: "offers", id, data, user, overrideAccess: false });

    revalidatePath("/website/offers");
    revalidatePath(`/website/offers/${offer.id}`);
    revalidatePath("/dashboard/offers");

    return { success: true, id: offer.id };
  } catch {
    return {
      success: false,
      error: "Възникна грешка при записа на офертата.",
    };
  }
}

async function createOffer(input: OfferFormValues): Promise<OfferFormResult> {
  return saveOffer(input);
}

async function updateOffer(id: number, input: OfferFormValues): Promise<OfferFormResult> {
  return saveOffer(input, id);
}

export { createOffer, updateOffer };
