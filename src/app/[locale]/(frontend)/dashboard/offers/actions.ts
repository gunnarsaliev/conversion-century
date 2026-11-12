"use server";

import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import type { OfferFormValues } from "@/lib/offer-form";
import { saveOfferAs, type OfferSaveResult } from "@/lib/offer-save";

// ---------------------------------------------------------------------------
// Offer create / update (Server Actions)
// ---------------------------------------------------------------------------
//
// Saved as the signed-in user through src/lib/offer-save.ts, which validates
// the input and applies the Offers collection's access rules (admins only).

async function signedInUser() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  // Only team members (not MCP API keys, which Payload's types also allow).
  return user?.collection === "users" ? user : null;
}

async function createOffer(input: OfferFormValues): Promise<OfferSaveResult> {
  return saveOfferAs(await signedInUser(), input);
}

async function updateOffer(id: number, input: OfferFormValues): Promise<OfferSaveResult> {
  return saveOfferAs(await signedInUser(), input, id);
}

export { createOffer, updateOffer };
