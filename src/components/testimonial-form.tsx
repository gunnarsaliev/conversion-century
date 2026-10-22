"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { submitTestimonial } from "@/app/[locale]/(site)/testimonials/actions";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export type TestimonialClientOption = {
  value: string;
  label: string;
  logo?: string | null;
};

type ClientType = "existing" | "new";

// Preview URL for a picked image file. The previous object URL is freed
// whenever it's replaced and on unmount.
function useImagePreview() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  const select = (file: File | null | undefined) =>
    setUrl(file ? URL.createObjectURL(file) : null);
  return [url, select] as const;
}

export function TestimonialForm({ clients }: { clients: TestimonialClientOption[] }) {
  const t = useTranslations("TestimonialForm");
  const [clientType, setClientType] = useState<ClientType>("existing");
  const [client, setClient] = useState<TestimonialClientOption | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [photoPreview, setPhoto] = useImagePreview();
  const [logoPreview, setLogo] = useImagePreview();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    if (clientType === "existing" && !client) {
      setError(t("errors.chooseCompany"));
      return;
    }

    startTransition(async () => {
      const result = await submitTestimonial(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/40 p-10 text-center" role="status">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="text-xl font-semibold">{t("successTitle")}</p>
        <p className="text-muted-foreground">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Honeypot: hidden from people, filled by naive bots. */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <input type="hidden" name="clientType" value={clientType} />

      <FieldSet>
        <FieldLegend>{t("clientTypeLegend")}</FieldLegend>
        <RadioGroup
          value={clientType}
          onValueChange={(value) => setClientType(value as ClientType)}
          className="grid gap-3 sm:grid-cols-2"
        >
          <FieldLabel htmlFor="client-type-existing">
            <Field orientation="horizontal">
              <RadioGroupItem value="existing" id="client-type-existing" />
              <FieldContent>
                <FieldTitle>{t("existingTitle")}</FieldTitle>
                <FieldDescription>{t("existingDescription")}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="client-type-new">
            <Field orientation="horizontal">
              <RadioGroupItem value="new" id="client-type-new" />
              <FieldContent>
                <FieldTitle>{t("newTitle")}</FieldTitle>
                <FieldDescription>{t("newDescription")}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>

      {clientType === "existing" ? (
        <Field>
          <FieldLabel htmlFor="client-search">{t("yourCompany")}</FieldLabel>
          <input type="hidden" name="clientId" value={client?.value ?? ""} />
          <Combobox
            items={clients}
            value={client}
            onValueChange={(value) => setClient(value as TestimonialClientOption | null)}
          >
            <ComboboxInput id="client-search" placeholder={t("searchPlaceholder")} showClear />
            <ComboboxContent>
              <ComboboxEmpty>{t("noCompany")}</ComboboxEmpty>
              <ComboboxList>
                {(item: TestimonialClientOption) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.logo} alt="" className="size-6 rounded object-contain" />
                    ) : (
                      <span className="size-6" />
                    )}
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      ) : (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="companyName">{t("companyName")}</FieldLabel>
            <Input id="companyName" name="companyName" required autoComplete="organization" />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="role">{t("role")}</FieldLabel>
              <Input id="role" name="role" placeholder={t("rolePlaceholder")} autoComplete="organization-title" />
            </Field>
            <Field>
              <FieldLabel htmlFor="website">{t("website")}</FieldLabel>
              <Input id="website" name="website" placeholder="example.com" autoComplete="url" />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="logo">{t("companyLogo")}</FieldLabel>
            <div className="flex items-center gap-4">
              {logoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="" className="size-14 rounded-md border object-contain" />
              )}
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={(event) => setLogo(event.target.files?.[0])}
              />
            </div>
            <FieldDescription>{t("logoHint")}</FieldDescription>
          </Field>
        </FieldGroup>
      )}

      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
            <Input id="name" name="name" required autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="profileImage">{t("profilePhoto")}</FieldLabel>
          <div className="flex items-center gap-4">
            {photoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="" className="size-14 rounded-full border object-cover" />
            )}
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files?.[0])}
            />
          </div>
          <FieldDescription>{t("photoHint")}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="testimonial">{t("testimonial")}</FieldLabel>
          <Textarea
            id="testimonial"
            name="testimonial"
            required
            minLength={10}
            rows={6}
            placeholder={t("testimonialPlaceholder")}
          />
        </Field>
      </FieldGroup>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        loading={isPending}
        loadingText={t("submitting")}
        className="self-start"
      >
        {t("submit")}
      </Button>
    </form>
  );
}
