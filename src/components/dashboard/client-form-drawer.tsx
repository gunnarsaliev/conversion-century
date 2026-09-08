"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import {
  createClient,
  updateClient,
} from "@/app/[locale]/(frontend)/dashboard/clients/actions";
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
  SheetTrigger,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Client form (drawer) — create or edit
// ---------------------------------------------------------------------------
//
// Sheet-based form adapted from feedback1.tsx's layout (header with close
// button, scrollable body, footer). In "create" mode it submits to the
// createClient server action; in "edit" mode, pre-filled from `client`, it
// submits to updateClient. Both write through the Payload local API.

const clientFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  contactName: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional(),
  status: z.enum(["lead", "active", "inactive"]),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const emptyValues: ClientFormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  status: "lead",
};

type ClientFormDrawerProps = {
  trigger: React.ReactElement;
} & (
  | { mode?: "create" }
  | {
      mode: "edit";
      client: {
        id: string | number;
        companyName: string;
        contactName?: string | null;
        email?: string | null;
        phone?: string | null;
        status: string;
      };
    }
);

const ClientFormDrawer = (props: ClientFormDrawerProps) => {
  const { trigger, mode = "create" } = props;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const defaultValues: ClientFormValues =
    props.mode === "edit"
      ? {
          companyName: props.client.companyName,
          contactName: props.client.contactName ?? "",
          email: props.client.email ?? "",
          phone: props.client.phone ?? "",
          status:
            (props.client.status as ClientFormValues["status"]) ?? "lead",
        }
      : emptyValues;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: ClientFormValues) => {
    setServerError(null);

    const result =
      props.mode === "edit"
        ? await updateClient(props.client.id, values)
        : await createClient(values);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    if (mode === "create") {
      reset(emptyValues);
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset(defaultValues);
          setServerError(null);
        }
      }}
    >
      <SheetTrigger render={trigger} />
      <SheetContent showCloseButton={false} aria-describedby={undefined}>
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">
            {mode === "edit" ? "Edit Client" : "New Client"}
          </SheetTitle>
          <SheetClose render={<Button size="icon" variant="secondary" />}>
            <X />
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto px-5 pt-5 pb-5">
          <form
            id="form-client"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Controller
                name="companyName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="companyName">
                      Company name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="companyName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Acme Inc."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="contactName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contactName">
                      Contact name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contactName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jane Doe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="jane@acme.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="+1 555 000 0000"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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
          <Button type="submit" form="form-client" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "edit"
                ? "Saving…"
                : "Creating…"
              : mode === "edit"
                ? "Save changes"
                : "Create client"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { ClientFormDrawer };
