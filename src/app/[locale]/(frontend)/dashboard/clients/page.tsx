import { Bell, ChevronRight, LayoutDashboard, Plus, Search } from "lucide-react";
import { getPayload } from "payload";
import config from "@payload-config";

import { ClientFormDrawer } from "@/components/dashboard/client-form-drawer";
import { ClientList, type ClientListItem } from "@/components/dashboard/client-list";
import { Button } from "@/components/ui/button";
import type { User } from "../../../../../../payload-types";

export default async function ClientsPage() {
  const payload = await getPayload({ config });
  const clients = await payload.find({
    collection: "clients",
    where: { status: { not_equals: "lead" } },
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
      description: client.contactName ?? client.email ?? null,
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
      contactName: client.contactName,
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
    };
  });

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <LayoutDashboard className="size-3.5" aria-hidden="true" />
            <span>Overview</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">Clients</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Search"
            >
              <Search className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Clients
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your clients
            </p>
          </div>
          <ClientFormDrawer
            trigger={
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground outline-none transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                New Client
              </button>
            }
          />
        </div>
      </section>

      <ClientList clients={clientListItems} />
    </>
  );
}
