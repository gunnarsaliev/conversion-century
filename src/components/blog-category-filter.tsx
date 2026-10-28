import NextLink from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "cn";

import { getPathname } from "@/i18n/navigation";
import { blogCategoryPath, type BlogCategory } from "@/lib/blog-categories";
import { toLocale } from "@/lib/seo/site";

interface BlogCategoryFilterProps {
  /** Categories that have posts, in display order. */
  categories: BlogCategory[];
  active?: BlogCategory;
  className?: string;
}

// "All" + one pill per category. Switching category goes back to page 1.
export async function BlogCategoryFilter({
  categories,
  active,
  className,
}: BlogCategoryFilterProps) {
  if (categories.length === 0) return null;

  const locale = toLocale(await getLocale());
  const t = await getTranslations("BlogCategories");
  const hrefFor = (path: string) => getPathname({ href: path, locale });

  const items: { key: string; label: string; href: string; current: boolean }[] = [
    { key: "all", label: t("all"), href: hrefFor("/blog"), current: !active },
    ...categories.map((category) => ({
      key: category,
      label: t(category),
      href: hrefFor(blogCategoryPath(category)),
      current: category === active,
    })),
  ];

  return (
    <nav aria-label={t("filterLabel")} className={cn("flex justify-center", className)}>
      <ul className="flex flex-wrap justify-center gap-2">
        {items.map((item) => (
          <li key={item.key}>
            <NextLink
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                item.current
                  ? "border-primary bg-primary text-white"
                  : "border-border hover:bg-muted",
              )}
            >
              {item.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
