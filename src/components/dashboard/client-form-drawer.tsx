"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useTranslations } from "next-intl";
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

const clientFormSchema = (t: (key: string) => string) =>
  z.object({
    companyName: z.string().trim().min(1, t("errors.companyName")),
    contactName: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .email(t("errors.email"))
      .optional()
      .or(z.literal("")),
    phone: z.string().trim().optional(),
    status: z.enum(["lead", "consultation", "active", "inactive"]),
  });

type ClientFormValues = z.infer<ReturnType<typeof clientFormSchema>>;

const emptyValues: ClientFormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  status: "lead",
};

type ClientFormDrawerProps = {
  // Either pass `trigger` to render an uncontrolled Sheet with its own
  // trigger element, or pass `open`/`onOpenChange` to drive the Sheet from
  // outside (e.g. a menu item that opens it imperatively — nesting a
  // Dialog trigger's own click handling inside a Menu item isn't a
  // supported composition per Base UI's docs, since the menu's item click
  // handling and the dialog trigger's click handling don't coordinate).
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & (
  | { mode?: "create"; defaultStatus?: ClientFormValues["status"] }
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
  const t = useTranslations("Clients");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = props.open !== undefined;
  const open = isControlled ? props.open! : uncontrolledOpen;
  const setOpen = isControlled ? props.onOpenChange! : setUncontrolledOpen;
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
      : { ...emptyValues, status: props.defaultStatus ?? emptyValues.status };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema(t)),
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
      {trigger && <SheetTrigger render={trigger} />}
      <SheetContent showCloseButton={false} aria-describedby={undefined}>
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">
            {mode === "edit" ? t("form.editTitle") : t("form.newTitle")}
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
                      {t("form.companyName")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="companyName"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("form.companyPlaceholder")}
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
                      {t("form.contactName")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contactName"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("form.contactPlaceholder")}
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
                    <FieldLabel htmlFor="email">{t("form.email")}</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("form.emailPlaceholder")}
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
                    <FieldLabel htmlFor="phone">{t("form.phone")}</FieldLabel>
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
                    <FieldLabel htmlFor="status">{t("form.status")}</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">{t("status.lead")}</SelectItem>
                        <SelectItem value="consultation">{t("status.consultation")}</SelectItem>
                        <SelectItem value="active">{t("status.active")}</SelectItem>
                        <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
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
            form="form-client"
            loading={isSubmitting}
            loadingText={mode === "edit" ? tCommon("saving") : t("form.creating")}
          >
            {mode === "edit" ? t("form.save") : t("form.create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { ClientFormDrawer };
