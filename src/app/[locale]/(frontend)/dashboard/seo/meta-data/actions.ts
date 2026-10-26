"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdminOrEditor } from "@/lib/roles";
import { SEO_COLLECTION_SLUGS } from "@/lib/seo/collection-meta";
import { SEO_PAGE_KEYS } from "@/lib/seo/page-keys";

// ---------------------------------------------------------------------------
// Meta title / description (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// One action for both kinds of entry on Dashboard → SEO → Meta data:
// - `page`: a static or docs page, stored in the `page-meta` collection
//   (one doc per page, created on first save).
// - `collection`: a collection doc's own `meta` group, updated in place.
// Both locales are written in one call. An empty field is saved as null, so
// the page falls back to its default. Admins and editors only; the session
// is checked here, not trusted from the client.

const text = z.string().trim().max(500).optional().default("");

const valuesSchema = z.object({
  en: z.object({ title: text, description: text }),
  bg: z.object({ title: text, description: text }),
});

const targetSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("page"), page: z.enum(SEO_PAGE_KEYS) }),
  z.object({
    kind: z.literal("collection"),
    collection: z.enum(SEO_COLLECTION_SLUGS),
    id: z.union([z.number(), z.string()]),
  }),
]);

export type MetaTarget = z.input<typeof targetSchema>;
export type MetaValues = z.input<typeof valuesSchema>;

type SaveMetaResult = { success: true } | { success: false; error: string };

const LOCALES = ["en", "bg"] as const;
type Locale = (typeof LOCALES)[number];
type Pair = { title: string; description: string };

const orNull = (value: string) => value || null;

// `{ en, bg }` from a localized field read with `locale: "all"`.
function localizedPair(title: unknown, description: unknown): Record<Locale, Pair> {
  const pick = (value: unknown, locale: Locale) =>
    value && typeof value === "object" ? String((value as Record<string, unknown>)[locale] ?? "") : "";
  return {
    en: { title: pick(title, "en"), description: pick(description, "en") },
    bg: { title: pick(title, "bg"), description: pick(description, "bg") },
  };
}

const samePair = (a: Pair, b: Pair) => a.title === b.title && a.description === b.description;

async function saveMeta(target: MetaTarget, values: MetaValues): Promise<SaveMetaResult> {
  const t = await getDashboardTranslations("Seo.metaData.errors");

  const user = await getDashboardUser();
  if (!user) return { success: false, error: t("signedOut") };
  if (!isAdminOrEditor(user)) return { success: false, error: t("forbidden") };

  const parsedTarget = targetSchema.safeParse(target);
  const parsedValues = valuesSchema.safeParse(values);
  if (!parsedTarget.success || !parsedValues.success) {
    return { success: false, error: t("invalid") };
  }
  const next = parsedValues.data;

  try {
    const payload = await getPayload({ config });
    const target = parsedTarget.data;

    if (target.kind === "page") {
      const { docs } = await payload.find({
        collection: "page-meta",
        where: { page: { equals: target.page } },
        locale: "all",
        depth: 0,
        limit: 1,
      });
      let id = docs[0]?.id;

      // Back to the defaults in both languages: drop the override entirely.
      if (LOCALES.every((locale) => !next[locale].title && !next[locale].description)) {
        if (id) await payload.delete({ collection: "page-meta", id, user });
      } else {
        const current = localizedPair(docs[0]?.title, docs[0]?.description);
        for (const locale of LOCALES) {
          if (id && samePair(current[locale], next[locale])) continue;
          const data = {
            title: orNull(next[locale].title),
            description: orNull(next[locale].description),
          };
          if (id) {
            await payload.update({ collection: "page-meta", id, locale, data, user });
          } else {
            id = (
              await payload.create({
                collection: "page-meta",
                locale,
                data: { page: target.page, ...data },
                user,
              })
            ).id;
          }
        }
      }
    } else {
      const doc = await payload.findByID({
        collection: target.collection,
        id: target.id,
        locale: "all",
        depth: 0,
        select: { meta: true },
      });
      const meta = (doc as { meta?: { title?: unknown; description?: unknown } }).meta;
      const current = localizedPair(meta?.title, meta?.description);

      // Only locales that changed are written: an update validates the whole
      // doc in that locale, so an untouched locale with missing required
      // fields (e.g. not yet translated) must not block saving the other.
      for (const locale of LOCALES) {
        if (samePair(current[locale], next[locale])) continue;
        await payload.update({
          collection: target.collection,
          id: target.id,
          locale,
          // Only the meta group is sent; the rest of the doc is unchanged.
          data: {
            meta: {
              title: orNull(next[locale].title),
              description: orNull(next[locale].description),
            },
          },
          user,
        });
      }
    }
  } catch {
    return { success: false, error: t("save") };
  }

  // Public pages render per request; this only drops any cached copies.
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/seo/meta-data");
  revalidatePath("/dashboard/seo");

  return { success: true };
}

export { saveMeta };
