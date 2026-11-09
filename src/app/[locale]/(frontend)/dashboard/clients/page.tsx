import { Plus } from "lucide-react";
import { getPayload } from "payload";
import config from "@payload-config";

import { ClientFormDrawer } from "@/components/dashboard/client-form-drawer";
import { ClientList, type ClientListItem } from "@/components/dashboard/client-list";
import type { User } from "../../../../../../payload-types";
import { LEAD_STATUSES } from "@/lib/client-status";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { getClientFormOptions } from "@/lib/client-form-options";
import { toClientFormValues } from "@/lib/client-form-values";
import { primaryContactName } from "@/lib/primary-contact";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { PageHeaderBanner, bannerPrimaryActionClassName } from "@/components/dashboard/page-header-banner";

export default async function ClientsPage() {
  await requireDashboardUser();
  const t = await getDashboardTranslations("Clients");
  const payload = await getPayload({ config });
  const formOptions = await getClientFormOptions();
  const clients = await payload.find({
    collection: "clients",
    where: { status: { not_in: [...LEAD_STATUSES] } },
    depth: 2,
    limit: 100,
    joins: {
      // High limit so done/total counts are accurate for realistic
      // checklist sizes; the drawer only ever displays the first few
      // entries client-side.
      checklistProgress: {
        limit: 500,
        count: true,
      },
    },
  });

  const toPerson = (entry: number | User) => {
    if (typeof entry !== "object") return null;
    return {
      id: entry.id,
      name:
        [entry.firstName, entry.lastName].filter(Boolean).join(" ") ||
        entry.email,
      avatarUrl:
        entry.profileImage && typeof entry.profileImage === "object"
          ? entry.profileImage.url
          : null,
    };
  };

  const clientListItems: ClientListItem[] = clients.docs.map((client) => {
    const accountManagers = (client["Account Manager"] ?? [])
      .map(toPerson)
      .filter((person): person is NonNullable<typeof person> => person !== null);
    const publishers = (client["Publisher"] ?? [])
      .map(toPerson)
      .filter((person): person is NonNullable<typeof person> => person !== null);
    const copywriters = (client["Copywriter"] ?? [])
      .map(toPerson)
      .filter((person): person is NonNullable<typeof person> => person !== null);

    const services = (client.services ?? [])
      .filter(
        (service): service is Exclude<typeof service, string | number> =>
          typeof service === "object" && service !== null,
      )
      .map((service) => service.name);

    const checklistDocs = (client.checklistProgress?.docs ?? []).filter(
      (entry): entry is Exclude<typeof entry, number> =>
        typeof entry === "object" && entry !== null,
    );
    const checklist = checklistDocs
      .map((entry) => ({
        id: entry.id,
        status: entry.status,
        name:
          entry.checklistItem && typeof entry.checklistItem === "object"
            ? entry.checklistItem.name
            : null,
      }))
      .filter((entry) => Boolean(entry.name)) as {
      id: string | number;
      status: string;
      name: string;
    }[];

    return {
      id: client.id,
      companyName: client.companyName,
      description: primaryContactName(client) ?? client.email ?? null,
      logoUrl:
        client.logo && typeof client.logo === "object"
          ? client.logo.url
          : null,
      logoWidth:
        client.logo && typeof client.logo === "object"
          ? client.logo.width
          : null,
      logoHeight:
        client.logo && typeof client.logo === "object"
          ? client.logo.height
          : null,
      status: client.status,
      contactName: primaryContactName(client),
      email: client.email,
      phone: client.phone,
      accountManagers,
      publishers,
      copywriters,
      services,
      regions: client.region ?? [],
      websiteLinks: client.websiteLinks ?? [],
      websiteLoginLinks: client.websiteLoginLinks ?? [],
      reportUrls: client.reportUrls ?? [],
      linkBuildingDocsUrl: client["Link Building Docs"] ?? null,
      blogDocsUrl: client["Blog Docs"] ?? null,
      // Not-done items first so the quick view surfaces what's outstanding.
      checklist: [...checklist]
        .sort((a, b) => Number(a.status === "done") - Number(b.status === "done"))
        .slice(0, 5),
      checklistDoneCount: checklistDocs.filter(
        (entry) => entry.status === "done",
      ).length,
      checklistTotalCount: client.checklistProgress?.totalDocs ?? 0,
      formValues: toClientFormValues(client),
    };
  });

  return (
    <>
      <PageHeaderBanner
        title={t("title")}
        count={clients.totalDocs}
        description={t("description")}
        actions={
          <ClientFormDrawer
            options={formOptions}
            trigger={
              <button type="button" className={bannerPrimaryActionClassName}>
                <Plus className="size-4" aria-hidden="true" />
                {t("new")}
              </button>
            }
          />
        }
      />

      <ClientList clients={clientListItems} options={formOptions} />
    </>
  );
}
