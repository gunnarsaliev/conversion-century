import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

interface IndustryDetailClient {
  name: string;
  logo: string;
}

interface IndustryDetailProps {
  label?: string;
  title: string;
  image?: string;
  description?: SerializedEditorState;
  clients?: IndustryDetailClient[];
  ctaHeading?: string;
  className?: string;
}

// Detail page layout shared by industries and solutions.
const IndustryDetail = ({
  label,
  title,
  image,
  description,
  clients = [],
  ctaHeading,
  className,
}: IndustryDetailProps) => {
  const t = useTranslations("IndustryDetail");
  const tCommon = useTranslations("Common");

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb className="mb-6 lg:mb-10">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>
                  {tCommon("home")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {label ?? t("label")}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>

          {image && (
            <img
              src={image}
              alt={title}
              className="mt-10 aspect-video w-full rounded-lg object-cover"
            />
          )}

          {description && (
            <div className="prose mt-10 max-w-none dark:prose-invert">
              <RichText data={description} />
            </div>
          )}

          {clients.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                {t("clientsIn", { title })}
              </h2>
              <ul className="flex flex-wrap gap-2.5">
                {clients.map((client) => (
                  <li
                    key={client.name}
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2"
                  >
                    <img src={client.logo} alt="" className="h-4 w-auto" />
                    <span className="text-xs font-medium">{client.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-16 flex flex-col items-start gap-3 border-t border-dashed pt-10">
            <p className="text-lg font-semibold">{ctaHeading ?? t("ctaHeading", { title })}</p>
            <Button
              nativeButton={false}
              className="bg-black text-white hover:bg-black/80"
              render={<Link href="/book-a-consultation" />}
            >
              {tCommon("bookConsultation")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { IndustryDetail };
