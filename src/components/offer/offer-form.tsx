"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
import { formatAmount } from "@/components/offer/offer-ui";
import { Button } from "@/components/ui/button";
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
  addValidity,
  emptyOfferFormValues,
  metricsSources,
  offerFormSchema,
  offerStatuses,
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

const statusLabels: Record<(typeof offerStatuses)[number], string> = {
  draft: "Чернова",
  sent: "Изпратена",
  accepted: "Приета",
  declined: "Отказана",
};

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
          <FieldLabel htmlFor={name} className={srOnlyLabel ? "sr-only" : undefined}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            value={(field.value as string | undefined) ?? ""}
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
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
          <FieldLabel htmlFor={name} className={srOnlyLabel ? "sr-only" : undefined}>
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
          <FieldLabel htmlFor={name} className={srOnlyLabel ? "sr-only" : undefined}>
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
              className="w-full"
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
// the fixed price, or Σ hours × each service's hourly rate.
function PricePreview({ control, options }: { control: FormControl; options: OfferFormOptions }) {
  const [lines = [], fixedPrice] = useWatch({ control, name: ["services", "fixedPrice"] });
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
    <div className="flex flex-wrap gap-x-8 gap-y-1 rounded-lg bg-muted px-4 py-3 text-sm">
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
  /** Signed-in user, preselected as "Оферта от" on new offers. */
  currentUserId?: number;
  /** Called with the saved offer's id; defaults to opening the offer. */
  onSuccess?: (id: number) => void;
  className?: string;
};

function OfferForm({
  options,
  offerId,
  defaultValues,
  currentUserId,
  onSuccess,
  className,
}: OfferFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const isEdit = offerId !== undefined;

  const form = useForm<OfferFormInput, unknown, OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: defaultValues ?? emptyOfferFormValues(currentUserId),
  });
  const {
    control,
    handleSubmit,
    getFieldState,
    setValue,
    formState: { isSubmitting, errors },
  } = form;
  const services = useFieldArray({ control, name: "services" });
  const keywords = useFieldArray({ control, name: "keywords" });

  // Keep the expiry VALIDITY_WEEKS after the date until it's edited by hand.
  const date = useWatch({ control, name: "date" });
  React.useEffect(() => {
    if (date && !getFieldState("validUntil").isDirty) {
      setValue("validUntil", addValidity(date));
    }
  }, [date, getFieldState, setValue]);

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
      <FieldGroup className="gap-10">
        <FieldSet>
          <FieldLegend>Оферта</FieldLegend>
          <FieldGroup>
            <SelectField
              control={control}
              name="client"
              label="Клиент"
              items={options.clients}
              placeholder="Изберете клиент"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                control={control}
                name="preparedBy"
                label="Оферта от"
                items={options.users}
                placeholder="Изберете потребител"
              />
              <SelectField
                control={control}
                name="status"
                label="Статус"
                items={toItems(statusLabels)}
              />
              <TextField control={control} name="date" label="Дата" type="date" />
              <TextField
                control={control}
                name="validUntil"
                label="Валидна до"
                type="date"
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Услуги и цена</FieldLegend>
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
                  size="icon"
                  aria-label="Премахни услугата"
                  onClick={() => services.remove(index)}
                  className={index === 0 ? "mt-7" : undefined}
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
                size="sm"
                onClick={() => services.append({ service: undefined, hours: undefined })}
              >
                <Plus /> Добави услуга
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                control={control}
                name="fixedPrice"
                label="Фиксирана цена (EUR)"
                description="Заменя изчислената цена."
              />
            </div>
            <PricePreview control={control} options={options} />
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Описание</FieldLegend>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description" className="sr-only">
                  Описание
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  id="description"
                  rows={5}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Всеки ред става отделен абзац.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldSet>

        <FieldSet>
          <FieldLegend>SEO метрики</FieldLegend>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                control={control}
                name="metrics.source"
                label="Източник"
                items={toItems(sourceLabels)}
              />
              <TextField control={control} name="metrics.date" label="Дата" type="date" />
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

        <FieldSet>
          <FieldLegend>Топ ключови думи</FieldLegend>
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
                  size="icon"
                  aria-label="Премахни ключовата дума"
                  onClick={() => keywords.remove(index)}
                  className={index === 0 ? "mt-7" : undefined}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  keywords.append({ keyword: "", position: undefined, volume: undefined })
                }
              >
                <Plus /> Добави ключова дума
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отказ
          </Button>
          <Button type="submit" disabled={isSubmitting}>
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
