import { ChevronRight, Download, LayoutDashboard } from "lucide-react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { TranslationImport } from "@/components/dashboard/translation-import";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardLocale, getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdmin } from "@/lib/roles";
import { translatableCollections } from "@/lib/translations/core";
import { exportCollection } from "@/lib/translations/export";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Content translations (EN → BG)
// ---------------------------------------------------------------------------
//
// Export: per collection, the localized fields that have English text but no
// Bulgarian yet, as JSON for a translator (lib/translations/export). Import:
// the translated files back, previewed first and then applied
// (components/dashboard/translation-import). Admins only, since importing
// writes to the content collections.
// A route handler that serves an attachment, so a plain <a> rather than <Link>.
const downloadHref = (collection: string) =>
  `/dashboard/translations/download?collection=${collection}`;

export default async function TranslationsPage() {
  const user = await requireDashboardUser();
  if (!isAdmin(user)) notFound();

  const t = await getDashboardTranslations("Translations");
  const tCommon = await getDashboardTranslations("Common");
  const locale = await getDashboardLocale();
  const payload = await getPayload({ config });

  const rows = await Promise.all(
    translatableCollections(payload).map(async (slug) => ({
      slug,
      ...(await exportCollection(payload, slug)).summary,
    })),
  );
  const totals = rows.reduce(
    (sum, row) => ({ docs: sum.docs + row.docs, fields: sum.fields + row.fields, words: sum.words + row.words }),
    { docs: 0, fields: 0, words: 0 },
  );
  const number = new Intl.NumberFormat(locale);
  const collectionName = (slug: string) =>
    t.has(`collections.${slug}`) ? t(`collections.${slug}`) : slug;

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>{tCommon("overview")}</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{t("title")}</span>
        </div>
        <div className="mt-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold">{t("export.title")}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("export.description")}</p>
          </div>
          {totals.fields > 0 && (
            <a href={downloadHref("all")} className={buttonVariants()}>
              <Download className="size-4" aria-hidden="true" />
              {t("export.downloadAll")}
            </a>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{t("export.collection")}</TableHead>
                <TableHead className="text-right">{t("export.documents")}</TableHead>
                <TableHead className="text-right">{t("export.fields")}</TableHead>
                <TableHead className="text-right">{t("export.words")}</TableHead>
                <TableHead className="w-0 pr-4">
                  <span className="sr-only">{t("export.download")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.slug}>
                  <TableCell className="pl-4 font-medium">{collectionName(row.slug)}</TableCell>
                  <TableCell className="text-right tabular-nums">{number.format(row.docs)}</TableCell>
                  <TableCell className="text-right tabular-nums">{number.format(row.fields)}</TableCell>
                  <TableCell className="text-right tabular-nums">{number.format(row.words)}</TableCell>
                  <TableCell className="pr-4 text-right">
                    {row.fields > 0 ? (
                      <a
                        href={downloadHref(row.slug)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "whitespace-nowrap")}
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        {t("export.downloadJson")}
                      </a>
                    ) : (
                      <span className="text-sm whitespace-nowrap text-muted-foreground">
                        {t("export.done")}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell className="pl-4">{t("export.total")}</TableCell>
                <TableCell className="text-right tabular-nums">{number.format(totals.docs)}</TableCell>
                <TableCell className="text-right tabular-nums">{number.format(totals.fields)}</TableCell>
                <TableCell className="text-right tabular-nums">{number.format(totals.words)}</TableCell>
                <TableCell className="pr-4" />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <TranslationImport />
    </>
  );
}
