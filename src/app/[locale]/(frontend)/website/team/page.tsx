import { getPayload } from "payload";
import config from "@payload-config";

import { Team39 } from "@/components/team39";
import type { Media } from "../../../../../../payload-types";

export default async function TeamPage() {
  const payload = await getPayload({ config });

  const { docs: users } = await payload.find({
    collection: "users",
    where: {
      profileImage: { exists: true },
    },
    depth: 1,
    limit: 100,
    // Local API calls bypass access control by default, which is what we
    // want here: Users' `read` access is gated to logged-in users (it's
    // an internal collection), but a public team page still needs to
    // read name/role/photo for members who've opted into having one.
  });

  // Featured members are shown first, in this exact order; everyone else
  // with a profile picture follows in whatever order Payload returned them.
  const featuredOrder = [2, 5, 3, 1];

  const withImages = users.filter(
    (user): user is typeof user & { profileImage: Media } =>
      typeof user.profileImage === "object" &&
      user.profileImage !== null &&
      !!user.profileImage.url,
  );

  const sortedUsers = [...withImages].sort((a, b) => {
    const aIndex = featuredOrder.indexOf(a.id);
    const bIndex = featuredOrder.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const members = sortedUsers.map((user) => ({
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    role: user.jobTitle ?? "",
    image: user.profileImage.url as string,
  }));

  return (
    <Team39
      heading="Meet the team behind your growth"
      description="Real people, real SEO expertise - get to know who works on your account."
      members={members}
    />
  );
}
