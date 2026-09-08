import { Bell, ChevronRight, LayoutDashboard, Plus, Search } from "lucide-react";
import { getPayload } from "payload";
import config from "@payload-config";

import { ClientList, type ClientListItem } from "@/components/dashboard/client-list";
import { Button } from "@/components/ui/button";

export default async function LeadsPage() {
  const payload = await getPayload({ config });
  const leads = await payload.find({
    collection: "clients",
    where: { status: { equals: "lead" } },
    depth: 2,
    limit: 100,
  });

  const leadListItems: ClientListItem[] = leads.docs.map((client) => {
    const accountManager =
      client["Account Manager"] && typeof client["Account Manager"] === "object"
        ? client["Account Manager"]
        : null;

    const services = (client.services ?? [])
      .filter(
        (service): service is Exclude<typeof service, string | number> =>
          typeof service === "object" && service !== null,
      )
      .map((service) => service.name);

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
      accountManagerName: accountManager
        ? [accountManager.firstName, accountManager.lastName]
            .filter(Boolean)
            .join(" ") || accountManager.email
        : null,
      services,
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
            <span className="text-foreground">Leads</span>
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
              Leads
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track prospective clients before they convert
            </p>
          </div>
          <Button className="h-9 gap-1.5 px-3 text-sm">
            <Plus className="size-3.5" aria-hidden="true" />
            New Lead
          </Button>
        </div>
      </section>

      <ClientList clients={leadListItems} />
    </>
  );
}
