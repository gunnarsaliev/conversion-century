"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { extractHeadings } from "@/lib/extract-headings";

interface TableOfContentsProps {
  content: SerializedEditorState;
  locale?: "en" | "bg";
  className?: string;
}

const TableOfContents = ({
  content,
  locale = "en",
  className,
}: TableOfContentsProps) => {
  const headings = extractHeadings(content, locale);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 1 },
    );

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // Only re-run if the set of heading ids actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings.map((h) => h.id).join("|")]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className={cn("mt-2 lg:mt-4", className)}>
      <span className="text-xs font-medium">ON THIS PAGE</span>
      <ul className="mt-2 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              style={{
                paddingLeft: `${(heading.level - minLevel) * 0.75}rem`,
              }}
              className={cn(
                "line-clamp-2 py-1 transition-colors duration-200",
                activeId === heading.id
                  ? "text-muted-foreground lg:text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { TableOfContents };
