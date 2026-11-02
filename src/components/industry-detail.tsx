import type { ReactNode } from "react";
import { RichText } from "@/components/rich-text";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { RelatedLinks } from "@/components/related-links";
import type { RelatedItem } from "@/lib/cms/related";

interface IndustryDetailProps {
  /** Body rich text, shown below the hero. */
  description?: SerializedEditorState;
  /** Rendered after the description, before "Check other industries". */
  afterDescription?: ReactNode;
  /** Shown at the end as "Check other industries". */
  otherIndustries?: RelatedItem[];
  className?: string;
}

// Splits rich text into everything up to and including the first paragraph,
// and whatever follows it. Either half is undefined when empty.
export function splitAfterFirstParagraph(
  data: SerializedEditorState | undefined,
): [SerializedEditorState | undefined, SerializedEditorState | undefined] {
  if (!data) return [undefined, undefined];
  const children = data.root.children;
  const index = children.findIndex((node) => node.type === "paragraph");
  if (index === -1) return [data, undefined];
  const part = (nodes: typeof children) =>
    nodes.length > 0 ? { ...data, root: { ...data.root, children: nodes } } : undefined;
  return [part(children.slice(0, index + 1)), part(children.slice(index + 1))];
}

// Body of the industry detail page; the header is rendered by Hero118.
const IndustryDetail = ({
  description,
  afterDescription,
  otherIndustries = [],
  className,
}: IndustryDetailProps) => {
  const t = useTranslations("IndustryDetail");

  return (
    <section className={cn("pb-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {description && (
            <div className="prose mt-10 max-w-none dark:prose-invert">
              <RichText data={description} />
            </div>
          )}

          {afterDescription}

          <RelatedLinks
            heading={t("otherIndustries")}
            items={otherIndustries}
            className="mt-20"
          />
        </div>
      </div>
    </section>
  );
};

export { IndustryDetail };
