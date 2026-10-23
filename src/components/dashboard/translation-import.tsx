"use client";

import { AlertTriangle, CheckCircle2, Download, FileJson, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  runTranslationImport,
  type ImportResult,
} from "@/app/[locale]/(frontend)/dashboard/translations/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ImportLogKind, ImportReport } from "@/lib/translations/import";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Translation import (Dashboard → Translations)
// ---------------------------------------------------------------------------
//
// Pick the translator's files (`<slug>.json` or a ZIP of them), preview what
// would be filled, then apply. The preview and the apply both go through
// runTranslationImport with the same files, so what's saved is exactly what
// was previewed (unless someone edited the content in between, in which case
// those fields are skipped). After applying, the previous Bulgarian values of
// every changed document can be downloaded as a backup.

type Stage = "idle" | "previewed" | "applied";

const kindClassName: Record<ImportLogKind, string> = {
  fill: "bg-emerald-100 text-emerald-800",
  stale: "bg-amber-100 text-amber-800",
  missing: "bg-muted text-muted-foreground",
  partial: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
};

const downloadJson = (name: string, data: unknown) => {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const ReportTable = ({ reports }: { reports: ImportReport[] }) => {
  const t = useTranslations("Translations");
  const collectionName = (slug: string) =>
    t.has(`collections.${slug}`) ? t(`collections.${slug}`) : slug;

  return (
    <div className="flex flex-col gap-3">
      {reports.map((report) => (
        <details
          key={report.collection}
          className="group rounded-lg border bg-white dark:bg-gray-800"
          open={reports.length === 1}
        >
          <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 marker:content-none">
            <span className="font-medium">{collectionName(report.collection)}</span>
            <span className="flex flex-wrap gap-1.5 text-xs">
              <Badge className={kindClassName.fill}>
                {t("report.filled", { count: report.counts.filled })}
              </Badge>
              {report.counts.existing > 0 && (
                <Badge variant="secondary">{t("report.existing", { count: report.counts.existing })}</Badge>
              )}
              {report.counts.stale > 0 && (
                <Badge className={kindClassName.stale}>{t("report.stale", { count: report.counts.stale })}</Badge>
              )}
              {report.counts.incomplete > 0 && (
                <Badge className={kindClassName.partial}>
                  {t("report.incomplete", { count: report.counts.incomplete })}
                </Badge>
              )}
              {report.counts.missing > 0 && (
                <Badge className={kindClassName.missing}>
                  {t("report.missing", { count: report.counts.missing })}
                </Badge>
              )}
              {report.counts.failedDocs > 0 && (
                <Badge className={kindClassName.error}>
                  {t("report.failed", { count: report.counts.failedDocs })}
                </Badge>
              )}
            </span>
            <span className="ml-auto text-xs text-muted-foreground group-open:hidden">
              {t("report.showDetails")}
            </span>
          </summary>

          {report.docs.length === 0 ? (
            <p className="border-t px-4 py-3 text-sm text-muted-foreground">{t("report.nothing")}</p>
          ) : (
            <ul className="max-h-96 divide-y overflow-y-auto border-t text-sm">
              {report.docs.map((doc) => (
                <li key={doc.id} className="px-4 py-2.5">
                  <p className="font-medium">{doc.label}</p>
                  <ul className="mt-1 flex flex-col gap-1">
                    {doc.log.map((line, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge className={cn("shrink-0", kindClassName[line.kind])}>
                          {t(`kinds.${line.kind}`)}
                        </Badge>
                        <span className="min-w-0 font-mono text-xs break-all text-muted-foreground">
                          {line.path}
                          {line.detail && <span className="font-sans"> · {line.detail}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </details>
      ))}
    </div>
  );
};

const TranslationImport = () => {
  const t = useTranslations("Translations");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [stage, setStage] = React.useState<Stage>("idle");
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const reports = result?.success ? result.reports : [];
  const toFill = reports.reduce((sum, report) => sum + report.counts.filled, 0);
  const backup = Object.fromEntries(
    reports
      .filter((report) => Object.keys(report.backup).length > 0)
      .map((report) => [report.collection, report.backup]),
  );

  const run = (apply: boolean) => {
    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    formData.set("apply", String(apply));

    startTransition(async () => {
      const next = await runTranslationImport(formData);
      setResult(next);
      if (!next.success) return;
      setStage(apply ? "applied" : "previewed");
      if (apply) router.refresh();
    });
  };

  const choose = (list: FileList | null) => {
    setFiles(list ? [...list] : []);
    setStage("idle");
    setResult(null);
  };

  return (
    <section className="mt-8 flex flex-col gap-3">
      <div>
        <h2 className="font-semibold">{t("import.title")}</h2>
        <p className="mt-0.5 max-w-3xl text-sm text-muted-foreground">{t("import.description")}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".json,.zip,application/json,application/zip"
            multiple
            className="hidden"
            onChange={(event) => choose(event.target.files)}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isPending}>
            <Upload className="size-4" aria-hidden="true" />
            {t("import.choose")}
          </Button>
          {files.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5 text-sm">
              {files.map((file) => (
                <li key={file.name} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                  <FileJson className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  {file.name}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm text-muted-foreground">{t("import.noFiles")}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={stage === "previewed" ? "outline" : "default"}
            disabled={files.length === 0 || isPending}
            loading={isPending && stage === "idle"}
            loadingText={t("import.checking")}
            onClick={() => run(false)}
          >
            {t("import.preview")}
          </Button>
          {stage === "previewed" && (
            <Button
              type="button"
              disabled={toFill === 0 || isPending}
              loading={isPending}
              loadingText={t("import.applying")}
              onClick={() => {
                if (window.confirm(t("import.confirm", { count: toFill }))) run(true);
              }}
            >
              {t("import.apply", { count: toFill })}
            </Button>
          )}
          {stage === "applied" && Object.keys(backup).length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                downloadJson(`translations-backup-${new Date().toISOString().slice(0, 10)}.json`, backup)
              }
            >
              <Download className="size-4" aria-hidden="true" />
              {t("import.downloadBackup")}
            </Button>
          )}
        </div>

        {result && !result.success && (
          <p className="flex items-center gap-2 text-sm text-destructive" role="alert">
            <AlertTriangle className="size-4" aria-hidden="true" />
            {result.error}
          </p>
        )}
        {stage === "previewed" && (
          <p className="text-sm text-muted-foreground" role="status">
            {toFill > 0 ? t("import.previewed", { count: toFill }) : t("import.nothingToApply")}
          </p>
        )}
        {stage === "applied" && (
          <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400" role="status">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {t("import.applied", { count: toFill })}
          </p>
        )}
      </div>

      {reports.length > 0 && <ReportTable reports={reports} />}
    </section>
  );
};

export { TranslationImport };
