"use client";

import { Check, ChevronDown, Download, ImageOff, Link2, Search } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { MediaFile, MediaHubItem } from "@/lib/media-files";

// ---------------------------------------------------------------------------
// Media hub (searchable image grid with per-size downloads)
// ---------------------------------------------------------------------------
//
// Downloads go through /dashboard/media/download so cross-origin R2 files
// are saved as attachments rather than opened in a new tab.

const sizeLabel: Record<MediaFile["size"], string> = {
  original: "Original",
  card: "Card",
  thumbnail: "Thumbnail",
};

const formatBytes = (bytes: number | null) => {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDimensions = (file: MediaFile) =>
  file.width && file.height ? `${file.width} × ${file.height}` : null;

const downloadHref = (item: MediaHubItem, file: MediaFile) =>
  `/dashboard/media/download?id=${item.id}&size=${file.size}`;

type SortKey = "newest" | "oldest" | "name";

const MediaCard = ({ item }: { item: MediaHubItem }) => {
  const [copied, setCopied] = React.useState(false);
  const original = item.files.find((file) => file.size === "original");
  const meta = original
    ? [formatDimensions(original), formatBytes(original.filesize)]
        .filter(Boolean)
        .join(" · ")
    : null;

  const copyLink = async () => {
    if (!original) return;
    await navigator.clipboard.writeText(original.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md dark:bg-gray-800">
      <div className="relative aspect-4/3 bg-muted/40">
        {item.previewUrl ? (
          <Image
            src={item.previewUrl}
            alt={item.alt ?? item.title}
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-3"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={item.title}>
            {item.title}
          </p>
          {meta && (
            <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1.5">
          {original ? (
            <div className="flex flex-1">
              <a
                href={downloadHref(item, original)}
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-l-lg bg-primary px-3 text-xs font-medium text-primary-foreground outline-none transition-all hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Download
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center justify-center rounded-r-lg border-l border-primary-foreground/20 bg-primary px-2 text-primary-foreground outline-none transition-all hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label={`More download sizes for ${item.title}`}
                >
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Download size</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {item.files.map((file) => (
                    <DropdownMenuItem
                      key={file.size}
                      render={<a href={downloadHref(item, file)} />}
                    >
                      <span className="flex-1">{sizeLabel[file.size]}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDimensions(file)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <span className="flex-1 text-xs text-muted-foreground">
              File unavailable
            </span>
          )}
          <button
            type="button"
            onClick={copyLink}
            disabled={!original}
            className="inline-flex size-8 items-center justify-center rounded-lg border outline-none transition-all hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            aria-label={copied ? "Link copied" : `Copy link to ${item.title}`}
          >
            {copied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Link2 className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

type MediaHubProps = {
  items: MediaHubItem[];
  emptyMessage?: string;
};

const MediaHub = ({ items, emptyMessage = "No images yet." }: MediaHubProps) => {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("newest");

  const visibleItems = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? items.filter((item) =>
          [item.title, item.alt, ...item.files.map((file) => file.filename)]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(needle)),
        )
      : items;

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [items, query, sort]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or filename…"
            aria-label="Search media"
            className="pl-8"
          />
        </div>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label="Sort media"
          className="h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
        <span className="ml-auto text-xs text-muted-foreground">
          {visibleItems.length} of {items.length}
        </span>
      </div>

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {visibleItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          {items.length === 0 ? emptyMessage : "No images match your search."}
        </div>
      )}
    </div>
  );
};

export { MediaHub };
