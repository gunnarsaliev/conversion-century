import { Suspense } from "react";
import {
  ArrowRightLeft,
  ChartLine,
  Check,
  FileText,
  LayoutTemplate,
  MessageCircleQuestionMark,
  SlidersHorizontal,
} from "lucide-react";

import { CountryFlags } from "@/components/offer/country-flags";
import { KeywordTable } from "@/components/offer/keyword-table";
import staticData from "@/data/offers/static.json";
import type { Offer, OfferStatic } from "@/types/offer";
import certificationsImage from "../offer/certifivations.png";
import { Logos30 } from "@/components/logos30";
import { Card, CardContent } from "@/components/ui/card";
import { fillPlaceholders, formatAmount, formatNumber } from "@/components/offer/offer-ui";
import offerData from "@/data/offers/ayurvedabio-seo-migration.json";
import { Feature99 } from "@/components/feature99";
import { PILLAR_ICONS } from "@/components/offer/offer-agency";
import { Feature229 } from "@/components/feature229";
import { Pricing117 } from "@/components/pricing117";
import { Pricing118 } from "@/components/pricing118";
import { PdfDownloadButton } from "@/components/offer/pdf-download-button";
import { Faq2 } from "@/components/faq2";
import { List3 } from "@/components/list3";
import { Pricing78 } from "@/components/pricing78";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { ArticleSkeleton } from "@/components/skeletons";

const content = staticData as OfferStatic;

// One icon per technical group: admin & meta, architecture, migration.
const TECHNICAL_ICONS = [SlidersHorizontal, LayoutTemplate, ArrowRightLeft];
// One icon per content group: strategy, categories & blog, FAQ.
const CONTENT_ICONS = [ChartLine, FileText, MessageCircleQuestionMark];
const offer = offerData as Offer;

const { metricLabels } = content.audit;
const stats: { title: string; value: string; suffix?: string }[] = [
  {
    title: metricLabels.domainRating,
    value: formatNumber(offer.metrics.domainRating),
    suffix: "от 100",
  },
  { title: metricLabels.backlinks, value: formatNumber(offer.metrics.backlinks) },
  {
    title: metricLabels.organicKeywords,
    value: formatNumber(offer.metrics.organicKeywords),
  },
  {
    title: metricLabels.organicTraffic,
    value: formatNumber(offer.metrics.organicTraffic),
  },
];

async function SpecialOfferPage() {
  // proxy.ts only checks for a session cookie; offers are private.
  await requireDashboardUser();
  return (
    <section className="py-16">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-16">
              {/* Project Info */}
              <div>
                <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Special Offer for
                </p>
                <h1 className="mb-4 text-4xl font-bold">Ayurveda Bio</h1>
                <p className="leading-relaxed text-muted-foreground">
                  Стратегическо предложение за SEO миграция и съдържание
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-6 border-t pt-8">
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Оферта от
                  </p>
                  <p className="font-medium">Мария Сивкова</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Услуга
                  </p>
                  <p className="font-medium">SEO миграция</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Цена
                  </p>
                  <p className="font-medium">€ 2500</p>
                </div>
                {/* Same offer as a PDF, rendered by ./pdf/route.ts. */}
                <PdfDownloadButton href="/special-offer/pdf" />
              </div>

              {/* Navigation */}
              <nav className="border-t pt-8">
                <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
Обобщение
                </p>
                <ul className="space-y-2">
                  <li
                    className="block text-sm transition-colors hover:text-primary"
                  >
              <Check className="mr-2 inline h-4 w-4" /> Преструктуриране на категориите
                  </li>
                  <li
                    className="block text-sm transition-colors hover:text-primary"
                  >
            <Check className="mr-2 inline h-4 w-4" /> Брандови landing страници
                  </li>
                  <li
                    className="block text-sm transition-colors hover:text-primary"
                  >
           <Check className="mr-2 inline h-4 w-4" /> Обхват на миграцията: всички категории, продукти и блог
                  </li>
                  <li
                    className="block text-sm transition-colors hover:text-primary"
                  >
           <Check className="mr-2 inline h-4 w-4" /> 2 седмици ангажимент след миграцията
                  </li>
                  <li
                    className="block text-sm transition-colors hover:text-primary"
                  >
           <Check className="mr-2 inline h-4 w-4" /> Срок за изпълнение: 5 седмици
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Image */}
            {/* <div className="mb-16">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pressed-juice/devin-avery-BRVqq2uak4E-unsplash.jpg"
                alt="Fresh cold-pressed juice bottles"
                className="w-full rounded-lg"
              />
            </div> */}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {/* <p className="lead">
                Основана през 2016 г., Conversion Century се разви и утвърди като доверен партньор за бизнеси, които се стремят към дългосрочен дигитален успех.

Ние съчетаваме надеждността на традиционното SEO с възможностите на търсенето, задвижвано от изкуствен интелект (AI), позиционирайки бранда ви за максимална видимост както в днешната, така и в предстоящата дигитална среда. Нашите вътрешни копирайтъри създават висококачествено съдържание, базирано на факторите E-E-A-T (опит, експертиза, авторитет и доверие), което затвърждава лидерската ви позиция, докато нашите SEO професионалисти разработват стратегии, изцяло съобразени с вашите уникални цели.

С над десетилетие опит, проактивно мислене и непоколебим ангажимент към растежа на нашите клиенти, ние не просто постигаме класирания. Ние ви помагаме да изградите силно, устойчиво онлайн присъствие, което привлича, ангажира и конвертира.
              </p>   */}

              <h2 id="challenge">SEO миграция на Ayurvedabio.com</h2>

              <p>
                Основана през 2016 г., Conversion Century се разви и утвърди като доверен партньор за бизнеси, които се стремят към дългосрочен дигитален успех.

Ние съчетаваме надеждността на традиционното SEO с възможностите на търсенето, задвижвано от изкуствен интелект (AI), позиционирайки бранда ви за максимална видимост както в днешната, така и в предстоящата дигитална среда. Нашите вътрешни копирайтъри създават висококачествено съдържание, базирано на факторите E-E-A-T (опит, експертиза, авторитет и доверие), което затвърждава лидерската ви позиция, докато нашите SEO професионалисти разработват стратегии, изцяло съобразени с вашите уникални цели.

С над десетилетие опит, проактивно мислене и непоколебим ангажимент към растежа на нашите клиенти, ние не просто постигаме класирания. Ние ви помагаме да изградите силно, устойчиво онлайн присъствие, което привлича, ангажира и конвертира.
              </p>
                <img
                  src={certificationsImage.src}
                  alt="Ahrefs Agency Partner, Semrush Certified Agency Partner, Featured on Forbes, Clutch"
                  width={certificationsImage.width}
                  height={certificationsImage.height}
                  className="h-auto w-full"
                />

              {/* Outside `prose` so Typography doesn't restyle the cards. */}
                <h2 id="challenge">За нас</h2>

              {/* Outside `prose` so Typography doesn't restyle the steps. */}
              <Feature99
                heading={null}
                columns={2}
                steps={content.agency.pillars.map((pillar, i) => {
                  const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                  return {
                    title: pillar.title,
                    description: pillar.description,
                    icon: <Icon strokeWidth={1.5} className="size-10 lg:size-12" />,
                  };
                })}
                className="not-prose py-12"
              />
                <h3>Част от нашите клиенти</h3>
              <Logos30 />

              <h3>Държави, в които работим</h3>
              <p>
                Conversion Century си партнира с клиенти в Европа, Северна Америка и други региони по света. Нашите международни проекти в областта на SEO оптимизацията, съдържанието и дигиталния растеж обхващат над 8 държави, като помагаме както на глобални брандове, така и на местни бизнеси да развиват своето онлайн присъствие.
В момента работим на пазарите в Съединените щати, Обединеното кралство, България, Румъния, Гърция, Германия, Италия, Франция, Испания и Португалия.
              </p>
              {/* Outside `prose` so Typography doesn't add list bullets. */}
              <CountryFlags
                countries={content.socialProof.countries}
                className="not-prose mt-6"
              />
              <h3>SEO метрики на сайта | ayurvedabio.com</h3>
              
              {/* Stats Row: the offer's current SEO metrics. */}
              <div className="not-prose my-10 grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold tabular-nums">
                        {stat.value}
                        {stat.suffix && (
                          <span className="ml-1 text-sm font-normal text-muted-foreground">
                            {stat.suffix}
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h3>Част от ключовите думи, за които сайтът се класира</h3>
              <KeywordTable
                keywords={offer.keywords}
                columns={content.audit.columns}
                className="not-prose my-6"
              />

<h2>Обхват на работата</h2>
<h3>Времева рамка и основни етапи на миграцията: Старт 1-ви октомври</h3>

{/* Lists */}

{/* Outside `prose` so Typography doesn't restyle the rows. */}
<List3
  heading={`${content.technical.header} ${offer.siteType}`}
  description={content.technical.description}
  numbered
  groups={content.technical.groups.map((group) => ({
    title: group.title,
    rows: group.items.map((item) => ({ title: item.label, text: item.text })),
  }))}
  className="not-prose py-12"
/>






{/* Outside `prose` so Typography doesn't restyle the questions. */}
<Faq2
  heading={`${content.technical.header} ${offer.siteType}`}
  description={content.technical.description}
  numbered
  groups={content.technical.groups.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({ question: item.label, answer: item.text })),
  }))}
  className="not-prose py-12"
/>
<Feature99 
  heading="Обхват на работата"
  steps={[
    {
      title: "Подготовка",
      description: "Интензивна работа по анализ, SEO задание за програмисти, ключови думи и план за миграция."
    },
    {
      title: "Тестова среда",
      description: "Работа по вече направената първа версия и писане на мета данните по странците"
    },
    {
      title: "Подготовка на старт",
      description: "Свързване на Analytics, GSC, проверка на всички текстове и вътрешни линкове"
    },
    {
      title: "Пускане на сайта",
      description: "Индексиране на страниците, crawl-ване и финални проверки на технически и контент изисквания"
    }
  ]}
  note="Технически и дизайн задания се правят в седмица 1. 
Ако екипът на SEO пише съдържанието, то ще бъде между седмица 2 и 3.
Мета данни и оптимизиране на текстове в седмица 2 и 3. 
"
/> 
{/* Outside `prose` so Typography doesn't indent the list or add bullets. */}
<Feature229
  heading={`${content.technical.header} ${offer.siteType}`}
  description={content.technical.description}
  numbered
  groups={content.technical.groups.map((group, i) => ({
    title: group.title,
    icon: TECHNICAL_ICONS[i % TECHNICAL_ICONS.length],
    features: group.items,
  }))}
  className="not-prose my-16"
/>
{/* Content writing scope; quantities like the blog article count come from the offer. */}
<Feature229
  heading={`${content.contentStrategy.header} ${offer.siteType}`}
  description={content.contentStrategy.description}
  numbered
  groups={content.contentStrategy.groups.map((group, i) => ({
    title: group.title,
    icon: CONTENT_ICONS[i % CONTENT_ICONS.length],
    features: group.items.map((item) => ({
      label: fillPlaceholders(item.label, offer.content),
      text: fillPlaceholders(item.text, offer.content),
    })),
  }))}
  className="not-prose my-16"
/>
              <h3>{content.architecture.header}</h3>
              <ol>
                {content.architecture.steps.map((step) => (
                  <li key={step.title}>
                    <strong>{step.title}</strong>
                    <ul>
                      {step.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              {/* Outside `prose` so Typography doesn't restyle the pricing cards. */}
              <Pricing78
                heading={`${content.pricing.header} ${offer.siteType}`}
                highlights={offer.scopeSummary}
                plans={offer.packages.map((pkg, i) => ({
                  name: `${content.pricing.variantLabel} ${i + 1}: ${pkg.name}${
                    pkg.hours !== undefined ? ` (${pkg.hours} ${content.pricing.hoursLabel})` : ""
                  }`,
                  price: `${formatAmount(pkg.price)} ${content.pricing.currencyLabel}`,
                  features: pkg.features,
                  highlighted: pkg.recommended,
                }))}
                className="not-prose py-16"
              />
{/* Outside `prose` so Typography doesn't restyle the pricing cards. */}
<Pricing118
  heading={`${content.pricing.header} ${offer.siteType}`}
  highlights={offer.scopeSummary}
  optionsHeading={content.pricing.packagesHeader}
  options={offer.packages.map((pkg, i) => ({
    name: `${content.pricing.variantLabel} ${i + 1}: ${pkg.name}${
      pkg.hours !== undefined ? ` (${pkg.hours} ${content.pricing.hoursLabel})` : ""
    }`,
    price: `${content.pricing.priceLabel}: ${formatAmount(pkg.price)} ${content.pricing.currencyLabel}`,
    features: pkg.features,
    highlighted: pkg.recommended,
  }))}
  className="not-prose py-16"
/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Private and per user (session cookie), so it renders per request; the
// layout and this skeleton show immediately.
export default function SpecialOfferPageRoute() {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <SpecialOfferPage />
    </Suspense>
  );
}
