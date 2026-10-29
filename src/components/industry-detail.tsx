import { RichText } from "@/components/rich-text";
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
import { CmsImage } from "@/components/cms-image";

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
  className?: string;
}

// Detail page layout for industries.
const IndustryDetail = ({
  label,
  title,
  image,
  description,
  clients = [],
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
                <BreadcrumbLink render={<Link href="/industries" />}>
                  {t("breadcrumb")}
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

          {clients.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                {t("clientsIn", { title })}
              </h2>
              <ul className="flex flex-wrap gap-2.5">
                {clients.map((client) => (
                  <li
                    key={client.name}
                    className="flex items-center rounded-full border border-border bg-card px-5 py-2.5"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={client.logo}
                      alt={client.name}
                      title={client.name}
                      className="h-7 w-auto max-w-28 object-contain"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {image && (
            <CmsImage
              src={image}
              alt={title}
              sizes="(min-width: 1280px) 1280px, 100vw"
              // Right under the h1, so usually the LCP element.
              preload
              wrapperClassName="mt-10 aspect-video w-full rounded-lg"
            />
          )}

          {description && (
            <div className="prose mt-10 max-w-none dark:prose-invert">
              <RichText data={description} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { IndustryDetail };
