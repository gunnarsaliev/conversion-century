"use server";

import { getTranslations } from "next-intl/server";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { plainTextToLexical } from "@/lib/plain-text-to-lexical";
import type { Testimonial } from "../../../../../payload-types";

// ---------------------------------------------------------------------------
// Testimonial submission (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Testimonials are admin-only over REST, so the public form submits here and
// the local API creates a `pending` entry server-side. An admin approves it
// in Payload, which links it to the client and a contact (see
// collections/Testimonials).

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

type Translator = Awaited<ReturnType<typeof getTranslations>>;

const submissionSchema = (t: Translator) => {
  const baseSchema = z.object({
    name: z.string().trim().min(1, t("TestimonialForm.errors.name")),
    email: z
      .union([z.literal(""), z.string().trim().email(t("TestimonialForm.errors.email"))])
      .optional()
      .transform((value) => value || undefined),
    testimonial: z.string().trim().min(10, t("TestimonialForm.errors.testimonial")),
  });

  return z.discriminatedUnion("clientType", [
    baseSchema.extend({
      clientType: z.literal("existing"),
      clientId: z.coerce
        .number({ error: t("TestimonialForm.errors.company") })
        .int()
        .positive(t("TestimonialForm.errors.company")),
    }),
    baseSchema.extend({
      clientType: z.literal("new"),
      companyName: z.string().trim().min(1, t("TestimonialForm.errors.companyName")),
      role: optionalText,
      website: optionalText
        // Accept "example.com" as well as full URLs.
        .transform((value) =>
          value && !/^https?:\/\//i.test(value) ? `https://${value}` : value,
        )
        .pipe(z.string().url(t("TestimonialForm.errors.website")).optional()),
    }),
  ]);
};

type TestimonialFormResult =
  | { success: true }
  | { success: false; error: string };

// Returns the uploaded file, nothing (field left empty), or an error message.
function readImage(
  t: Translator,
  value: FormDataEntryValue | null,
  label: string,
): File | null | string {
  if (!(value instanceof File) || value.size === 0) return null;
  if (!value.type.startsWith("image/")) return t("TestimonialForm.errors.notImage", { label });
  if (value.size > MAX_IMAGE_BYTES) return t("TestimonialForm.errors.tooLarge", { label });
  return value;
}

async function uploadImage(payload: Payload, file: File, alt: string) {
  const media = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: Buffer.from(await file.arrayBuffer()),
      mimetype: file.type,
      name: file.name,
      size: file.size,
    },
  });
  return media.id;
}

async function submitTestimonial(formData: FormData): Promise<TestimonialFormResult> {
  // Honeypot: real visitors never see or fill this field. Pretend it worked
  // so bots don't learn to skip it.
  if (formData.get("website_url")) return { success: true };

  const t = await getTranslations();
  const parsed = submissionSchema(t).safeParse({
    clientType: formData.get("clientType"),
    name: formData.get("name"),
    email: formData.get("email") ?? undefined,
    testimonial: formData.get("testimonial"),
    clientId: formData.get("clientId") || undefined,
    companyName: formData.get("companyName") ?? undefined,
    role: formData.get("role") ?? undefined,
    website: formData.get("website") ?? undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? t("Forms.invalidInput") };
  }

  const profileImage = readImage(
    t,
    formData.get("profileImage"),
    t("TestimonialForm.profilePhoto"),
  );
  const logo =
    parsed.data.clientType === "new"
      ? readImage(t, formData.get("logo"), t("TestimonialForm.companyLogo"))
      : null;
  if (typeof profileImage === "string") return { success: false, error: profileImage };
  if (typeof logo === "string") return { success: false, error: logo };

  try {
    const payload = await getPayload({ config });
    const data = parsed.data;

    // Only clients already public on the website are offered in the form,
    // so never trust a posted id that isn't one of them.
    if (data.clientType === "existing") {
      const { totalDocs } = await payload.count({
        collection: "clients",
        where: { id: { equals: data.clientId }, showOnWebsite: { equals: true } },
      });
      if (totalDocs === 0) {
        return { success: false, error: t("TestimonialForm.errors.chooseCompany") };
      }
    }

    const profileImageId = profileImage
      ? await uploadImage(payload, profileImage, data.name)
      : undefined;

    const submission = {
      testimonial: plainTextToLexical(data.testimonial) as Testimonial["testimonial"],
      status: "pending" as const,
      source: "website" as const,
      submittedBy: {
        name: data.name,
        email: data.email,
        role: data.clientType === "new" ? data.role : undefined,
        profileImage: profileImageId,
      },
    };

    if (data.clientType === "existing") {
      await payload.create({
        collection: "testimonials",
        data: { ...submission, client: data.clientId },
      });
    } else {
      const logoId = logo ? await uploadImage(payload, logo, data.companyName) : undefined;
      await payload.create({
        collection: "testimonials",
        data: {
          ...submission,
          newClient: {
            companyName: data.companyName,
            website: data.website,
            logo: logoId,
          },
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit testimonial", error);
    return { success: false, error: t("Forms.genericError") };
  }
}

export { submitTestimonial };
export type { TestimonialFormResult };
