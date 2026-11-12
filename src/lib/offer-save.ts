import { revalidatePath } from "next/cache";
import { getPayload, type RequiredDataFromCollectionSlug } from "payload";
import config from "@payload-config";

import { offerFormSchema, type OfferFormValues } from "@/lib/offer-form";
import { isAdmin } from "@/lib/roles";
import type { Offer as OfferDoc, User } from "../../payload-types";

// ---------------------------------------------------------------------------
// Offer create / update (Payload local API)
// ---------------------------------------------------------------------------
//
// Shared by the offer form's server actions (dashboard/offers/actions.ts) and
// the chatbot's route (src/app/api/agent/offers/route.ts). Runs as the given
// user with `overrideAccess: false`, so the Offers collection's access rules
// (admins only) apply. Status and "Оферта от" aren't part of the input: new
// offers get the default status ("draft") and the user as preparer; updates
// keep both as they are.

export type OfferSaveResult =
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

/** Creates an offer (or updates offer `id`) as `user`, who must be an admin. */
export async function saveOfferAs(
  user: User | null | undefined,
  input: unknown,
  id?: number,
): Promise<OfferSaveResult> {
  const parsed = offerFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Невалидни данни",
    };
  }

  if (!isAdmin(user)) {
    return { success: false, error: "Само администратори могат да създават оферти." };
  }

  try {
    const payload = await getPayload({ config });
    const data = toOfferData(parsed.data);
    const offer =
      id === undefined
        ? await payload.create({
            collection: "offers",
            // The given user prepares the offer; `status` is filled in by
            // the collection's defaultValue.
            data: { ...data, preparedBy: user.id } as RequiredDataFromCollectionSlug<"offers">,
            user,
            overrideAccess: false,
          })
        : await payload.update({ collection: "offers", id, data, user, overrideAccess: false });

    revalidatePath(`/offers/${offer.id}`);
    revalidatePath("/dashboard/offers");

    return { success: true, id: offer.id };
  } catch {
    return {
      success: false,
      error: "Възникна грешка при записа на офертата.",
    };
  }
}
