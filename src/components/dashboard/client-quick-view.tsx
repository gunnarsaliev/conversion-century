"use client";

import {
  CheckCircle2,
  Circle,
  CircleDashed,
  Eye,
  FileText,
  KeyRound,
  Link as LinkIcon,
  Link2,
  Mail,
  MoreVertical,
  Newspaper,
  Pencil,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { deleteClient } from "@/app/[locale]/(frontend)/dashboard/clients/actions";
import { ClientFormDrawer } from "@/components/dashboard/client-form-drawer";
import { ClientLogo } from "@/components/dashboard/client-logo";
import { PersonAvatarGroup, type Person } from "@/components/dashboard/person-avatar-group";
import { regionLabel } from "@/lib/regions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Client quick view (drawer)
// ---------------------------------------------------------------------------
//
// Sheet-based drawer adapted from feedback1.tsx's layout (header with close
// button, scrollable body, footer) for previewing a client without leaving
// the list.

const statusBadgeClassName: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  lead: "bg-amber-100 text-amber-800",
  inactive: "bg-muted text-muted-foreground",
};

type ClientLink = {
  id?: string | number | null;
  url?: string | null;
};

type ChecklistSummary = {
  id: string | number;
  name: string;
  status: string;
};

type ClientQuickViewData = {
  id: string | number;
  companyName: string;
  logoUrl?: string | null;
  logoWidth?: number | null;
  logoHeight?: number | null;
  status: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  accountManagers?: Person[];
  publishers?: Person[];
  copywriters?: Person[];
  services?: string[];
  regions?: string[];
  websiteLinks?: ClientLink[];
  websiteLoginLinks?: ClientLink[];
  reportUrls?: ClientLink[];
  linkBuildingDocsUrl?: string | null;
  blogDocsUrl?: string | null;
  checklist?: ChecklistSummary[];
  checklistDoneCount?: number;
  checklistTotalCount?: number;
};

type ClientQuickViewProps = {
  client: ClientQuickViewData;
  trigger: React.ReactElement;
};

const ClientQuickView = ({ client, trigger }: ClientQuickViewProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const basePath =
    client.status === "lead" ? "/dashboard/leads" : "/dashboard/clients";

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete ${client.companyName}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteClient(client.id);
    setIsDeleting(false);

    if (!result.success) {
      window.alert(result.error);
      return;
    }

    setOpen(false);
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger} />
      <SheetContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="gap-0"
      >
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">Client Quick View</SheetTitle>
          <SheetClose render={<Button size="icon" variant="secondary" />}>
            <X />
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto">
          {/* Cover band */}
          <div className="relative h-24 bg-muted">
            <Image
              src="https://pub-05efc1b2acd64b71beacdf66eed34654.r2.dev/banner-fallback.jpg"
              alt=""
              fill
              sizes="(min-width: 640px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="relative px-5 pb-5">
            {/* Logo — overlapping cover, actions menu top-right */}
            <div className="-mt-10 mb-3 flex items-end justify-between">
              <div className="rounded-md border-4 border-card bg-card">
                <ClientLogo
                  companyName={client.companyName}
                  logoUrl={client.logoUrl}
                  logoWidth={client.logoWidth}
                  logoHeight={client.logoHeight}
                  size={80}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0"
                      aria-label="Client actions"
                    />
                  }
                >
                  <MoreVertical className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    {isDeleting ? "Deleting…" : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Controlled separately from the dropdown menu — nesting a
                  Dialog trigger's own click handling inside a Menu item
                  isn't a supported composition (see Base UI's Menu docs,
                  "Open a dialog"), so the drawer is opened imperatively
                  from a plain onClick above instead. */}
              <ClientFormDrawer
                mode="edit"
                client={client}
                open={editOpen}
                onOpenChange={setEditOpen}
              />
            </div>

            {/* Name and status */}
            <div className="space-y-1">
              <Link
                href={`${basePath}/${client.id}`}
                className="text-xl font-bold hover:underline"
              >
                {client.companyName}
              </Link>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <Badge
                  className={
                    statusBadgeClassName[client.status] ??
                    statusBadgeClassName.inactive
                  }
                >
                  <span className="capitalize">{client.status}</span>
                </Badge>
              </div>
            </div>

            {/* Contact name (bio-equivalent) */}
            {client.contactName ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Primary contact: {client.contactName}
              </p>
            ) : null}

            {/* Meta info */}
            {(client.email || client.phone) && (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {client.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Mail className="size-3.5" />
                    <span>{client.email}</span>
                  </a>
                )}
                {client.phone && (
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Phone className="size-3.5" />
                    <span>{client.phone}</span>
                  </a>
                )}
              </div>
            )}

            {/* Team (account managers / publishers / copywriters) */}
            {((client.accountManagers && client.accountManagers.length > 0) ||
              (client.publishers && client.publishers.length > 0) ||
              (client.copywriters && client.copywriters.length > 0)) && (
              <div className="mt-6 space-y-4 border-t pt-6">
                {client.accountManagers && client.accountManagers.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      Account Managers
                    </h3>
                    <PersonAvatarGroup people={client.accountManagers} />
                  </div>
                ) : null}

                {client.publishers && client.publishers.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Publishers</h3>
                    <PersonAvatarGroup people={client.publishers} />
                  </div>
                ) : null}

                {client.copywriters && client.copywriters.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Copywriters</h3>
                    <PersonAvatarGroup people={client.copywriters} />
                  </div>
                ) : null}
              </div>
            )}

            {/* Services (skills-equivalent) */}
            {client.services && client.services.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 text-sm font-medium">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {client.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Region */}
            {client.regions && client.regions.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 text-sm font-medium">Region</h3>
                <div className="flex flex-wrap gap-2">
                  {client.regions.map((region) => (
                    <Badge key={region} variant="outline">
                      {regionLabel(region)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Website / login / report / docs links */}
            {((client.websiteLinks && client.websiteLinks.length > 0) ||
              (client.websiteLoginLinks &&
                client.websiteLoginLinks.length > 0) ||
              (client.reportUrls && client.reportUrls.length > 0) ||
              client.linkBuildingDocsUrl ||
              client.blogDocsUrl) && (
              <div className="mt-6 space-y-4 border-t pt-6">
                {client.websiteLinks && client.websiteLinks.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      Website Links
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {client.websiteLinks.map((link, index) => (
                        <a
                          key={link.id ?? index}
                          href={link.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          title={link.url ?? undefined}
                          aria-label={link.url ?? "Website link"}
                          className="flex size-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <LinkIcon className="size-3.5" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {client.websiteLoginLinks &&
                client.websiteLoginLinks.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Login Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {client.websiteLoginLinks.map((link, index) => (
                        <a
                          key={link.id ?? index}
                          href={link.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          title={link.url ?? undefined}
                          aria-label={link.url ?? "Login link"}
                          className="flex size-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <KeyRound className="size-3.5" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {client.reportUrls && client.reportUrls.length > 0 ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Reports</h3>
                    <div className="flex flex-wrap gap-2">
                      {client.reportUrls.map((link, index) => (
                        <a
                          key={link.id ?? index}
                          href={link.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          title={link.url ?? undefined}
                          aria-label={link.url ?? "Report"}
                          className="flex size-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <FileText className="size-3.5" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {client.linkBuildingDocsUrl || client.blogDocsUrl ? (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Docs</h3>
                    <div className="flex flex-wrap gap-2">
                      {client.linkBuildingDocsUrl ? (
                        <a
                          href={client.linkBuildingDocsUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={client.linkBuildingDocsUrl}
                          aria-label="Link Building Docs"
                          className="flex size-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Link2 className="size-3.5" aria-hidden="true" />
                        </a>
                      ) : null}
                      {client.blogDocsUrl ? (
                        <a
                          href={client.blogDocsUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={client.blogDocsUrl}
                          aria-label="Blog Docs"
                          className="flex size-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Newspaper className="size-3.5" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Checklist summary */}
            {client.checklist && client.checklist.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 text-sm font-medium">
                  Checklist ({client.checklistDoneCount ?? 0}/
                  {client.checklistTotalCount ?? client.checklist.length}{" "}
                  done)
                </h3>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {client.checklist.map((entry) => (
                    <li key={entry.id} className="flex items-center gap-2">
                      {entry.status === "done" ? (
                        <CheckCircle2
                          className="size-3.5 shrink-0 text-emerald-600"
                          aria-hidden="true"
                        />
                      ) : entry.status === "in-progress" ? (
                        <CircleDashed
                          className="size-3.5 shrink-0 text-amber-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="size-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{entry.name}</span>
                    </li>
                  ))}
                </ul>
                {client.checklistTotalCount &&
                client.checklistTotalCount > client.checklist.length ? (
                  <Link
                    href={`${basePath}/${client.id}`}
                    className="mt-2 inline-block text-xs text-muted-foreground hover:underline"
                  >
                    View all {client.checklistTotalCount} items
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { ClientQuickView, Eye };
export type { ClientQuickViewData };
