"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import type { JobApplicant } from "../../../../../../payload-types";

// ---------------------------------------------------------------------------
// Job application (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Public visitors aren't allowed to create job-applicants through the REST
// API (admin-only access), so the form submits here and the local API
// creates the entry server-side, where access control is bypassed.

const applicationFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Please enter a valid email"),
  message: z.string().trim().min(1, "Please tell us why you want to learn SEO"),
});

type ApplicationFormResult =
  | { success: true }
  | { success: false; error: string };

// The textarea is plain text, but `message` is a Lexical rich text field —
// turn each non-empty line into its own paragraph.
function toLexical(text: string): NonNullable<JobApplicant["message"]> {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          textFormat: 0,
          children: [
            {
              type: "text",
              text: line,
              format: 0,
              style: "",
              mode: "normal",
              detail: 0,
              version: 1,
            },
          ],
        })),
    },
  };
}

async function submitJobApplication(
  formData: FormData,
): Promise<ApplicationFormResult> {
  const parsed = applicationFormSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const payload = await getPayload({ config });
    const { fullName, email, message } = parsed.data;

    await payload.create({
      collection: "job-applicants",
      data: {
        fullName,
        email,
        status: "new",
        message: toLexical(message),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit job application", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export { submitJobApplication };
export type { ApplicationFormResult };
