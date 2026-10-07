import { getPayload } from "payload";
import config from "@payload-config";

import { MediaHub } from "@/components/dashboard/media-hub";
import { MediaHubHeader } from "@/components/dashboard/media-hub-header";
import { toMediaHubItem } from "@/lib/media-files";

export default async function MediaPage() {
  const payload = await getPayload({ config });
  const media = await payload.find({
    collection: "media",
    depth: 0,
    limit: 500,
    sort: "-createdAt",
  });

  const items = media.docs.map((doc) => toMediaHubItem(doc));

  return (
    <>
      <MediaHubHeader
        active="all"
        count={media.totalDocs}
        description="Browse and download every image in the media library"
      />
      <MediaHub items={items} emptyMessage="No images have been uploaded yet." />
    </>
  );
}
