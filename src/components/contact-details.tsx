import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { ORGANIZATION } from "@/lib/seo/site";

// Phone, email and office address, shown in the footer and on the
// consultation page. The address text is localized in the `Contact` messages.
const ContactDetails = ({ className }: { className?: string }) => {
  const t = useTranslations("Contact");

  return (
    <address
      className={cn(
        "flex flex-col gap-3 font-medium text-muted-foreground not-italic",
        className,
      )}
    >
      <a
        href={`tel:${ORGANIZATION.telephone.replace(/\s/g, "")}`}
        className="flex items-center gap-2 hover:text-primary"
      >
        <Phone className="size-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t("phone")}:</span>
        {ORGANIZATION.telephone}
      </a>
      <a
        href={`mailto:${ORGANIZATION.email}`}
        className="flex items-center gap-2 hover:text-primary"
      >
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t("email")}:</span>
        {ORGANIZATION.email}
      </a>
      <span className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t("address")}:</span>
        {t("officeAddress")}
      </span>
    </address>
  );
};

export { ContactDetails };
