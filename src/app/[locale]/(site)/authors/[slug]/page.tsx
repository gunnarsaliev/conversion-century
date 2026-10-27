import { cache } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Blog28, type Blog28Post } from "@/components/blog28";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { pageBreadcrumbs } from "@/lib/seo/pages";
import { graph, personSchema, profilePageSchema } from "@/lib/seo/schema";
import { getPathname } from "@/i18n/navigation";
import { authorPath, localizedUrl, toLocale } from "@/lib/seo/site";
import type { Media, User } from "../../../../../../payload-types";
import { translated } from "@/utilities/findByLocalizedSlug";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

// By slug, or by id for links from before authors had slugs (the page
// redirects those to the slug URL). The Local API bypasses Users'
// login-gated `read` access — needed so a logged-out visitor can view this
// public author page.
const getAuthor = cache(async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "users",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });
  if (docs[0]) return docs[0];
  if (!/^\d+$/.test(slug)) return null;
  return payload
    .findByID({ collection: "users", id: slug, depth: 1 })
    .catch(() => null);
});

// Public name only — never fall back to the email in metadata.
const publicName = (author: User) =>
  [author.firstName, author.lastName].filter(Boolean).join(" ");

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = toLocale(await getLocale());
  const author = await getAuthor(slug);

  if (!author || !publicName(author)) return {};

  return buildMetadata({
    title: publicName(author),
    description: truncate(author.about) || author.jobTitle,
    path: authorPath(author),
    locale,
    image: mediaImage(author.profileImage),
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const author = await getAuthor(slug);

  if (!author) {
    notFound();
  }

  const path = authorPath(author);
  if (path !== `/authors/${slug}`) {
    permanentRedirect(getPathname({ href: path, locale: toLocale(locale) }));
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
      ...translated,
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
      link: `/blog/${post.slug ?? post.id}`,
      description: post.excerpt ?? "",
    };
  });

  const seoLocale = toLocale(locale);
  const fullName = publicName(author);

  return (
    <div>
      {fullName && (
        <JsonLd
          data={graph(
            await pageBreadcrumbs(seoLocale, ["blog", { name: fullName, path }]),
            profilePageSchema(
              seoLocale,
              localizedUrl(path, seoLocale),
              personSchema({
                locale: seoLocale,
                id: author.id,
                slug: author.slug,
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
          {author.about && (
            <p className="max-w-2xl whitespace-pre-line text-muted-foreground">
              {author.about}
            </p>
          )}
        </div>
      </div>

      <Blog28 heading="" posts={items} />
    </div>
  );
}
