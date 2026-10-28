import NextLink from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "cn";

import { getPathname } from "@/i18n/navigation";
import { toLocale } from "@/lib/seo/site";

interface PaginationNavProps {
  /** Internal path of page 1, e.g. "/blog" or "/authors/jane". */
  basePath: string;
  page: number;
  totalPages: number;
  className?: string;
}

// 1 … 4 5 6 … 10 — first, last, and the current page's neighbours.
const pageItems = (page: number, totalPages: number) => {
  const items: (number | "gap")[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
      items.push(n);
    } else if (items.at(-1) !== "gap") {
      items.push("gap");
    }
  }
  return items;
};

export async function PaginationNav({
  basePath,
  page,
  totalPages,
  className,
}: PaginationNavProps) {
  if (totalPages <= 1) return null;

  const locale = toLocale(await getLocale());
  const t = await getTranslations("Pagination");
  // Localize the path first (e.g. /bg/sabitiya-i-media); the wrapper leaves
  // hrefs with a query string untranslated.
  const pathname = getPathname({ href: basePath, locale });
  const hrefFor = (n: number) => (n === 1 ? pathname : `${pathname}?page=${n}`);

  const linkClass =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted";

  return (
    <nav
      aria-label={t("label")}
      className={cn("mt-16 flex justify-center", className)}
    >
      <ul className="flex flex-wrap items-center justify-center gap-1">
        {page > 1 && (
          <li>
            <NextLink href={hrefFor(page - 1)} rel="prev" className={linkClass}>
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">{t("previous")}</span>
            </NextLink>
          </li>
        )}
        {pageItems(page, totalPages).map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className="px-2 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              <NextLink
                href={hrefFor(item)}
                aria-label={t("page", { page: item })}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  linkClass,
                  item === page && "border border-border bg-muted",
                )}
              >
                {item}
              </NextLink>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <NextLink href={hrefFor(page + 1)} rel="next" className={linkClass}>
              <span className="hidden sm:inline">{t("next")}</span>
              <ChevronRight className="size-4" />
            </NextLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
