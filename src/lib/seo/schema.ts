import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  Event,
  FAQPage,
  JobPosting,
  Organization,
  Person,
  ProfilePage,
  Service,
  Thing,
  WebSite,
} from "schema-dts";

import {
  ORGANIZATION,
  SITE_NAME,
  SITE_URL,
  authorPath,
  localizedUrl,
  type Locale,
  type LocalizedPath,
} from "./site";

// Stable node ids so every page can reference the organization and website
// instead of repeating them.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const orgRef = { "@id": ORGANIZATION_ID } as const;

const HOME_PATH = "/";

export function graph(...nodes: Array<Thing | null | undefined | false>) {
  return {
    "@context": "https://schema.org" as const,
    "@graph": nodes.filter(Boolean) as Thing[],
  };
}

// The markets the company serves (see the About page copy).
const AREA_SERVED = [
  { "@type": "Country", name: "Bulgaria" },
  { "@type": "Place", name: "Europe" },
] as const;

export function organizationSchema(locale: Locale, description?: string): Organization {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: localizedUrl(HOME_PATH, locale),
    description,
    logo: { "@type": "ImageObject", url: ORGANIZATION.logo },
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.telephone,
    vatID: ORGANIZATION.vatID,
    address: { "@type": "PostalAddress", ...ORGANIZATION.address },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: ORGANIZATION.email,
      telephone: ORGANIZATION.telephone,
      availableLanguage: ["en", "bg"],
    },
    areaServed: [...AREA_SERVED],
    sameAs: ORGANIZATION.sameAs,
  };
}

export function websiteSchema(locale: Locale): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: localizedUrl(HOME_PATH, locale),
    inLanguage: locale,
    publisher: orgRef,
  };
}

export type Crumb = { name: string; path: LocalizedPath };

// `trail` excludes the home crumb, which is always added first.
export function breadcrumbSchema(
  locale: Locale,
  homeName: string,
  trail: Crumb[],
): BreadcrumbList {
  const items = [{ name: homeName, path: HOME_PATH }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(item.path, locale),
    })),
  };
}

// An index page (blog, services, …) and the items it links to, so search
// and AI engines can see the collection, not just a page with links.
export function collectionPageSchema({
  locale,
  path,
  name,
  items,
}: {
  locale: Locale;
  path: LocalizedPath;
  name: string;
  items: Crumb[];
}): CollectionPage {
  const url = localizedUrl(path, locale);
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: localizedUrl(item.path, locale),
      })),
    },
  };
}

type ArticleInput = {
  locale: Locale;
  path: LocalizedPath;
  headline: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  author?: Person | null;
  // Category names.
  articleSection?: string[];
};

function articleFields({
  locale,
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  articleSection,
}: ArticleInput) {
  const url = localizedUrl(path, locale);
  return {
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline,
    description: description ?? undefined,
    image: image ?? undefined,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? undefined,
    inLanguage: locale,
    author: author ?? orgRef,
    publisher: orgRef,
    articleSection: articleSection?.length ? articleSection : undefined,
  };
}

export function blogPostingSchema(input: ArticleInput): BlogPosting {
  return { "@type": "BlogPosting", ...articleFields(input) };
}

export function articleSchema(input: ArticleInput & { about?: string | null }): Article {
  const { about, ...rest } = input;
  return {
    "@type": "Article",
    ...articleFields(rest),
    ...(about ? { about: { "@type": "Organization", name: about } } : {}),
  };
}

export function personSchema({
  locale,
  id,
  slug,
  name,
  jobTitle,
  image,
}: {
  locale: Locale;
  id: string | number;
  slug?: string | null;
  name: string;
  jobTitle?: string | null;
  image?: string | null;
}): Person {
  const url = localizedUrl(authorPath({ id, slug }), locale);
  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name,
    url,
    jobTitle: jobTitle ?? undefined,
    image: image ?? undefined,
    worksFor: orgRef,
  };
}

export function profilePageSchema(
  locale: Locale,
  url: string,
  person: Person,
): ProfilePage {
  return {
    "@type": "ProfilePage",
    url,
    inLanguage: locale,
    mainEntity: person,
  };
}

export function serviceSchema({
  locale,
  path,
  name,
  description,
  image,
  audience,
}: {
  locale: Locale;
  path: LocalizedPath;
  name: string;
  description?: string | null;
  image?: string | null;
  audience?: string | null;
}): Service {
  const url = localizedUrl(path, locale);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    url,
    description: description ?? undefined,
    image: image ?? undefined,
    provider: orgRef,
    areaServed: [...AREA_SERVED],
    ...(audience ? { audience: { "@type": "BusinessAudience", name: audience } } : {}),
  };
}

export function faqSchema(
  items: Array<{ question?: string | null; answer?: string | null }> | null | undefined,
): FAQPage | null {
  const entries = (items ?? []).filter(
    (item): item is { question: string; answer: string } =>
      Boolean(item.question && item.answer),
  );
  if (entries.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

const ONLINE_LOCATION = /^(online|онлайн|virtual|виртуално)$/i;

export function eventSchema({
  locale,
  path,
  name,
  description,
  image,
  startDate,
  endDate,
  location,
  externalUrl,
}: {
  locale: Locale;
  path: LocalizedPath;
  name: string;
  description?: string | null;
  image?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  externalUrl?: string | null;
}): Event {
  const url = localizedUrl(path, locale);
  const isOnline = !location || ONLINE_LOCATION.test(location.trim());
  return {
    "@type": "Event",
    "@id": `${url}#event`,
    name,
    url,
    description: description ?? undefined,
    image: image ?? undefined,
    startDate,
    endDate: endDate ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: isOnline
      ? { "@type": "VirtualLocation", url: externalUrl || url }
      : { "@type": "Place", name: location!, address: location! },
    organizer: orgRef,
    inLanguage: locale,
  };
}

export function jobPostingSchema({
  locale,
  path,
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  location,
}: {
  locale: Locale;
  path: LocalizedPath;
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string | null;
  employmentType?: "full-time" | "full-time-hybrid" | "part-time" | null;
  location?: string | null;
}): JobPosting {
  const isRemote = !location || /remote|дистанционно|онлайн/i.test(location);
  return {
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    validThrough: validThrough ?? undefined,
    url: localizedUrl(path, locale),
    employmentType:
      employmentType === "part-time"
        ? "PART_TIME"
        : employmentType === "full-time" || employmentType === "full-time-hybrid"
          ? "FULL_TIME"
          : undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      sameAs: ORGANIZATION.sameAs,
      logo: ORGANIZATION.logo,
    },
    ...(isRemote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: "Bulgaria" },
        }
      : {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: location!, addressCountry: "BG" },
          },
        }),
  };
}
