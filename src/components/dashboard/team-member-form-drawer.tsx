"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateTeamMember } from "@/app/[locale]/(frontend)/dashboard/team/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Team member form (drawer) — edit only
// ---------------------------------------------------------------------------
//
// Sheet-based form mirroring client-form-drawer.tsx's layout. Edit only —
// new team members are added via /admin, since creating a user means
// setting a password, which this dashboard doesn't collect.
//
// Controlled from outside via `open`/`onOpenChange` rather than an internal
// trigger: its only caller opens it from a DropdownMenuItem, and nesting a
// Dialog trigger's own click handling inside a Menu item isn't a supported
// composition (see Base UI's Menu docs, "Open a dialog") — the menu's item
// click handling and the dialog trigger's click handling don't coordinate.

const teamMemberFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  jobTitle: z.string().trim().optional(),
  role: z.enum(["user", "admin"]),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

type TeamMemberFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: string | number;
    firstName: string;
    lastName: string;
    jobTitle?: string | null;
    role: string;
  };
};

const TeamMemberFormDrawer = ({
  open,
  onOpenChange,
  member,
}: TeamMemberFormDrawerProps) => {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const defaultValues: TeamMemberFormValues = {
    firstName: member.firstName,
    lastName: member.lastName,
    jobTitle: member.jobTitle ?? "",
    role: (member.role as TeamMemberFormValues["role"]) ?? "user",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: TeamMemberFormValues) => {
    setServerError(null);

    const result = await updateTeamMember(member.id, values);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          reset(defaultValues);
          setServerError(null);
        }
      }}
    >
      <SheetContent showCloseButton={false} aria-describedby={undefined}>
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">Edit Team Member</SheetTitle>
          <SheetClose render={<Button size="icon" variant="secondary" />}>
            <X />
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto px-5 pt-5 pb-5">
          <form
            id="form-team-member"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="firstName">First name</FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jane"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Doe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="jobTitle"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
                    <Input
                      {...field}
                      id="jobTitle"
                      aria-invalid={fieldState.invalid}
                      placeholder="Account Manager"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {serverError ? (
              <p className="text-sm text-destructive">{serverError}</p>
            ) : null}
          </form>
        </div>

        <SheetFooter>
          <Button
            type="submit"
            form="form-team-member"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { TeamMemberFormDrawer };
