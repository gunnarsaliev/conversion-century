import { headers as getHeaders } from "next/headers";
import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { DashboardOverview } from "@/components/dashboard/overview";
import { getDismissedBanners } from "@/lib/banner-dismissal";
import { getTeamCelebrations } from "@/lib/celebrations";
import { LEAD_STATUSES } from "@/lib/client-status";

// Offers: draft → sent → accepted / declined. "Sent" counts every offer that
// left draft. Clients: consultation (website form) → lead → client (any
// non-lead status, as on Dashboard → Clients).
export default async function Dashboard() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  const offerCount = (where?: Where) =>
    payload.count({ collection: "offers", where }).then(({ totalDocs }) => totalDocs);
  const clientCount = (where: Where) =>
    payload.count({ collection: "clients", where }).then(({ totalDocs }) => totalDocs);

  const [
    fullUser,
    created,
    sent,
    accepted,
    pending,
    declined,
    consultations,
    leads,
    clients,
    latestInquiries,
    teamMembers,
  ] = await Promise.all([
    user
      ? payload.findByID({ collection: "users", id: user.id, depth: 0 }).catch(() => null)
      : null,
    offerCount(),
    offerCount({ status: { in: ["sent", "accepted", "declined"] } }),
    offerCount({ status: { equals: "accepted" } }),
    offerCount({ status: { equals: "sent" } }),
    offerCount({ status: { equals: "declined" } }),
    clientCount({ status: { equals: "consultation" } }),
    clientCount({ status: { equals: "lead" } }),
    clientCount({ status: { not_in: [...LEAD_STATUSES] } }),
    payload.find({
      collection: "clients",
      where: { status: { equals: "consultation" } },
      select: {
        companyName: true,
        contactName: true,
        email: true,
        websiteLinks: true,
        notes: true,
        createdAt: true,
      },
      sort: "-createdAt",
      depth: 0,
      limit: 3,
    }),
    // Everyone not marked inactive, for today's birthday / work anniversary banners.
    payload.find({
      collection: "users",
      where: {
        and: [
          { status: { not_equals: "inactive" } },
          { or: [{ birthday: { exists: true } }, { workBirthday: { exists: true } }] },
        ],
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        birthday: true,
        workBirthday: true,
      },
      depth: 0,
      pagination: false,
    }),
  ]);

  // Banners this user closed stay closed for them (see lib/banner-dismissal).
  const dismissedBanners = getDismissedBanners(fullUser?.dismissedBanners);
  const celebrations = getTeamCelebrations(teamMembers.docs, user?.id).filter(
    (celebration) => !dismissedBanners.has(celebration.id),
  );

  const userName =
    [fullUser?.firstName, fullUser?.lastName].filter(Boolean).join(" ") || user?.email;

  return (
    <DashboardOverview
      userName={userName}
      celebrations={celebrations}
      offers={{ created, sent, accepted, pending, declined }}
      pipeline={{ consultations, leads, clients }}
      inquiries={latestInquiries.docs.map((doc) => ({
        id: doc.id,
        companyName: doc.companyName,
        contactName: doc.contactName ?? undefined,
        email: doc.email ?? undefined,
        website: doc.websiteLinks?.[0]?.url?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        message: doc.notes ?? undefined,
        createdAt: doc.createdAt,
      }))}
    />
  );
}
