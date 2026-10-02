import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Blog28, type Blog28Post } from "@/components/blog28";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage } from "@/lib/seo/metadata";
import { pageBreadcrumbs } from "@/lib/seo/pages";
import { graph, personSchema, profilePageSchema } from "@/lib/seo/schema";
import { localizedUrl, toLocale } from "@/lib/seo/site";
import type { Media, User } from "../../../../../../../payload-types";

type AuthorPageProps = {
  params: Promise<{ id: string }>;
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

const getAuthor = cache(async (id: string) => {
  const payload = await getPayload({ config });
  return payload
    .findByID({
      collection: "users",
      id,
      depth: 1,
      // Local API bypasses Users' login-gated `read` access — needed so a
      // logged-out visitor can view this public author page.
    })
    .catch(() => null);
});

// Public name only — never fall back to the email in metadata.
const publicName = (author: User) =>
  [author.firstName, author.lastName].filter(Boolean).join(" ");

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = toLocale(await getLocale());
  const author = await getAuthor(id);

  if (!author || !publicName(author)) return {};

  return buildMetadata({
    title: publicName(author),
    description: author.jobTitle,
    path: `/website/authors/${author.id}`,
    locale,
    image: mediaImage(author.profileImage),
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const author = await getAuthor(id);

  if (!author) {
    notFound();
  }

  const name = [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email;

  const avatar =
    author.profileImage && typeof author.profileImage === "object"
      ? (author.profileImage as Media)
      : null;

  const { docs: posts } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    depth: 1,
    limit: 100,
    sort: "-publishedAt",
    where: {
      author: { equals: author.id },
      _status: { equals: "published" },
    },
  });

  const items: Blog28Post[] = posts.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === "object"
        ? (post.featuredImage as Media)
        : null;

    return {
      date: formatDate(post.publishedAt, locale),
      author: name,
      title: post.title,
      image: image?.url ?? "",
      link: `/website/blog/${post.slug ?? post.id}`,
      description: post.excerpt ?? "",
    };
  });

  const seoLocale = toLocale(locale);
  const authorPath = `/website/authors/${author.id}`;
  const fullName = publicName(author);

  return (
    <div>
      {fullName && (
        <JsonLd
          data={graph(
            await pageBreadcrumbs(seoLocale, ["blog", { name: fullName, path: authorPath }]),
            profilePageSchema(
              seoLocale,
              localizedUrl(authorPath, seoLocale),
              personSchema({
                locale: seoLocale,
                id: author.id,
                name: fullName,
                jobTitle: author.jobTitle,
                image: avatar?.url,
              }),
            ),
          )}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="h-20 w-20 border">
            {avatar?.url && <AvatarImage src={avatar.url} alt={name} />}
            <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{name}</h1>
            {author.jobTitle && (
              <p className="mt-1 text-muted-foreground">{author.jobTitle}</p>
            )}
          </div>
        </div>
      </div>

      <Blog28 heading="" posts={items} />
    </div>
  );
}
