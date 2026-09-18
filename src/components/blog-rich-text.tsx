"use client";

import { createElement } from "react";
import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type {
  SerializedEditorState,
} from "@payloadcms/richtext-lexical/lexical";
import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";

import { extractHeadings } from "@/lib/extract-headings";

interface PostRichTextProps {
  data: SerializedEditorState;
  locale?: "en" | "bg";
}

/**
 * Renders post `content` with one addition over the default RichText
 * output: every heading gets an `id` matching what `extractHeadings`
 * derives from the same data, so TableOfContents links (`#some-heading`)
 * actually land on the right element.
 */
const PostRichText = ({ data, locale = "en" }: PostRichTextProps) => {
  const headings = extractHeadings(data, locale);
  let headingIndex = 0;

  const converters: JSXConvertersFunction<DefaultNodeTypes> = ({
    defaultConverters,
  }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const heading = headings[headingIndex];
      headingIndex += 1;

      const children = nodesToJSX({ nodes: node.children });

      return createElement(node.tag, { id: heading?.id }, children);
    },
  });

  return <RichText converters={converters} data={data} />;
};

export { PostRichText };
