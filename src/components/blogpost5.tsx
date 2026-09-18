"use client";

import { Home } from "lucide-react";
import { FaFacebookF, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { cn } from "cn";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PostRichText } from "@/components/blog-rich-text";
import { TableOfContents } from "@/components/table-of-contents";

interface Blogpost5Props {
  title: string;
  authorName?: string;
  authorAvatar?: string;
  authorId?: number | string;
  dateLabel?: string;
  featuredImage?: string;
  content?: SerializedEditorState;
  locale?: "en" | "bg";
  className?: string;
}

const Blogpost5 = ({
  title,
  authorName,
  authorAvatar,
  authorId,
  dateLabel,
  featuredImage,
  content,
  locale = "en",
  className,
}: Blogpost5Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/website/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-9 mb-7 max-w-3xl text-4xl font-bold md:mb-10 md:text-7xl">
          {title}
        </h1>
        {(authorName || dateLabel) && (
          <div className="flex items-center gap-3 text-sm md:text-base">
            {authorAvatar && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={authorAvatar} />
              </Avatar>
            )}
            <span>
              {authorName &&
                (authorId ? (
                  <a
                    href={`/website/authors/${authorId}`}
                    className="font-medium hover:underline"
                  >
                    {authorName}
                  </a>
                ) : (
                  <span className="font-medium">{authorName}</span>
                ))}
              {dateLabel && (
                <span className="ml-1 text-muted-foreground">
                  on {dateLabel}
                </span>
              )}
            </span>
          </div>
        )}
        <div className="relative mt-12 grid max-w-7xl gap-14 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-2 lg:order-none lg:col-span-8">
            {featuredImage && (
              <img
                src={featuredImage}
                alt={title}
                className="mt-0 mb-8 aspect-video w-full rounded-lg border object-cover"
              />
            )}
            {content && (
              <div className="prose dark:prose-invert max-w-none">
                <PostRichText data={content} locale={locale} />
              </div>
            )}
          </div>
          <div className="order-1 flex h-fit flex-col text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs">
            <div className="order-1 flex flex-col gap-2 lg:order-none">
              <p className="font-medium text-muted-foreground">
                Share this article:
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
          </div>
        </div>
      </div>
    </section>
  );
};

export { Blogpost5 };
