"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Controller,
  useFieldArray,
  useForm,
  type Control,
} from "react-hook-form";

import {
  createClient,
  updateClient,
} from "@/app/[locale]/(frontend)/dashboard/clients/actions";
import { drawerFooterActionClassName, drawerFooterClassName } from "@/components/dashboard/drawer-footer-action";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import { Textarea } from "@/components/ui/textarea";
import {
  clientFormSchema,
  emptyClientFormValues,
  type ClientFormOptions,
  type ClientFormValues,
} from "@/lib/client-form-schema";
import { CLIENT_STATUSES, clientSection } from "@/lib/client-status";
import { regionLabel, regionLabels } from "@/lib/regions";

// ---------------------------------------------------------------------------
// Client form (drawer) — create or edit
// ---------------------------------------------------------------------------
//
// Sheet-based form adapted from feedback1.tsx's layout (header with close
// button, scrollable body, footer). In "create" mode it submits to the
// createClient server action; in "edit" mode, pre-filled from `client`, it
// submits to updateClient. Both write through the Payload local API.
//
// Every field shown is saved, so edit mode must be given the record's full
// current values (see toClientFormValues in src/lib/client-form-values.ts).

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
  // Choices for the services / team pickers. Without them those pickers
  // are hidden (create from a page that didn't load them).
  options?: ClientFormOptions;
} & (
  | { mode?: "create"; defaultStatus?: ClientFormValues["status"] }
  | {
      mode: "edit";
      client: { id: string | number; values: ClientFormValues };
      // On a detail page, follow the record to its new dashboard section
      // when the status change moves it (the old URL would 404).
      navigateOnSectionChange?: boolean;
    }
);

type Option = { value: string | number; label: string };

// Multi-select with chips, for hasMany selects and relationships.
const MultiCombobox = ({
  id,
  items,
  value,
  onChange,
  placeholder,
  emptyText,
}: {
  id: string;
  items: Option[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder: string;
  emptyText: string;
}) => {
  const anchor = useComboboxAnchor();
  // Keep selected values even if they're missing from `items` (e.g. a
  // deleted user), so saving never drops them silently.
  const selected = value.map(
    (entry) =>
      items.find((item) => item.value === entry) ?? {
        value: entry,
        label: String(entry),
      },
  );

  return (
    <Combobox
      multiple
      items={items}
      value={selected}
      onValueChange={(next: Option[]) => onChange(next.map((item) => item.value))}
      itemToStringLabel={(item: Option) => item.label}
      isItemEqualToValue={(a: Option, b: Option) => a.value === b.value}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: Option[]) => (
            <>
              {values.map((item) => (
                <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                id={id}
                placeholder={values.length === 0 ? placeholder : undefined}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(item: Option) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

// Repeating URL inputs for an array-of-links field.
const LinkListField = ({
  control,
  name,
  label,
}: {
  control: Control<ClientFormValues>;
  name: "websiteLinks" | "reportUrls";
  label: string;
}) => {
  const t = useTranslations("Clients");
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-2">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <Controller
              name={`${name}.${index}.url`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="url"
                  aria-label={`${label} ${index + 1}`}
                  placeholder="https://"
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t("form.removeLink")}
              onClick={() => remove(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => append({ url: "" })}
        >
          <Plus />
          {t("form.addLink")}
        </Button>
      </div>
    </Field>
  );
};

const ClientFormDrawer = (props: ClientFormDrawerProps) => {
  const { trigger, options, mode = "create" } = props;
  const t = useTranslations("Clients");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = props.open !== undefined;
  const open = isControlled ? props.open! : uncontrolledOpen;
  const setOpen = isControlled ? props.onOpenChange! : setUncontrolledOpen;
  const [serverError, setServerError] = React.useState<string | null>(null);

  const defaultValues: ClientFormValues =
    props.mode === "edit"
      ? props.client.values
      : {
          ...emptyClientFormValues,
          status: props.defaultStatus ?? emptyClientFormValues.status,
        };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema(t)),
    defaultValues,
  });

  // Pick up fresh server values (after router.refresh) while closed.
  React.useEffect(() => {
    if (!open) reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, props.mode === "edit" ? props.client.values : null]);

  const regionItems = React.useMemo<Option[]>(
    () =>
      Object.keys(regionLabels).map((code) => ({
        value: code,
        label: regionLabel(code, locale),
      })),
    [locale],
  );
  const serviceItems = React.useMemo<Option[]>(
    () => (options?.services ?? []).map((s) => ({ value: s.id, label: s.name })),
    [options],
  );
  const userItems = React.useMemo<Option[]>(
    () => (options?.users ?? []).map((u) => ({ value: u.id, label: u.name })),
    [options],
  );

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
      reset(defaultValues);
    }
    setOpen(false);

    const movedSection =
      props.mode === "edit" &&
      props.navigateOnSectionChange &&
      clientSection(values.status) !== clientSection(props.client.values.status);

    if (movedSection) {
      router.replace(`/dashboard/${clientSection(values.status)}/${result.id}`);
    } else {
      router.refresh();
    }
  };

  const textField = (
    name: "companyName" | "contactName" | "email" | "phone" | "linkBuildingDocs" | "blogDocs",
    label: string,
    inputProps: React.ComponentProps<typeof Input> = {},
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            value={field.value ?? ""}
            id={name}
            aria-invalid={fieldState.invalid}
            {...inputProps}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );

  const multiField = (
    name: "region" | "services" | "accountManagers" | "publishers" | "copywriters",
    label: string,
    items: Option[],
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <MultiCombobox
            id={name}
            items={items}
            value={field.value}
            onChange={field.onChange}
            placeholder={t("form.selectPlaceholder")}
            emptyText={t("form.noResults")}
          />
        </Field>
      )}
    />
  );

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
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              {textField("companyName", t("form.companyName"), {
                placeholder: t("form.companyPlaceholder"),
              })}
              {textField("contactName", t("form.contactName"), {
                placeholder: t("form.contactPlaceholder"),
              })}
              {textField("email", t("form.email"), {
                type: "email",
                placeholder: t("form.emailPlaceholder"),
              })}
              {textField("phone", t("form.phone"), {
                placeholder: "+1 555 000 0000",
              })}

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="status">{t("form.status")}</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status">
                        <SelectValue>
                          {(value: string) => t(`status.${value}`)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {CLIENT_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`status.${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldSet>
              <FieldLegend>{t("form.sectionDetails")}</FieldLegend>
              <FieldGroup>
                <Controller
                  name="contractDate"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="contractDate">
                        {t("form.contractDate")}
                      </FieldLabel>
                      <Input {...field} id="contractDate" type="date" />
                    </Field>
                  )}
                />
                {multiField("region", t("fields.region"), regionItems)}
                {options && multiField("services", t("fields.services"), serviceItems)}
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="notes">{t("detail.notes")}</FieldLabel>
                      <Textarea {...field} id="notes" rows={4} />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            {options && (
              <FieldSet>
                <FieldLegend>{t("form.sectionTeam")}</FieldLegend>
                <FieldGroup>
                  {multiField("accountManagers", t("people.accountManagers"), userItems)}
                  {multiField("publishers", t("people.publishers"), userItems)}
                  {multiField("copywriters", t("people.copywriters"), userItems)}
                </FieldGroup>
              </FieldSet>
            )}

            <FieldSet>
              <FieldLegend>{t("form.sectionLinks")}</FieldLegend>
              <FieldGroup>
                <LinkListField
                  control={control}
                  name="websiteLinks"
                  label={t("links.website")}
                />
                <LinkListField
                  control={control}
                  name="reportUrls"
                  label={t("links.reports")}
                />
                {textField("linkBuildingDocs", t("links.linkBuildingDocs"), {
                  type: "url",
                  placeholder: "https://",
                })}
                {textField("blogDocs", t("links.blogDocs"), {
                  type: "url",
                  placeholder: "https://",
                })}
              </FieldGroup>
            </FieldSet>

            {serverError ? (
              <p className="text-sm text-destructive">{serverError}</p>
            ) : null}
          </form>
        </div>

        <SheetFooter className={drawerFooterClassName}>
          <Button
            size="lg"
            className={drawerFooterActionClassName}
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
