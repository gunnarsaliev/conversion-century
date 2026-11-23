import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Link } from "@/i18n/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { RichText } from "@/components/rich-text";
import { cmsCache } from "@/lib/cms/cache";
import { slugStaticParams } from "@/lib/cms/slugs";
import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { faqSchema, graph } from "@/lib/seo/schema";
import { toLocale } from "@/lib/seo/site";
import {
  findByLocalizedSlug,
  translated,
} from "@/utilities/findByLocalizedSlug";
import type { Faq } from "../../../../../../payload-types";

type FaqDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getFaq = cache((slug: string, locale: string) =>
  findByLocalizedSlug("faqs", slug, locale),
);

// Questions with an answer in the current locale.
function answeredQuestions(faq: Faq) {
  return (faq.questions ?? []).flatMap((item) =>
    item.question && richTextToPlainText(item.answer)
      ? [
          {
            id: item.id,
            question: item.question,
            answer: item.answer as SerializedEditorState,
          },
        ]
      : [],
  );
}

// Other translated FAQ pages, for the links at the bottom of the page.
async function getOtherFaqs(excludeId: number, locale: string) {
  "use cache";
  cmsCache("faqs");
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "faqs",
    locale: locale as "en" | "bg",
    where: { ...translated, id: { not_equals: excludeId } },
    depth: 0,
    pagination: false,
    sort: "title",
    select: { title: true, slug: true },
  });
  return docs;
}

// Published FAQs are prerendered at build; new ones render on first visit
// and are then cached.
export const generateStaticParams = slugStaticParams("faqs");

export async function generateMetadata({
  params,
}: FaqDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const faq = await getFaq(slug, locale);

  if (!faq) return {};

  return buildMetadata({
    title: faq.meta?.title || faq.title,
    description:
      faq.meta?.description ||
      truncate(richTextToPlainText(faq.shortDescription)),
    path: await localizedDocPath("faqs", faq.id, "/faqs"),
    locale: toLocale(locale),
    image: mediaImage(faq.image),
    // A page with no answered questions in this locale is thin content.
    noindex: answeredQuestions(faq).length === 0,
  });
}

export default async function FaqDetailPage({ params }: FaqDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const faq = await getFaq(slug, locale);

  if (!faq) {
    notFound();
  }

  const [otherFaqs, t, tCommon] = await Promise.all([
    getOtherFaqs(faq.id, locale),
    getTranslations("FaqsPage"),
    getTranslations("Common"),
  ]);

  const questions = answeredQuestions(faq);
  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("faqs", faq.id, "/faqs");

  return (
    <div>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ["faqs", { name: faq.title, path }]),
          faqSchema(
            questions.map((item) => ({
              question: item.question,
              answer: richTextToPlainText(item.answer),
            })),
          ),
        )}
      />
      <nav
        aria-label={tCommon("breadcrumb")}
        className="mx-auto max-w-4xl px-4 pt-8 text-sm text-muted-foreground sm:px-6 lg:px-8"
      >
        <Link href="/" className="hover:text-foreground">
          {tCommon("home")}
        </Link>
        {" / "}
        <Link href="/faqs" className="hover:text-foreground">
          {t("breadcrumb")}
        </Link>
        {" / "}
        <span className="text-foreground">{faq.title}</span>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <header>
          <h1 className="text-3xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            {faq.title}
          </h1>
          {faq.shortDescription && (
            <div className="prose mt-6 max-w-none text-lg text-muted-foreground dark:prose-invert">
              <RichText data={faq.shortDescription} />
            </div>
          )}
        </header>

        {questions.length === 0 ? (
          <p className="mt-16 text-muted-foreground">{t("empty")}</p>
        ) : (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("questions")}
            </h2>
            {/* Closed panels stay in the HTML (hidden="until-found"), so
                crawlers and AI assistants read every answer and the
                browser's find-in-page opens the matching one. Base UI
                unmounts closed panels by default. */}
            <Accordion hiddenUntilFound className="mt-8">
              {questions.map((item, index) => (
                <AccordionItem key={item.id ?? index} value={item.id ?? `item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline md:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground md:prose-base dark:prose-invert prose-p:my-2">
                    <RichText data={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {otherFaqs.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("otherCategories")}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {otherFaqs.map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/faqs/${other.slug}`}
                    className="inline-flex rounded-full border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary"
                  >
                    {other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
