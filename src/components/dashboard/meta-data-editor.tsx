"use client";

import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  CalendarDays,
  Building2,
  ExternalLink,
  FileText,
  Lightbulb,
  Newspaper,
  Pencil,
  RotateCcw,
  Search,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  saveMeta,
  type MetaTarget,
} from "@/app/[locale]/(frontend)/dashboard/seo/meta-data/actions";
import { SerpPreview } from "@/components/dashboard/serp-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { META_DESCRIPTION_MAX, META_TITLE_MAX } from "@/lib/seo/collection-meta";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Meta data editor (Dashboard → SEO → Meta data)
// ---------------------------------------------------------------------------
//
// One tab per group (static pages first, then each collection), with a
// search, a status filter (custom / default / too long) and a preview
// language. Each row shows what search engines get for that page in the
// preview language: the saved value, else the fallback. "Edit" opens a sheet
// with both languages, live length counters and a search-result preview.
// Empty fields mean "use the default", shown as the placeholder.

type Locale = "en" | "bg";
type Pair = { title: string; description: string };
type Filter = "all" | "custom" | "default" | "issues";

export type MetaEntry = {
  id: string;
  target: MetaTarget;
  label: string;
  href: Record<Locale, string>;
  values: Record<Locale, Pair>;
  /** The fallback used when a field is empty; no description = generic hint. */
  placeholders: Record<Locale, { title: string; description?: string }>;
};

export type MetaGroup = {
  slug: string;
  label: string;
  entries: MetaEntry[];
};

const LOCALES: Locale[] = ["en", "bg"];

const GROUP_ICONS: Record<string, LucideIcon> = {
  pages: FileText,
  blog: Newspaper,
  "case-studies": Trophy,
  industries: Building2,
  events: CalendarDays,
  services: Briefcase,
  solutions: Lightbulb,
  docs: BookOpen,
};

const isCustom = (pair: Pair) => Boolean(pair.title || pair.description);

// What a page actually ends up with in a locale.
const effective = (entry: MetaEntry, values: Record<Locale, Pair>, locale: Locale) => ({
  title: values[locale].title || entry.placeholders[locale].title,
  description: values[locale].description || entry.placeholders[locale].description || "",
});

const hasIssue = (entry: MetaEntry, values: Record<Locale, Pair>) =>
  LOCALES.some((locale) => {
    const { title, description } = effective(entry, values, locale);
    return title.length > META_TITLE_MAX || description.length > META_DESCRIPTION_MAX;
  });

function Counter({ length, max }: { length: number; max: number }) {
  return (
    <InputGroupText
      className={cn(
        "text-xs tabular-nums",
        length > max ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
      )}
    >
      {length}/{max}
    </InputGroupText>
  );
}

// ---------------------------------------------------------------------------

function MetaEditSheet({
  entry,
  open,
  onOpenChange,
  saved,
  onSaved,
  initialLocale,
  siteUrl,
  siteName,
}: {
  entry: MetaEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saved: Record<Locale, Pair>;
  onSaved: (values: Record<Locale, Pair>) => void;
  initialLocale: Locale;
  siteUrl: string;
  siteName: string;
}) {
  const t = useTranslations("Seo.metaData");
  const router = useRouter();
  const fieldId = useId();
  const [values, setValues] = useState(saved);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = LOCALES.some(
    (locale) =>
      values[locale].title !== saved[locale].title ||
      values[locale].description !== saved[locale].description,
  );

  const change = (locale: Locale, field: keyof Pair, value: string) =>
    setValues((current) => ({ ...current, [locale]: { ...current[locale], [field]: value } }));

  const save = async (next: Record<Locale, Pair>) => {
    setError(null);
    setIsSaving(true);
    const result = await saveMeta(entry.target, next);
    setIsSaving(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onSaved(next);
    onOpenChange(false);
    toast.success(t("saved"), { description: entry.label });
    router.refresh();
  };

  const empty = { title: "", description: "" };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        // Reopening starts from what is saved, not an abandoned draft.
        if (!next) {
          setValues(saved);
          setError(null);
        }
      }}
    >
      <SheetContent showCloseButton={false} className="w-full gap-0 sm:max-w-xl!">
        <SheetHeader className="flex-row items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <SheetTitle className="text-lg">{t("editTitle")}</SheetTitle>
            <SheetDescription className="truncate">
              {entry.label} · <span className="font-mono text-xs">{entry.href.en}</span>
            </SheetDescription>
          </div>
          <SheetClose render={<Button size="icon" variant="secondary" />}>
            <X />
            <span className="sr-only">{t("cancel")}</span>
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto p-5">
          <Tabs defaultValue={initialLocale}>
            <TabsList className="w-full">
              {LOCALES.map((locale) => (
                <TabsTrigger key={locale} value={locale}>
                  {t(`locales.${locale}`)}
                  {isCustom(values[locale]) && (
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {LOCALES.map((locale) => {
              const placeholder = entry.placeholders[locale];
              const shown = effective(entry, values, locale);
              return (
                <TabsContent key={locale} value={locale} className="flex flex-col gap-6 pt-5">
                  <Field>
                    <FieldLabel htmlFor={`${fieldId}-${locale}-title`}>{t("metaTitle")}</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`${fieldId}-${locale}-title`}
                        value={values[locale].title}
                        placeholder={placeholder.title}
                        onChange={(event) => change(locale, "title", event.target.value)}
                      />
                      <InputGroupAddon align="inline-end">
                        <Counter length={shown.title.length} max={META_TITLE_MAX} />
                      </InputGroupAddon>
                    </InputGroup>
                    {shown.title.length > META_TITLE_MAX ? (
                      <FieldDescription className="text-amber-600 dark:text-amber-400">
                        {t("tooLong", { max: META_TITLE_MAX })}
                      </FieldDescription>
                    ) : (
                      !values[locale].title && <FieldDescription>{t("usingDefault")}</FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`${fieldId}-${locale}-description`}>
                      {t("metaDescription")}
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={`${fieldId}-${locale}-description`}
                        rows={4}
                        value={values[locale].description}
                        placeholder={placeholder.description ?? t("fallbackDescription")}
                        onChange={(event) => change(locale, "description", event.target.value)}
                      />
                      <InputGroupAddon align="block-end" className="justify-end">
                        <Counter length={shown.description.length} max={META_DESCRIPTION_MAX} />
                      </InputGroupAddon>
                    </InputGroup>
                    {shown.description.length > META_DESCRIPTION_MAX ? (
                      <FieldDescription className="text-amber-600 dark:text-amber-400">
                        {t("tooLong", { max: META_DESCRIPTION_MAX })}
                      </FieldDescription>
                    ) : (
                      !values[locale].description && (
                        <FieldDescription>{t("usingDefault")}</FieldDescription>
                      )
                    )}
                  </Field>

                  <section className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium">{t("preview")}</h3>
                      <a
                        href={entry.href[locale]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3" aria-hidden="true" />
                        {t("view")}
                      </a>
                    </div>
                    <SerpPreview
                      title={shown.title}
                      description={shown.description}
                      url={`${siteUrl}${entry.href[locale]}`}
                      siteName={siteName}
                    />
                    <p className="text-xs text-muted-foreground">{t("previewHint")}</p>
                  </section>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        <SheetFooter className="border-t p-5">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isSaving || LOCALES.every((locale) => !isCustom(saved[locale]))}
              onClick={() => save({ en: empty, bg: empty })}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              {t("reset")}
            </Button>
            <div className="ml-auto flex gap-2">
              <SheetClose render={<Button type="button" variant="outline" />}>{t("cancel")}</SheetClose>
              <Button
                type="button"
                disabled={!isDirty}
                loading={isSaving}
                loadingText={t("saving")}
                onClick={() => save(values)}
              >
                {t("save")}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

function MetaRow({
  entry,
  icon: Icon,
  saved,
  onSaved,
  locale,
  siteUrl,
  siteName,
}: {
  entry: MetaEntry;
  icon: LucideIcon;
  saved: Record<Locale, Pair>;
  onSaved: (values: Record<Locale, Pair>) => void;
  locale: Locale;
  siteUrl: string;
  siteName: string;
}) {
  const t = useTranslations("Seo.metaData");
  const [open, setOpen] = useState(false);
  const shown = effective(entry, saved, locale);
  const custom = isCustom(saved[locale]);
  const issue = hasIssue(entry, saved);

  return (
    <li>
      <Item className="rounded-none px-4 py-3.5 hover:bg-muted/40">
        <ItemMedia
          variant="icon"
          className="size-9 rounded-lg border bg-muted/50 text-muted-foreground"
        >
          <Icon />
        </ItemMedia>
        <ItemContent className="min-w-0 gap-1">
          <ItemTitle className="flex flex-wrap items-center gap-2">
            <span className="truncate">{entry.label}</span>
            <Badge variant={custom ? "default" : "outline"} className="font-normal">
              {custom ? t("custom") : t("default")}
            </Badge>
            {issue && (
              <Badge
                variant="outline"
                className="border-amber-300 font-normal text-amber-700 dark:border-amber-500/40 dark:text-amber-400"
              >
                <AlertTriangle aria-hidden="true" />
                {t("tooLongShort")}
              </Badge>
            )}
          </ItemTitle>
          <p className="truncate text-sm text-[#1a0dab] dark:text-[#8ab4f8]">{shown.title}</p>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {shown.description || <span className="italic">{t("fallbackDescription")}</span>}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground/80">{entry.href[locale]}</p>
        </ItemContent>
        <ItemActions>
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Pencil aria-hidden="true" />
            {t("edit")}
          </Button>
        </ItemActions>
      </Item>
      <MetaEditSheet
        entry={entry}
        open={open}
        onOpenChange={setOpen}
        saved={saved}
        onSaved={onSaved}
        initialLocale={locale}
        siteUrl={siteUrl}
        siteName={siteName}
      />
    </li>
  );
}

// ---------------------------------------------------------------------------

export function MetaDataEditor({
  groups,
  siteUrl,
  siteName,
}: {
  groups: MetaGroup[];
  siteUrl: string;
  siteName: string;
}) {
  const t = useTranslations("Seo.metaData");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [locale, setLocale] = useState<Locale>("en");
  // Saved values per entry, updated after each save so rows and filters
  // reflect it right away (the server refresh follows).
  const [saved, setSaved] = useState<Record<string, Record<Locale, Pair>>>(() =>
    Object.fromEntries(groups.flatMap((group) => group.entries.map((entry) => [entry.id, entry.values]))),
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return groups.map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => {
        const values = saved[entry.id] ?? entry.values;
        if (filter === "custom" && !isCustom(values[locale])) return false;
        if (filter === "default" && isCustom(values[locale])) return false;
        if (filter === "issues" && !hasIssue(entry, values)) return false;
        if (!needle) return true;
        const shown = effective(entry, values, locale);
        return [entry.label, entry.href.en, entry.href.bg, shown.title, shown.description].some(
          (text) => text.toLowerCase().includes(needle),
        );
      }),
    }));
  }, [groups, saved, query, filter, locale]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-xs sm:flex-row sm:items-center dark:bg-gray-800">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
          />
        </InputGroup>
        <ToggleGroup
          aria-label={t("filters.label")}
          variant="outline"
          size="sm"
          spacing={0}
          value={[filter]}
          onValueChange={(value) => value[0] && setFilter(value[0] as Filter)}
          className="flex-wrap"
        >
          {(["all", "custom", "default", "issues"] as const).map((value) => (
            <ToggleGroupItem key={value} value={value} className="px-3">
              {t(`filters.${value}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-xs text-muted-foreground">{t("previewLanguage")}</span>
          <ToggleGroup
            aria-label={t("previewLanguage")}
            variant="outline"
            size="sm"
            spacing={0}
            value={[locale]}
            onValueChange={(value) => value[0] && setLocale(value[0] as Locale)}
          >
            {LOCALES.map((value) => (
              <ToggleGroupItem key={value} value={value} className="px-3 uppercase">
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <Tabs defaultValue={groups[0]?.slug}>
        <TabsList variant="line" className="h-auto! w-full justify-start gap-1 overflow-x-auto border-b pb-1">
          {filtered.map((group) => {
            const Icon = GROUP_ICONS[group.slug] ?? FileText;
            return (
              <TabsTrigger key={group.slug} value={group.slug} className="flex-none px-2.5 py-1.5">
                <Icon aria-hidden="true" />
                {group.label}
                <span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
                  {group.entries.length}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {filtered.map((group) => (
          <TabsContent key={group.slug} value={group.slug} className="pt-3">
            {group.entries.length === 0 ? (
              <Empty className="border bg-white dark:bg-gray-800">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>{t("noResults")}</EmptyTitle>
                  <EmptyDescription>{t("noResultsHint")}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="divide-y overflow-hidden rounded-xl border bg-white shadow-xs dark:bg-gray-800">
                {group.entries.map((entry) => (
                  <MetaRow
                    key={entry.id}
                    entry={entry}
                    icon={GROUP_ICONS[group.slug] ?? FileText}
                    saved={saved[entry.id] ?? entry.values}
                    onSaved={(values) => setSaved((current) => ({ ...current, [entry.id]: values }))}
                    locale={locale}
                    siteUrl={siteUrl}
                    siteName={siteName}
                  />
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
