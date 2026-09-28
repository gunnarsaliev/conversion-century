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
import { Logos35 } from "@/components/logos35";
import { Testimonial30 } from "@/components/testimonial30";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import type { Media } from "../../../../../../../payload-types";

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
        image={
          image?.url
            ? { src: image.url, alt: image.alt ?? service.name }
            : undefined
        }
      />

      <Logos35 logos={clientLogos.length > 0 ? clientLogos : undefined} />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {partnership?.heading && (
          <section>
            {partnership.eyebrow && (
              <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {partnership.eyebrow}
              </span>
            )}
            <SectionHeading>{partnership.heading}</SectionHeading>
            <Paragraphs text={partnership.paragraphs} />
          </section>
        )}

        {whatIs?.heading && (
          <section className="mt-24">
            <SectionHeading>{whatIs.heading}</SectionHeading>
            <Paragraphs text={whatIs.paragraphs} />
          </section>
        )}

        {includes?.heading && (
          <section className="mt-24">
            <SectionHeading>{includes.heading}</SectionHeading>
            {includes.description && (
              <p className="mt-4 text-muted-foreground">
                {includes.description}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-8">
              {includes.items?.map((item, i) => (
                <div key={item.id ?? i} className="flex gap-3">
                  <Check className="mt-1 size-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <Paragraphs text={item.paragraphs} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <HeadingListSection section={service.priorities} />

        {process?.heading && (
          <section className="mt-24">
            <SectionHeading>{process.heading}</SectionHeading>
            <ol className="mt-8 flex flex-col gap-6">
              {process.steps?.map((step, i) => (
                <li key={step.id ?? i} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    {step.description && (
                      <p className="mt-1 text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {process.note && (
              <p className="mt-8 text-muted-foreground">{process.note}</p>
            )}
          </section>
        )}

        {(fit?.rightChoice?.heading || fit?.notRight?.heading) && (
          <section className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
            {fit.rightChoice?.heading && (
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-semibold">
                  {fit.rightChoice.heading}
                </h2>
                {fit.rightChoice.listIntro && (
                  <p className="mt-4 text-muted-foreground">
                    {fit.rightChoice.listIntro}
                  </p>
                )}
                <CheckList items={fit.rightChoice.list} />
              </div>
            )}
            {fit.notRight?.heading && (
              <div className="rounded-2xl border p-6">
                <h2 className="text-xl font-semibold">{fit.notRight.heading}</h2>
                <Paragraphs text={fit.notRight.paragraphs} />
                {fit.notRight.cta?.label && fit.notRight.cta.href && (
                  <Link
                    href={fit.notRight.cta.href}
                    className="mt-6 inline-block font-medium text-primary hover:underline"
                  >
                    {fit.notRight.cta.label}
                  </Link>
                )}
              </div>
            )}
          </section>
        )}

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
