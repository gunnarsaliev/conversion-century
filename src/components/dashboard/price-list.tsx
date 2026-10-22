"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateServicePrices } from "@/app/[locale]/(frontend)/dashboard/pricelist/actions";
import { fieldClassName } from "@/components/form-styles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Price list — each service's hourly rate, edited in place
// ---------------------------------------------------------------------------
//
// One input per service (the rate is the only control). Only changed rows
// are sent to updateServicePrices; a blank input clears the rate, and offers
// using that service then have no calculated price.

type PriceListService = {
  id: number;
  name: string;
  image?: string;
  price?: number;
};

const priceListSchema = z.object({
  prices: z.array(
    z.object({
      id: z.number(),
      price: z.number().min(0, "Rates can't be negative").optional(),
    }),
  ),
});

type PriceListValues = z.infer<typeof priceListSchema>;

const toValues = (services: PriceListService[]): PriceListValues => ({
  prices: services.map(({ id, price }) => ({ id, price })),
});

function PriceList({
  services,
  canEdit,
}: {
  services: PriceListService[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<
    { type: "saved" } | { type: "error"; message: string } | null
  >(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, dirtyFields },
  } = useForm<PriceListValues>({
    resolver: zodResolver(priceListSchema),
    defaultValues: toValues(services),
  });

  const onSubmit = async (values: PriceListValues) => {
    setStatus(null);
    const updates = values.prices
      .filter((_, index) => dirtyFields.prices?.[index]?.price)
      .map(({ id, price }) => ({ id, price: price ?? null }));

    const result = await updateServicePrices(updates);
    if (!result.success) {
      setStatus({ type: "error", message: result.error });
      return;
    }

    // The saved values become the new baseline.
    reset(values);
    setStatus({ type: "saved" });
    router.refresh();
  };

  if (services.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No services yet.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4">
      <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Service</TableHead>
              <TableHead className="w-48 pr-4 text-right">Rate per hour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={service.id}>
                <TableCell className="pl-4">
                  <Link
                    href={`/dashboard/services/${service.id}`}
                    className="flex items-center gap-3 font-medium hover:underline"
                  >
                    <Avatar className="size-9 rounded-lg after:rounded-lg">
                      {service.image && (
                        <AvatarImage src={service.image} alt="" className="rounded-lg object-cover" />
                      )}
                      <AvatarFallback className="rounded-lg text-xs">
                        {service.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {service.name}
                  </Link>
                </TableCell>
                <TableCell className="pr-4">
                  <Controller
                    name={`prices.${index}.price`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="ml-auto w-40">
                        <div className="relative">
                          <label htmlFor={`price-${service.id}`} className="sr-only">
                            {service.name} rate per hour
                          </label>
                          {/* Blank input ⇄ `undefined`, so a cleared rate isn't saved as 0. */}
                          <input
                            ref={field.ref}
                            name={field.name}
                            onBlur={field.onBlur}
                            value={field.value ?? ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value === ""
                                  ? undefined
                                  : event.target.valueAsNumber,
                              )
                            }
                            id={`price-${service.id}`}
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="any"
                            placeholder="—"
                            disabled={!canEdit}
                            aria-invalid={fieldState.invalid}
                            className={cn(
                              fieldClassName,
                              "w-full border pr-14 text-right tabular-nums outline-none aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-60",
                            )}
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-muted-foreground">
                            € / h
                          </span>
                        </div>
                        {fieldState.error && (
                          <p className="mt-1 text-right text-xs text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="sticky bottom-0 mt-4 flex flex-wrap items-center justify-end gap-3 bg-background/80 py-3 backdrop-blur">
        {!canEdit && (
          <p className="mr-auto text-sm text-muted-foreground">Only admins can change rates.</p>
        )}
        {status?.type === "saved" && !isDirty && (
          <p className="mr-auto text-sm text-muted-foreground" role="status">
            Rates saved.
          </p>
        )}
        {status?.type === "error" && (
          <p className="mr-auto text-sm text-destructive" role="alert">
            {status.message}
          </p>
        )}
        {canEdit && (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || isSubmitting}
              onClick={() => {
                reset();
                setStatus(null);
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isDirty}
              loading={isSubmitting}
              loadingText="Saving…"
            >
              Save changes
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

export { PriceList };
