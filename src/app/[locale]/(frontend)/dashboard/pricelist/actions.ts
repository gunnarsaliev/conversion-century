"use server";

import { revalidatePath } from "next/cache";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdmin } from "@/lib/roles";

// ---------------------------------------------------------------------------
// Service hourly rates (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Updates Services.price — the hourly rate offers are priced with. Offer
// prices are computed on read, so changed rates reprice every offer that
// uses the service (unless it has a fixed price).

const updatesSchema = (negativeMessage: string) =>
  z.array(
    z.object({
      id: z.number().int(),
      // null clears the rate.
      price: z.number().min(0, negativeMessage).nullable(),
    }),
  );

type UpdateServicePricesResult =
  | { success: true }
  | { success: false; error: string };

async function updateServicePrices(
  updates: { id: number; price: number | null }[],
): Promise<UpdateServicePricesResult> {
  const t = await getDashboardTranslations("PriceList");
  const tCommon = await getDashboardTranslations("Common");
  const parsed = updatesSchema(t("errors.negative")).safeParse(updates);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? tCommon("invalidInput"),
    };
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });

  if (!isAdmin(user)) {
    return { success: false, error: t("adminOnly") };
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
    revalidatePath("/offers");

    return { success: true };
  } catch {
    return {
      success: false,
      error: t("errors.save"),
    };
  }
}

export { updateServicePrices };
