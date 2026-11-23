import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RichText } from "@/components/rich-text";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { translated } from "@/utilities/findByLocalizedSlug";

export async function generateMetadata() {
  return staticPageMetadata("faqs");
}

// FAQ pages translated into `locale`. Cached across requests; refreshed when
// an FAQ changes.
async function getFaqs(locale: string) {
  "use cache";
  cmsCache("faqs");
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "faqs",
    locale: locale as "en" | "bg",
    where: translated,
    depth: 0,
    pagination: false,
    sort: "title",
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      questions: { id: true },
    },
  });
  return docs;
}

export default async function FaqsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FaqsPage");

  const faqs = await getFaqs(locale);

  return (
    <>
      <StaticPageJsonLd
        page="faqs"
        items={faqs.map((faq) => ({
          name: faq.title,
          path: `/faqs/${faq.slug}`,
        }))}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {faqs.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq) => {
              const questionCount = faq.questions?.length ?? 0;
              return (
                <Link key={faq.id} href={`/faqs/${faq.slug}`} className="group">
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <h2>{faq.title}</h2>
                      </CardTitle>
                      {questionCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("questionCount", { count: questionCount })}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-4">
                      {faq.shortDescription && (
                        <div className="prose prose-sm line-clamp-4 max-w-none text-muted-foreground dark:prose-invert prose-p:my-0">
                          <RichText data={faq.shortDescription} />
                        </div>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {t("viewQuestions")}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
