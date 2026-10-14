import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

// Featured members are shown first on the team page, in this exact order.
export const FEATURED_TEAM_IDS = [2, 5, 3, 1];

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
};

// Team members with a profile photo, read from the `users` collection.
// Users' `read` access is gated to logged-in users; the local API bypasses
// it, so only the public fields (name, job title, photo) are returned.
//
// With `ids`, returns just those users in that order. Without, returns
// everyone with a photo, featured members first.
// Wrapped in React `cache` so repeated calls in one render share a query.
export const getTeamMembers = cache(
  async (ids?: readonly number[]): Promise<TeamMember[]> => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "users",
      where: {
        profileImage: { exists: true },
        ...(ids ? { id: { in: ids } } : {}),
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        jobTitle: true,
        profileImage: true,
      },
      // The media doc is populated in full on purpose: its `url` is built
      // from `filename`/`prefix` by the R2 storage adapter.
      depth: 1,
      limit: 100,
    });

    const members = docs.flatMap((user): TeamMember[] =>
      typeof user.profileImage === "object" && user.profileImage?.url
        ? [
            {
              id: user.id,
              name:
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.email,
              role: user.jobTitle ?? "",
              image: user.profileImage.url,
            },
          ]
        : [],
    );

    const order = ids ?? FEATURED_TEAM_IDS;
    return members.sort((a, b) => {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  },
);
