"use server";

import { revalidatePath } from "next/cache";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Service hourly rates (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Updates Services.price — the hourly rate offers are priced with. Offer
// prices are computed on read, so changed rates reprice every offer that
// uses the service (unless it has a fixed price).

const updatesSchema = z.array(
  z.object({
    id: z.number().int(),
    // null clears the rate.
    price: z.number().min(0, "Rates can't be negative").nullable(),
  }),
);

type UpdateServicePricesResult =
  | { success: true }
  | { success: false; error: string };

async function updateServicePrices(
  updates: { id: number; price: number | null }[],
): Promise<UpdateServicePricesResult> {
  const parsed = updatesSchema.safeParse(updates);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });

  if (user?.role !== "admin") {
    return { success: false, error: "Only admins can change rates." };
  }

  try {
    for (const { id, price } of parsed.data) {
      await payload.update({
        collection: "services",
        id,
        data: { price },
        user,
        overrideAccess: false,
      });
    }

    revalidatePath("/dashboard/pricelist");
    revalidatePath("/dashboard/offers");
    revalidatePath("/website/offers");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong while saving the rates.",
    };
  }
}

export { updateServicePrices };
