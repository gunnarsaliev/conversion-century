import { z } from "zod";

import { VALIDITY_WEEKS } from "@/collections/Offers";

// ---------------------------------------------------------------------------
// Offer form schema
// ---------------------------------------------------------------------------
//
// Shared by the OfferForm component (client-side validation) and the
// createOffer / updateOffer server actions (which re-validate). Mirrors the
// writable fields of src/collections/Offers.ts; `hours` and `price` are
// virtual there, so the form only previews them.

export const metricsSources = ["manual", "ahrefs", "semrush", "other"] as const;

// Empty number inputs hold `undefined`; required ones only accept a number
// on submit, so the form can start with blank rows.
const requiredNumber = (message: string) =>
  z.number().optional().pipe(z.number({ error: message }));

const optionalCount = z.number().int().min(0, "Не може да е отрицателно").optional();

// "YYYY-MM-DD", the value of <input type="date">.
const day = (message: string) => z.iso.date({ error: message });

export const offerFormSchema = z
  .object({
    client: requiredNumber("Изберете клиент"),
    date: day("Въведете дата"),
    validUntil: day("Въведете валидност"),
    services: z.array(
      z.object({
        service: requiredNumber("Изберете услуга"),
        hours: requiredNumber("Въведете часове").pipe(z.number().min(0, "Не може да е отрицателно")),
      }),
    ),
    fixedPrice: z.number().min(0, "Не може да е отрицателна").optional(),
    // Percentage taken off the price.
    discount: z
      .number()
      .min(0, "Не може да е отрицателна")
      .max(100, "Максимум 100%")
      .optional(),
    // Plain text; each line becomes a paragraph of the rich text field.
    description: z.string().trim().optional(),
    metrics: z.object({
      source: z.enum(metricsSources),
      date: day("Въведете дата").optional().or(z.literal("")),
      domainRating: optionalCount.pipe(z.number().max(100, "Максимум 100").optional()),
      backlinks: optionalCount,
      organicKeywords: optionalCount,
      organicTraffic: optionalCount,
    }),
    keywords: z.array(
      z.object({
        keyword: z.string().trim().min(1, "Въведете ключова дума"),
        position: requiredNumber("Въведете позиция").pipe(z.number().int().min(1, "Минимум 1")),
        volume: requiredNumber("Въведете търсения").pipe(z.number().int().min(0, "Не може да е отрицателно")),
      }),
    ),
  })
  .refine((values) => values.validUntil >= values.date, {
    path: ["validUntil"],
    message: "Трябва да е след датата на офертата",
  })
  .refine((values) => values.services.length > 0 || values.fixedPrice !== undefined, {
    path: ["services"],
    message: "Добавете поне една услуга или фиксирана цена",
  });

/** What the form holds while editing (blank numbers are `undefined`). */
export type OfferFormInput = z.input<typeof offerFormSchema>;
/** What a valid submit produces. */
export type OfferFormValues = z.output<typeof offerFormSchema>;

const toDay = (date: Date) => date.toISOString().slice(0, 10);

// Offers.ts adds VALIDITY_WEEKS to the offer date by default.
export const addValidity = (day: string) =>
  toDay(new Date(new Date(day).getTime() + VALIDITY_WEEKS * 7 * 24 * 60 * 60 * 1000));

/** A new offer: dated today, valid for VALIDITY_WEEKS, one blank service row. */
export const emptyOfferFormValues = (): OfferFormInput => {
  const today = toDay(new Date());
  return {
    client: undefined,
    date: today,
    validUntil: addValidity(today),
    services: [{ service: undefined, hours: undefined }],
    fixedPrice: undefined,
    discount: undefined,
    description: "",
    metrics: {
      source: "manual",
      date: today,
      domainRating: undefined,
      backlinks: undefined,
      organicKeywords: undefined,
      organicTraffic: undefined,
    },
    keywords: [],
  };
};

/** Clients and services the form's selects choose from. */
export type OfferFormOptions = {
  /** `image` is the client's logo; `description` its website and contact. */
  clients: { value: number; label: string; image?: string; description?: string[] }[];
  /** `rate` is the service's hourly price, for the price preview. */
  services: { value: number; label: string; rate: number | null }[];
};
