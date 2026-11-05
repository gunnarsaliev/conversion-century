import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  PayloadRequest,
} from "payload";

import type { CmsCollection } from "./cache";

// Expires the cached public pages that read `tag` (see cmsCache). The
// 'max' profile serves the stale page while the fresh one renders in the
// background, so visitors never wait on Payload.
function expire(tag: CmsCollection) {
  try {
    revalidateTag(tag, "max");
  } catch {
    // Outside a Next.js server (seed/migrate scripts run through
    // scripts/payload-esm.mjs) there is no cache to expire.
  }
}

// The admin panel's autosave and "Save draft" send `?draft=true` and only write
// a new version, leaving the published row alone, so public pages can't have
// changed. Publishing sends `_status: 'published'` and unpublishing doesn't
// send `?draft=true`, so both still expire the cache.
function isDraftOnlySave(doc: { _status?: unknown }, req: PayloadRequest) {
  return doc._status === "draft" && String(req.query?.draft) === "true";
}

// Adds the hooks to a collection the public site reads, keeping any hooks
// it already has.
export function withCmsRevalidation(collection: CollectionConfig): CollectionConfig {
  const tag = collection.slug as CmsCollection;
  const afterChange: CollectionAfterChangeHook = ({ doc, context, req }) => {
    if (!context.disableRevalidate && !isDraftOnlySave(doc, req)) expire(tag);
    return doc;
  };
  const afterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
    if (!context.disableRevalidate) expire(tag);
    return doc;
  };
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), afterDelete],
    },
  };
}
