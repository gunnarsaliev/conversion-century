import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from "payload";

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

// Adds the hooks to a collection the public site reads, keeping any hooks
// it already has.
export function withCmsRevalidation(collection: CollectionConfig): CollectionConfig {
  const tag = collection.slug as CmsCollection;
  const afterChange: CollectionAfterChangeHook = ({ doc, context }) => {
    if (!context.disableRevalidate) expire(tag);
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
