import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
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
import { Separator } from "@/components/ui/separator";

interface CaseStudy1Achievement {
  value: string;
  metric: string;
}

interface CaseStudy1Props {
  title: string;
  overview?: string;
  image?: string;
  achievements?: CaseStudy1Achievement[];
  description?: SerializedEditorState;
  client?: {
    name: string;
    logo?: string;
    industries?: { title: string; href: string }[];
  };
  className?: string;
}

const CaseStudy1 = ({
  title,
  overview,
  image,
  achievements = [],
  description,
  client,
  className,
}: CaseStudy1Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb className="mb-6 lg:mb-10">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/website" />}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/website/case-studies" />}>
                  Case studies
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative flex-col gap-10 lg:flex lg:flex-row lg:justify-between">
            <div className="lg:max-w-[692px]">
              <h1 className="text-3xl font-extrabold text-pretty">{title}</h1>
              {overview && (
                <p className="mt-2 text-lg text-muted-foreground">{overview}</p>
              )}
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="my-8 aspect-video w-full rounded-lg object-cover"
                />
              )}
              {achievements.length > 0 && (
                <div className="my-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <p className="text-4xl font-semibold sm:text-5xl">
                        {achievement.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.metric}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {description && (
                <div className="prose mb-8 max-w-full lg:max-w-prose dark:prose-invert">
                  <RichText data={description} />
                </div>
              )}
            </div>
            <div className="h-fit mt-10 lg:sticky lg:top-24 lg:mt-0 lg:w-96 lg:shrink-0">
              {client?.logo && (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="mb-6 w-20"
                />
              )}
              {overview && (
                <>
                  <p className="mb-1.5 text-sm font-semibold">Overview</p>
                  <p className="mb-5 text-sm text-muted-foreground">
                    {overview}
                  </p>
                </>
              )}
              {client && (
                <>
                  <p className="mb-1.5 text-sm font-semibold">Client</p>
                  <p className="mb-5 text-sm text-muted-foreground">
                    {client.name}
                  </p>
                  {client.industries && client.industries.length > 0 && (
                    <>
                      <p className="mb-1.5 text-sm font-semibold">Industry</p>
                      <ul className="mb-5 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                        {client.industries.map((industry) => (
                          <li key={industry.href}>
                            <Link
                              href={industry.href}
                              className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                              {industry.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
              {(overview || client) && <Separator className="my-5" />}
              <p className="mb-3 text-sm font-semibold">Want to learn more?</p>
              <Button
                size="sm"
                nativeButton={false}
                className="bg-black text-white hover:bg-black/80"
                render={<Link href="/website/book-a-consultation" />}
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CaseStudy1 };
