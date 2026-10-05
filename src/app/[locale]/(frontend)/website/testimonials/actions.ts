"use server";

import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Testimonial submission (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Testimonials are admin-only over REST, so the public form submits here and
// the local API creates a `pending` entry server-side. An admin approves it
// in Payload, which copies it onto the client (see collections/Testimonials).

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const baseSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  testimonial: z.string().trim().min(10, "Please write a few words for your testimonial"),
});

const submissionSchema = z.discriminatedUnion("clientType", [
  baseSchema.extend({
    clientType: z.literal("existing"),
    clientId: z.coerce.number({ error: "Please choose your company" }).int().positive("Please choose your company"),
  }),
  baseSchema.extend({
    clientType: z.literal("new"),
    companyName: z.string().trim().min(1, "Please enter your company name"),
    role: optionalText,
    website: optionalText
      // Accept "example.com" as well as full URLs.
      .transform((value) =>
        value && !/^https?:\/\//i.test(value) ? `https://${value}` : value,
      )
      .pipe(z.string().url("Please enter a valid website URL").optional()),
  }),
]);

type TestimonialFormResult =
  | { success: true }
  | { success: false; error: string };

// Returns the uploaded file, nothing (field left empty), or an error message.
function readImage(value: FormDataEntryValue | null, label: string): File | null | string {
  if (!(value instanceof File) || value.size === 0) return null;
  if (!value.type.startsWith("image/")) return `${label} must be an image.`;
  if (value.size > MAX_IMAGE_BYTES) return `${label} must be 2 MB or smaller.`;
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

  const parsed = submissionSchema.safeParse({
    clientType: formData.get("clientType"),
    name: formData.get("name"),
    email: formData.get("email"),
    testimonial: formData.get("testimonial"),
    clientId: formData.get("clientId") || undefined,
    companyName: formData.get("companyName") ?? undefined,
    role: formData.get("role") ?? undefined,
    website: formData.get("website") ?? undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const profileImage = readImage(formData.get("profileImage"), "Profile photo");
  const logo =
    parsed.data.clientType === "new" ? readImage(formData.get("logo"), "Company logo") : null;
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
        return { success: false, error: "Please choose your company from the list." };
      }
    }

    const profileImageId = profileImage
      ? await uploadImage(payload, profileImage, data.name)
      : undefined;

    if (data.clientType === "existing") {
      await payload.create({
        collection: "testimonials",
        data: {
          name: data.name,
          email: data.email,
          testimonial: data.testimonial,
          profileImage: profileImageId,
          clientType: "existing",
          client: data.clientId,
          status: "pending",
        },
      });
    } else {
      const logoId = logo ? await uploadImage(payload, logo, data.companyName) : undefined;
      await payload.create({
        collection: "testimonials",
        data: {
          name: data.name,
          email: data.email,
          testimonial: data.testimonial,
          profileImage: profileImageId,
          clientType: "new",
          newClient: {
            companyName: data.companyName,
            role: data.role,
            website: data.website,
            logo: logoId,
          },
          status: "pending",
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit testimonial", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export { submitTestimonial };
export type { TestimonialFormResult };
