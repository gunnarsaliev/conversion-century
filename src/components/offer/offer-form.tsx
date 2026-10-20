"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldPath,
} from "react-hook-form";

import { createOffer, updateOffer } from "@/app/[locale]/(frontend)/website/offers/actions";
import { ComboboxRichContent } from "@/components/combobox-rich-content-4";
import {
  fieldClassName,
  labelClassName,
  legendClassName,
  sectionClassName,
  submitButtonClassName,
  textareaClassName,
} from "@/components/form-styles";
import { formatAmount, packageTotal } from "@/components/offer/offer-ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Field,
  FieldDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  emptyOfferFormValues,
  metricsSources,
  offerFormSchema,
  type OfferFormInput,
  type OfferFormOptions,
  type OfferFormValues,
} from "@/lib/offer-form";

// ---------------------------------------------------------------------------
// Offer form — create or edit a record in the `offers` collection
// ---------------------------------------------------------------------------
//
// Validated with the shared Zod schema (src/lib/offer-form.ts) and saved
// through the createOffer / updateOffer server actions. Pass `offerId` and
// `defaultValues` to edit; by default a successful save opens the offer.

const sourceLabels: Record<(typeof metricsSources)[number], string> = {
  manual: "Ръчно",
  ahrefs: "Ahrefs",
  semrush: "Semrush",
  other: "Друго",
};

const toItems = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

type FormControl = Control<OfferFormInput, unknown, OfferFormValues>;

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

type FieldProps = {
  control: FormControl;
  name: FieldPath<OfferFormInput>;
  label: string;
  description?: string;
  /** Hide the label visually (e.g. repeated row fields). */
  srOnlyLabel?: boolean;
};

function TextField({ type = "text", placeholder, ...props }: FieldProps & { type?: string; placeholder?: string }) {
  const { control, name, label, description, srOnlyLabel } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className={srOnlyLabel ? "sr-only" : labelClassName}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            value={(field.value as string | undefined) ?? ""}
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className={fieldClassName}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

// Blank input ⇄ `undefined`, so optional numbers stay unset instead of 0.
function NumberField({ placeholder, ...props }: FieldProps & { placeholder?: string }) {
  const { control, name, label, description, srOnlyLabel } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className={srOnlyLabel ? "sr-only" : labelClassName}>
            {label}
          </FieldLabel>
          <Input
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            value={(field.value as number | undefined) ?? ""}
            onChange={(event) =>
              field.onChange(event.target.value === "" ? undefined : event.target.valueAsNumber)
            }
            id={name}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className={fieldClassName}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function SelectField<V extends string | number>({
  items,
  placeholder,
  ...props
}: FieldProps & { items: { value: V; label: string }[]; placeholder?: string }) {
  const { control, name, label, description, srOnlyLabel } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className={srOnlyLabel ? "sr-only" : labelClassName}>
            {label}
          </FieldLabel>
          <Select
            items={items}
            value={(field.value as V | undefined) ?? null}
            onValueChange={(value) => field.onChange(value ?? undefined)}
          >
            <SelectTrigger
              id={name}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              className={cn(fieldClassName, "w-full pr-3 data-[size=default]:h-11")}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

// Live total hours and price, computed like the collection's virtual fields:
// the fixed price, or Σ hours × each service's hourly rate; then the
// discount, as on the offer page and PDF.
function PricePreview({ control, options }: { control: FormControl; options: OfferFormOptions }) {
  const [lines = [], fixedPrice, discount] = useWatch({
    control,
    name: ["services", "fixedPrice", "discount"],
  });
  const hours = lines.reduce((sum, line) => sum + (line?.hours ?? 0), 0);
  // Null when a line has no service, hours or rate yet, as in Offers.ts.
  const price =
    typeof fixedPrice === "number"
      ? fixedPrice
      : lines.reduce<number | null>((total, line) => {
          const rate = options.services.find((s) => s.value === line?.service)?.rate;
          return total === null || typeof rate !== "number" || typeof line?.hours !== "number"
            ? null
            : total + line.hours * rate;
        }, 0);

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-1 rounded-xl bg-muted/60 px-4 py-3.5 text-[15px]">
      <span>
        Общо часове: <strong className="font-medium">{formatAmount(hours)}</strong>
      </span>
      <span>
        Цена:{" "}
        <strong className="font-medium">
          {price === null ? "—" : `${formatAmount(price)} €`}
        </strong>
        {price === null && lines.length > 0 && (
          <span className="text-muted-foreground"> (липсва часова ставка)</span>
        )}
      </span>
      {price !== null && discount ? (
        <span>
          След отстъпка {formatAmount(discount)}%:{" "}
          <strong className="font-medium">
            {formatAmount(packageTotal({ price, discount }))} €
          </strong>
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

type OfferFormProps = {
  options: OfferFormOptions;
  /** Edit this offer instead of creating one. */
  offerId?: number;
  defaultValues?: OfferFormInput;
  /** Called with the saved offer's id; defaults to opening the offer. */
  onSuccess?: (id: number) => void;
  className?: string;
};

function OfferForm({
  options,
  offerId,
  defaultValues,
  onSuccess,
  className,
}: OfferFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const isEdit = offerId !== undefined;

  const initialValues = defaultValues ?? emptyOfferFormValues();
  const [customizeOpen, setCustomizeOpen] = React.useState(
    initialValues.fixedPrice !== undefined ||
      initialValues.discount !== undefined ||
      Boolean(initialValues.description),
  );

  const form = useForm<OfferFormInput, unknown, OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: initialValues,
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;
  const services = useFieldArray({ control, name: "services" });
  const keywords = useFieldArray({ control, name: "keywords" });

  const onSubmit = async (values: OfferFormValues) => {
    setServerError(null);
    const result = isEdit ? await updateOffer(offerId, values) : await createOffer(values);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    if (onSuccess) onSuccess(result.id);
    else router.push(`/website/offers/${result.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
      <FieldGroup className="gap-8">
        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>Оферта</FieldLegend>
          <FieldGroup>
            {/* Client and expiry share a row; the client gets the extra width. */}
            <div className="grid items-start gap-4 sm:grid-cols-[1fr_13rem]">
              <Controller
                name="client"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client" className={labelClassName}>
                      Клиент
                    </FieldLabel>
                    <ComboboxRichContent
                      id="client"
                      items={options.clients}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                      invalid={fieldState.invalid}
                      className={cn(fieldClassName, "min-h-11 hover:bg-muted")}
                      placeholder="Изберете клиент"
                      searchPlaceholder="Търсене на клиент…"
                      emptyText="Няма намерен клиент."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <TextField
                control={control}
                name="validUntil"
                label="Валидна до"
                type="date"
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>Услуги и цена</FieldLegend>
          <FieldDescription>
            Часове по услуга. Цената е сбор от часове × часовата ставка на услугата, освен ако не
            зададете фиксирана цена.
          </FieldDescription>
          <FieldGroup className="gap-3">
            {services.fields.map((row, index) => (
              <div key={row.id} className="grid grid-cols-[1fr_7rem_auto] items-start gap-3">
                <SelectField
                  control={control}
                  name={`services.${index}.service`}
                  label="Услуга"
                  srOnlyLabel={index > 0}
                  items={options.services}
                  placeholder="Изберете услуга"
                />
                <NumberField
                  control={control}
                  name={`services.${index}.hours`}
                  label="Часове"
                  srOnlyLabel={index > 0}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Премахни услугата"
                  onClick={() => services.remove(index)}
                  className={cn("size-11 rounded-xl text-muted-foreground", index === 0 && "mt-7")}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            {errors.services?.root?.message || errors.services?.message ? (
              <FieldError>{errors.services?.root?.message ?? errors.services?.message}</FieldError>
            ) : null}
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full px-4"
                onClick={() => services.append({ service: undefined, hours: undefined })}
              >
                <Plus /> Добави услуга
              </Button>
            </div>
            {/* Optional fields, tucked away; opened when they hold a value or an error. */}
            <Collapsible
              open={customizeOpen || Boolean(errors.fixedPrice || errors.discount || errors.description)}
              onOpenChange={setCustomizeOpen}
              className="flex flex-col"
            >
              <CollapsibleTrigger className="group inline-flex self-end items-center gap-1 rounded-md text-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
                Персонализиране
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-data-panel-open:rotate-180"
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                <FieldGroup className="pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      control={control}
                      name="fixedPrice"
                      label="Фиксирана цена (EUR)"
                      description="Заменя изчислената цена."
                    />
                    <NumberField
                      control={control}
                      name="discount"
                      label="Отстъпка (%)"
                      description="Процент, приспаднат от цената."
                    />
                  </div>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description" className={labelClassName}>
                          Описание
                        </FieldLabel>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          id="description"
                          rows={5}
                          aria-invalid={fieldState.invalid}
                          className={textareaClassName}
                        />
                        <FieldDescription>Всеки ред става отделен абзац.</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CollapsibleContent>
            </Collapsible>
          </FieldGroup>
        </FieldSet>

        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>SEO метрики</FieldLegend>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Hidden for now: new offers use the defaults (manual source, today).
              <SelectField
                control={control}
                name="metrics.source"
                label="Източник"
                items={toItems(sourceLabels)}
              />
              <TextField control={control} name="metrics.date" label="Дата" type="date" />
              */}
              <NumberField control={control} name="metrics.domainRating" label="Domain Rating" />
              <NumberField control={control} name="metrics.backlinks" label="Backlinks" />
              <NumberField
                control={control}
                name="metrics.organicKeywords"
                label="Органични ключови думи"
              />
              <NumberField
                control={control}
                name="metrics.organicTraffic"
                label="Органичен трафик / месец"
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className={sectionClassName}>
          <FieldLegend className={legendClassName}>Топ ключови думи</FieldLegend>
          <FieldGroup className="gap-3">
            {keywords.fields.map((row, index) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_5rem_7rem_auto] items-start gap-3"
              >
                <TextField
                  control={control}
                  name={`keywords.${index}.keyword`}
                  label="Ключова дума"
                  srOnlyLabel={index > 0}
                />
                <NumberField
                  control={control}
                  name={`keywords.${index}.position`}
                  label="Позиция"
                  srOnlyLabel={index > 0}
                />
                <NumberField
                  control={control}
                  name={`keywords.${index}.volume`}
                  label="Търсения"
                  srOnlyLabel={index > 0}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Премахни ключовата дума"
                  onClick={() => keywords.remove(index)}
                  className={cn("size-11 rounded-xl text-muted-foreground", index === 0 && "mt-7")}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full px-4"
                onClick={() =>
                  keywords.append({ keyword: "", position: undefined, volume: undefined })
                }
              >
                <Plus /> Добави ключова дума
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>

        <PricePreview control={control} options={options} />

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className={cn(submitButtonClassName, "px-6")}
            onClick={() => router.back()}
          >
            Отказ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(submitButtonClassName, "text-white")}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isSubmitting
              ? "Запазване…"
              : isEdit
                ? "Запази промените"
                : "Създай оферта"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

export { OfferForm };
