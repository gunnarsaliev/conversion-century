"use client";

import { Mail, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { deleteTeamMember } from "@/app/[locale]/(frontend)/dashboard/team/actions";
import {
  AvatarGroup,
  AvatarMore,
} from "@/components/shadcnblocks/avatar-group";
import { TeamMemberFormDrawer } from "@/components/dashboard/team-member-form-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
// Team member quick view (drawer)
// ---------------------------------------------------------------------------
//
// Mirrors client-quick-view.tsx's Sheet-based drawer (cover band, overlapping
// avatar, actions menu, name link, meta info) for previewing a team member
// without leaving the list.

const roleBadgeClassName: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  user: "bg-muted text-muted-foreground",
};

type ClientAvatar = {
  id: string | number;
  companyName: string;
  logoUrl?: string | null;
};

type TeamMemberQuickViewData = {
  id: string | number;
  firstName: string;
  lastName: string;
  name: string;
  jobTitle?: string | null;
  email?: string | null;
  role: string;
  avatarUrl?: string | null;
  managedClients?: ClientAvatar[];
  publishingFor?: ClientAvatar[];
  copywritingFor?: ClientAvatar[];
};

type TeamMemberQuickViewProps = {
  member: TeamMemberQuickViewData;
  trigger: React.ReactElement;
};

// Overlapping client logos (based on avatar-group-max-1.tsx) capped to 4
// visible avatars, with a "+N" indicator for the rest.
const MAX_VISIBLE_CLIENTS = 4;

const ClientAvatarGroup = ({
  label,
  clients,
}: {
  label: string;
  clients: ClientAvatar[];
}) => {
  if (clients.length === 0) return null;

  const visible = clients.slice(0, MAX_VISIBLE_CLIENTS);
  const overflow = clients.length - visible.length;

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{label}</h3>
      <AvatarGroup size={32}>
        {visible.map((client) => (
          <Avatar key={client.id}>
            <AvatarImage src={client.logoUrl ?? undefined} alt={client.companyName} />
            <AvatarFallback className="text-xs">
              {client.companyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 && <AvatarMore count={overflow} size={32} />}
      </AvatarGroup>
    </div>
  );
};

const TeamMemberQuickView = ({
  member,
  trigger,
}: TeamMemberQuickViewProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete ${member.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteTeamMember(member.id);
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
          <SheetTitle className="text-lg">Team Member</SheetTitle>
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
            {/* Avatar — overlapping cover, actions menu top-right */}
            <div className="-mt-10 mb-3 flex items-end justify-between">
              {member.avatarUrl ? (
                <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-4 border-card">
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-card bg-muted text-lg font-medium text-muted-foreground">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0"
                      aria-label="Team member actions"
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
              <TeamMemberFormDrawer
                member={member}
                open={editOpen}
                onOpenChange={setEditOpen}
              />
            </div>

            {/* Name and role */}
            <div className="space-y-1">
              <Link
                href={`/dashboard/team/${member.id}`}
                className="text-xl font-bold hover:underline"
              >
                {member.name}
              </Link>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <Badge
                  className={
                    roleBadgeClassName[member.role] ?? roleBadgeClassName.user
                  }
                >
                  <span className="capitalize">{member.role}</span>
                </Badge>
                {member.jobTitle && <span>{member.jobTitle}</span>}
              </div>
            </div>

            {/* Meta info */}
            {member.email && (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 hover:text-foreground"
                >
                  <Mail className="size-3.5" />
                  <span>{member.email}</span>
                </a>
              </div>
            )}

            {/* Clients */}
            {((member.managedClients && member.managedClients.length > 0) ||
              (member.publishingFor && member.publishingFor.length > 0) ||
              (member.copywritingFor && member.copywritingFor.length > 0)) && (
              <div className="mt-6 space-y-4 border-t pt-6">
                <ClientAvatarGroup
                  label="Managing"
                  clients={member.managedClients ?? []}
                />
                <ClientAvatarGroup
                  label="Publishing For"
                  clients={member.publishingFor ?? []}
                />
                <ClientAvatarGroup
                  label="Copywriting For"
                  clients={member.copywritingFor ?? []}
                />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { TeamMemberQuickView };
export type { TeamMemberQuickViewData };
