"use client";

import {
  Eye,
  Mail,
  MoreVertical,
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
import { AccountManagerBadge } from "@/components/dashboard/account-manager-badge";
import { ClientFormDrawer } from "@/components/dashboard/client-form-drawer";
import { ClientLogo } from "@/components/dashboard/client-logo";
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
  accountManagerId?: string | number | null;
  accountManagerName?: string | null;
  accountManagerAvatarUrl?: string | null;
  services?: string[];
};

type ClientQuickViewProps = {
  client: ClientQuickViewData;
  trigger: React.ReactElement;
};

const ClientQuickView = ({ client, trigger }: ClientQuickViewProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
                  <ClientFormDrawer
                    mode="edit"
                    client={client}
                    trigger={
                      <DropdownMenuItem
                        render={<button type="button" />}
                        nativeButton
                        onClick={(event) => event.preventDefault()}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </DropdownMenuItem>
                    }
                  />
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
                {client.accountManagerName && (
                  <span className="flex items-center gap-1.5">
                    managed by
                    <AccountManagerBadge
                      id={client.accountManagerId}
                      name={client.accountManagerName}
                      avatarUrl={client.accountManagerAvatarUrl}
                    />
                  </span>
                )}
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { ClientQuickView, Eye };
export type { ClientQuickViewData };
