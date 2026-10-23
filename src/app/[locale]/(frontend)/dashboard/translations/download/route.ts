import { strToU8, zipSync } from "fflate";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { isAdmin } from "@/lib/roles";
import { translatableCollections } from "@/lib/translations/core";
import { exportCollection } from "@/lib/translations/export";

// GET /dashboard/translations/download?collection=<slug>|all — the fields
// still missing a Bulgarian translation, as `<slug>.json` for one collection
// or a ZIP of every collection's file. Admins only.
export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (!isAdmin(user)) return new Response("Forbidden", { status: 403 });

  const requested = new URL(request.url).searchParams.get("collection") ?? "all";
  const slugs = translatableCollections(payload);
  const date = new Date().toISOString().slice(0, 10);

  if (requested !== "all") {
    if (!slugs.includes(requested)) return new Response("Not found", { status: 404 });
    const { file } = await exportCollection(payload, requested);
    return new Response(`${JSON.stringify(file, null, 2)}\n`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${requested}.json"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const files: Record<string, Uint8Array> = {};
  for (const slug of slugs) {
    const { file, summary } = await exportCollection(payload, slug);
    if (summary.fields > 0) files[`${slug}.json`] = strToU8(`${JSON.stringify(file, null, 2)}\n`);
  }

  return new Response(Buffer.from(zipSync(files)), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="translations-${date}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
