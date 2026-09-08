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
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { deleteClient } from "@/app/[locale]/(frontend)/dashboard/clients/actions";
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
  accountManagerName?: string | null;
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
      <SheetContent showCloseButton={false} aria-describedby={undefined}>
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">Client Quick View</SheetTitle>
          <SheetClose render={<Button size="icon" variant="secondary" />}>
            <X />
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto px-5 pt-5 pb-5">
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`${basePath}/${client.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {client.companyName}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
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
              <div className="mt-1">
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
            <ClientLogo
              companyName={client.companyName}
              logoUrl={client.logoUrl}
              logoWidth={client.logoWidth}
              logoHeight={client.logoHeight}
              size={96}
            />
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            {client.contactName ? (
              <div>
                <dt className="text-muted-foreground">Contact</dt>
                <dd className="mt-0.5">{client.contactName}</dd>
              </div>
            ) : null}
            {client.email ? (
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <a href={`mailto:${client.email}`} className="hover:underline">
                    {client.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {client.phone ? (
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <a href={`tel:${client.phone}`} className="hover:underline">
                    {client.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {client.accountManagerName ? (
              <div>
                <dt className="text-muted-foreground">Account Manager</dt>
                <dd className="mt-0.5">{client.accountManagerName}</dd>
              </div>
            ) : null}
            {client.services && client.services.length > 0 ? (
              <div>
                <dt className="text-muted-foreground">Services</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {client.services.map((service) => (
                    <Badge key={service} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { ClientQuickView, Eye };
export type { ClientQuickViewData };
