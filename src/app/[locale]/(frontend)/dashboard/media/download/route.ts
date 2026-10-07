import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { getMediaFiles, MEDIA_SIZES, type MediaSize } from "@/lib/media-files";

// Media lives on a different origin (R2), where the `download` attribute on
// an <a> is ignored by browsers. Proxy the file through here so it's served
// with `Content-Disposition: attachment` and saves instead of opening.
export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const size = (searchParams.get("size") ?? "original") as MediaSize;
  if (!Number.isInteger(id) || !MEDIA_SIZES.includes(size)) {
    return new Response("Bad request", { status: 400 });
  }

  const doc = await payload
    .findByID({ collection: "media", id, depth: 0 })
    .catch(() => null);
  const file = doc ? getMediaFiles(doc).find((f) => f.size === size) : null;
  if (!file) return new Response("Not found", { status: 404 });

  // Payload's own relative URLs (local storage) need an absolute base.
  const upstream = await fetch(new URL(file.url, request.url));
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream file unavailable", { status: 502 });
  }

  const filename = file.filename.replace(/["\\\r\n]/g, "");
  return new Response(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      ...(upstream.headers.get("content-length")
        ? { "Content-Length": upstream.headers.get("content-length")! }
        : {}),
      "Cache-Control": "private, no-store",
    },
  });
}
