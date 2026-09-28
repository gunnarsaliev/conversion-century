import { cache } from "react";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Faq28 } from "@/components/faq28";
import { Hero104 } from "@/components/hero104";
import hero104Data from "@/data/hero104.json";
import { Logos35 } from "@/components/logos35";
import { Testimonial30 } from "@/components/testimonial30";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import type { Media } from "../../../../../../../payload-types";
import { Hero297 } from "@/components/hero297";
import { Feature67 } from "@/components/feature67";
import { Feature99 } from "@/components/feature99";
import { Feature18 } from "@/components/feature18";
import { RightChoice } from "@/components/right-choice";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type ListItem = { text: string; id?: string | null };

const getService = cache((slug: string, locale: string) =>
  findByLocalizedSlug("services", slug, locale),
);

// Paragraph fields are stored as one textarea separated by blank lines.
function splitParagraphs(text?: string | null) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function Paragraphs({ text }: { text?: string | null }) {
  return splitParagraphs(text).map((p, i) => (
    <p key={i} className="mt-4 text-muted-foreground">
      {p}
    </p>
  ));
}



function CheckList({ items }: { items?: ListItem[] | null }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="flex gap-3">
          <Check className="mt-1 size-5 shrink-0 text-primary" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <h2 className="font-poppins text-3xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

type HeadingSection = {
  heading?: string | null;
  paragraphs?: string | null;
  listIntro?: string | null;
  list?: ListItem[] | null;
};

function HeadingListSection({ section }: { section?: HeadingSection | null }) {
  if (!section?.heading) return null;
  return (
    <section className="mt-24">
      <SectionHeading>{section.heading}</SectionHeading>
      <Paragraphs text={section.paragraphs} />
      {section.listIntro && (
        <p className="mt-6 font-medium">{section.listIntro}</p>
      )}
      <CheckList items={section.list} />
    </section>
  );
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const service = await getService(slug, locale);

  if (!service) return {};

  return {
    title: service.meta?.title || service.name,
    description: service.meta?.description || service.hero?.description || undefined,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = await getService(slug, locale);

  if (!service) {
    notFound();
  }

  const image =
    service.image && typeof service.image === "object" ? service.image : null;

  const payload = await getPayload({ config });
  const { docs: clients } = await payload.find({
    collection: "clients",
    where: {
      showOnWebsite: { equals: true },
      logo: { exists: true },
    },
    depth: 1,
    limit: 50,
  });

  const clientLogos = clients
    .filter(
      (client): client is typeof client & { logo: Media } =>
        typeof client.logo === "object" && client.logo !== null && !!client.logo.url,
    )
    .map((client) => ({
      name: client.companyName,
      src: client.logo.url as string,
    }));

  const { hero, partnership, whatIs, includes, process, fit, whyUs, faq } =
    service;

  return (
    <div>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 pt-8 text-sm text-muted-foreground sm:px-6 lg:px-8"
      >
        <Link href="/website" className="hover:text-foreground">
          Home
        </Link>
        {" / "}
        <Link href="/website/services" className="hover:text-foreground">
          Services
        </Link>
        {" / "}
        <span className="text-foreground">{service.name}</span>
      </nav>

      <Hero104
        heading={hero?.heading || service.name}
        description={hero?.description ?? undefined}
        highlights={hero?.highlights?.map((h) => h.text)}
        avatars={hero104Data.avatars}
        socialProof={hero104Data.socialProof}
        image={
          image?.url
            ? { src: image.url, alt: image.alt ?? service.name }
            : undefined
        }
      />

      {partnership?.heading && (
        <Hero297
          badge={
            partnership.eyebrow ? { text: partnership.eyebrow } : undefined
          }
          heading={partnership.heading}
          description={partnership.paragraphs ?? ""}
        />
      )}

      <Logos35 logos={clientLogos.length > 0 ? clientLogos : undefined} />
      {whatIs?.heading && (
        <Hero297
          heading={whatIs.heading}
          description={whatIs.paragraphs ?? ""}
        />
      )}

      {includes?.heading && includes.items && includes.items.length > 0 && (
        <Feature18
          heading={includes.heading}
          description={includes.description}
          features={includes.items.map((item) => ({
            title: item.title,
            description: item.paragraphs,
          }))}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <HeadingListSection section={service.priorities} />
      </div>

      {process?.heading && process.steps && process.steps.length > 0 && (
        <Feature99
          heading={process.heading}
          steps={process.steps}
          note={process.note}
        />
      )}

      {(fit?.rightChoice?.heading || fit?.notRight?.heading) && (
        <RightChoice
          rightChoice={{
            ...fit.rightChoice,
            list: fit.rightChoice?.list?.map((item) => item.text),
          }}
          notRight={{
            ...fit.notRight,
            paragraphs: splitParagraphs(fit.notRight?.paragraphs),
          }}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">

        {whyUs?.heading && (
          <section className="mt-24">
            <SectionHeading>{whyUs.heading}</SectionHeading>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {whyUs.items?.map((item, i) => (
                <div key={item.id ?? i} className="rounded-2xl border p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <HeadingListSection section={service.measurement} />
        <HeadingListSection section={service.teamExtension} />
      </div>

      <Testimonial30 />

      {faq?.items && faq.items.length > 0 ? (
        <Faq28
          heading={faq.heading ?? undefined}
          items={faq.items.map(({ question, answer }) => ({ question, answer }))}
        />
      ) : (
        <Faq28 />
      )}
    </div>
  );
}
