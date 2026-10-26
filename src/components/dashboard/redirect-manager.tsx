"use client";

import {
  ArrowRight,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Signpost,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createRedirect,
  deleteRedirect,
  updateRedirect,
  type RedirectInput,
} from "@/app/[locale]/(frontend)/dashboard/seo/redirects/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
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
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { isAbsoluteUrl, type RedirectStatusCode } from "@/lib/seo/redirects";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Redirect manager (Dashboard → SEO → Redirects)
// ---------------------------------------------------------------------------
//
// Toolbar (search, active/paused filter, "Add redirect"), then the rules as
// a table: source → destination, type, an on/off switch that applies right
// away, and a row menu (edit, test, delete). Adding and editing share one
// dialog; deleting asks in a second dialog. Every change goes through the
// redirects server actions, then refreshes the server-rendered list.

export type RedirectRow = RedirectInput & { id: number };

type Filter = "all" | "active" | "paused";

const emptyRule: RedirectInput = { from: "", to: "", statusCode: "301", enabled: true };

// ---------------------------------------------------------------------------

function RedirectDialog({
  open,
  onOpenChange,
  rule,
  siteHost,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The rule being edited; omitted when adding. */
  rule?: RedirectRow;
  siteHost: string;
}) {
  const t = useTranslations("Seo.redirects");
  const router = useRouter();
  const id = useId();
  const [draft, setDraft] = useState<RedirectInput>(rule ?? emptyRule);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = rule ? await updateRedirect(rule.id, draft) : await createRedirect(draft);
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    toast.success(rule ? t("updated") : t("created"), { description: `${draft.from} → ${draft.to}` });
    router.refresh();
  };

  const types: { value: RedirectStatusCode; label: string; hint: string }[] = [
    { value: "301", label: t("permanent"), hint: t("permanentHint") },
    { value: "302", label: t("temporary"), hint: t("temporaryHint") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-lg">{rule ? t("editTitle") : t("newTitle")}</DialogTitle>
            <DialogDescription>{t("dialogDescription")}</DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor={`${id}-from`}>{t("from")}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText className="font-mono text-xs">{siteHost}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={`${id}-from`}
                autoFocus
                className="font-mono"
                placeholder={t("fromPlaceholder")}
                value={draft.from}
                onChange={(event) => setDraft({ ...draft, from: event.target.value })}
              />
            </InputGroup>
            <FieldDescription>{t("fromHelp")}</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${id}-to`}>{t("to")}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <ArrowRight aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id={`${id}-to`}
                className="font-mono"
                placeholder={t("toPlaceholder")}
                value={draft.to}
                onChange={(event) => setDraft({ ...draft, to: event.target.value })}
              />
            </InputGroup>
            <FieldDescription>{t("toHelp")}</FieldDescription>
          </Field>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">{t("type")}</legend>
            <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
              {types.map((type) => {
                const selected = draft.statusCode === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDraft({ ...draft, statusCode: type.value })}
                    className={cn(
                      "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <span className="text-sm font-medium">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="flex items-start justify-between gap-4 rounded-lg border p-3">
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{t("enabled")}</span>
              <span className="text-xs text-muted-foreground">{t("activeHint")}</span>
            </span>
            <Switch
              checked={draft.enabled}
              onCheckedChange={(enabled) => setDraft({ ...draft, enabled })}
            />
          </label>

          {(draft.from || draft.to) && (
            <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-3">
              <span className="text-xs font-medium text-muted-foreground">{t("preview")}</span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="break-all">
                  {siteHost}
                  {draft.from.startsWith("/") ? draft.from : `/${draft.from}`}
                </span>
                <Badge variant="secondary" className="font-mono">
                  {draft.statusCode}
                </Badge>
                <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="break-all">{draft.to || "…"}</span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>{t("cancel")}</DialogClose>
            <Button type="submit" loading={busy} loadingText={rule ? t("save") : t("adding")}>
              {rule ? t("save") : t("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------

function DeleteDialog({
  rule,
  onOpenChange,
}: {
  rule: RedirectRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Seo.redirects");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    if (!rule) return;
    setBusy(true);
    setError(null);
    const result = await deleteRedirect(rule.id);
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    toast.success(t("deleted"), { description: rule.from });
    router.refresh();
  };

  return (
    <Dialog open={rule !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("deleteDescription", { from: rule?.from ?? "" })}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>{t("cancel")}</DialogClose>
          <Button
            type="button"
            variant="destructive"
            loading={busy}
            loadingText={t("deleting")}
            onClick={confirm}
          >
            <Trash2 aria-hidden="true" />
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------

function RedirectTableRow({
  rule,
  onEdit,
  onDelete,
}: {
  rule: RedirectRow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("Seo.redirects");
  const router = useRouter();
  const [enabled, setEnabled] = useState(rule.enabled);
  const [busy, setBusy] = useState(false);
  const external = isAbsoluteUrl(rule.to);

  const toggle = async (next: boolean) => {
    setEnabled(next);
    setBusy(true);
    const result = await updateRedirect(rule.id, { ...rule, enabled: next });
    setBusy(false);
    if (!result.success) {
      setEnabled(!next);
      toast.error(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <TableRow className={cn(!enabled && "text-muted-foreground")}>
      <TableCell className="pl-4">
        <code className="font-mono text-sm break-all whitespace-normal">{rule.from}</code>
      </TableCell>
      <TableCell className="w-0 px-0 text-muted-foreground">
        <ArrowRight className="size-4" aria-hidden="true" />
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          <code className="font-mono text-sm break-all whitespace-normal">{rule.to}</code>
          {external && (
            <Badge variant="outline" className="font-normal">
              <ExternalLink aria-hidden="true" />
              {t("external")}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "font-mono",
            rule.statusCode === "301"
              ? "border-emerald-300 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400"
              : "border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-400",
          )}
        >
          {rule.statusCode}
        </Badge>
      </TableCell>
      <TableCell>
        <label className="inline-flex items-center gap-2">
          <Switch checked={enabled} disabled={busy} onCheckedChange={toggle} />
          <span className="text-xs">{enabled ? t("active") : t("paused")}</span>
        </label>
      </TableCell>
      <TableCell className="pr-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label={t("openMenu")} />}
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil aria-hidden="true" />
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(rule.from, "_blank", "noopener")}>
              <ExternalLink aria-hidden="true" />
              {t("testOld")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 aria-hidden="true" />
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// ---------------------------------------------------------------------------

export function RedirectManager({
  redirects,
  siteHost,
}: {
  redirects: RedirectRow[];
  siteHost: string;
}) {
  const t = useTranslations("Seo.redirects");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  // `null` = closed; `{}` = adding; `{ rule }` = editing. Re-keyed per open
  // so the form starts from the rule each time.
  const [dialog, setDialog] = useState<{ rule?: RedirectRow; key: number } | null>(null);
  const [deleting, setDeleting] = useState<RedirectRow | null>(null);

  const openDialog = (rule?: RedirectRow) => setDialog({ rule, key: Date.now() });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return redirects.filter((rule) => {
      if (filter === "active" && !rule.enabled) return false;
      if (filter === "paused" && rule.enabled) return false;
      return !needle || rule.from.includes(needle) || rule.to.toLowerCase().includes(needle);
    });
  }, [redirects, query, filter]);

  const addButton = (
    <Button type="button" onClick={() => openDialog()}>
      <Plus aria-hidden="true" />
      {t("add")}
    </Button>
  );

  return (
    <section className="flex flex-col gap-4">
      {redirects.length === 0 ? (
        <Empty className="border bg-white shadow-xs dark:bg-gray-800">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Signpost />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{addButton}</EmptyContent>
        </Empty>
      ) : (
        <>
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
            >
              {(["all", "active", "paused"] as const).map((value) => (
                <ToggleGroupItem key={value} value={value} className="px-3">
                  {t(`filters.${value}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="text-xs text-muted-foreground tabular-nums">
                {t("count", { count: filtered.length })}
              </span>
              {addButton}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-white shadow-xs dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4">{t("from")}</TableHead>
                  <TableHead className="w-0 px-0">
                    <span className="sr-only">→</span>
                  </TableHead>
                  <TableHead>{t("to")}</TableHead>
                  <TableHead className="w-0">{t("type")}</TableHead>
                  <TableHead className="w-0">{t("status")}</TableHead>
                  <TableHead className="w-0 pr-4">
                    <span className="sr-only">{t("actions")}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      {t("noResults")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rule) => (
                    <RedirectTableRow
                      // Re-key on saved values so a refresh resets the switch.
                      key={`${rule.id}-${rule.enabled}-${rule.from}-${rule.to}-${rule.statusCode}`}
                      rule={rule}
                      onEdit={() => openDialog(rule)}
                      onDelete={() => setDeleting(rule)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {dialog && (
        <RedirectDialog
          key={dialog.key}
          open
          onOpenChange={(open) => !open && setDialog(null)}
          rule={dialog.rule}
          siteHost={siteHost}
        />
      )}
      <DeleteDialog rule={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </section>
  );
}
