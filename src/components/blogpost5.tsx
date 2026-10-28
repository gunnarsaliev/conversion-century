"use client";

import { Home } from "lucide-react";
import { FaFacebookF, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PostRichText } from "@/components/blog-rich-text";
import { TableOfContents } from "@/components/table-of-contents";

interface RelatedPost {
  title: string;
  href: string;
  image?: string;
  dateLabel?: string;
}

interface Blogpost5Props {
  title: string;
  authorName?: string;
  authorAvatar?: string;
  // Author page path (see lib/seo/site authorPath).
  authorHref?: string;
  dateLabel?: string;
  // Each links to its category page; the first one ends the breadcrumb.
  categories?: { label: string; href: string }[];
  relatedPosts?: RelatedPost[];
  featuredImage?: string;
  content?: SerializedEditorState;
  locale?: "en" | "bg";
  className?: string;
}

const Blogpost5 = ({
  title,
  authorName,
  authorAvatar,
  authorHref,
  dateLabel,
  categories = [],
  relatedPosts = [],
  featuredImage,
  content,
  locale = "en",
  className,
}: Blogpost5Props) => {
  const t = useTranslations("Blogpost5");
  const tCommon = useTranslations("Common");

  const related =
    relatedPosts.length > 0 ? (
      <div>
        <p className="font-medium text-muted-foreground">{t("related")}</p>
        <ul className="mt-3 space-y-4">
          {relatedPosts.map((post) => (
            <li key={post.href}>
              <Link href={post.href} className="group flex gap-3">
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="size-16 shrink-0 rounded-md border object-cover"
                  />
                )}
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                    {post.title}
                  </span>
                  {post.dateLabel && (
                    <span className="text-muted-foreground">{post.dateLabel}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />} aria-label={tCommon("home")}>
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/blog" />}>{t("breadcrumb")}</BreadcrumbLink>
            </BreadcrumbItem>
            {/* The post's first category rather than repeating the h1. */}
            {categories[0] && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={categories[0].href} />}>
                    {categories[0].label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-9 mb-7 text-4xl font-bold md:mb-10 md:text-7xl">
          {title}
        </h1>
        {(authorName || dateLabel) && (
          <div className="flex items-center gap-3 text-sm md:text-base">
            {authorAvatar && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={authorAvatar} alt={authorName ?? ""} />
              </Avatar>
            )}
            <span>
              {authorName &&
                (authorHref ? (
                  <Link
                    href={authorHref}
                    className="font-medium hover:underline"
                  >
                    {authorName}
                  </Link>
                ) : (
                  <span className="font-medium">{authorName}</span>
                ))}
              {dateLabel && (
                <span className="ml-1 text-muted-foreground">
                  {t("publishedOn", { date: dateLabel })}
                </span>
              )}
            </span>
          </div>
        )}
        <div className="relative mt-12 grid max-w-7xl gap-14 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-1 lg:order-none lg:col-span-8">
            {featuredImage && (
              <img
                src={featuredImage}
                alt={title}
                className="mt-0 mb-8 aspect-video w-full rounded-lg border object-cover"
              />
            )}
            {content && (
              <div className="prose dark:prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-2 prose-headings:scroll-mt-24 prose-p:my-3">
                <PostRichText data={content} locale={locale} />
              </div>
            )}
          </div>
          {/* Below the article on mobile, beside it on desktop. */}
          <div className="order-2 flex h-fit flex-col text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs">
            <div className="order-1 flex flex-col gap-2 lg:order-none">
              <p className="font-medium text-muted-foreground">
                {t("share")}
              </p>
              <ul className="flex gap-2">
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full"
                  >
                    <a href="#">
                      <FaFacebookF className="h-4 w-4 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-primary group-hover:text-primary" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full"
                  >
                    <a href="#">
                      <FaLinkedin className="h-4 w-4 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-primary group-hover:text-primary" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full"
                  >
                    <a href="#">
                      <FaXTwitter className="h-4 w-4 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-primary group-hover:text-primary" />
                    </a>
                  </Button>
                </li>
              </ul>
            </div>
            {content && (
              <div className="order-2 mt-8 lg:order-none">
                <TableOfContents content={content} locale={locale} />
              </div>
            )}
            {related && <div className="mt-8">{related}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Blogpost5 };
export type { RelatedPost };
