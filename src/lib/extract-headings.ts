import slugify from "slugify";
import type { SerializedEditorState, SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";

export interface RichTextHeading {
  id: string;
  text: string;
  level: number;
}

interface HeadingLikeNode extends SerializedLexicalNode {
  tag?: string;
  children?: SerializedLexicalNode[];
}

const isHeadingNode = (
  node: SerializedLexicalNode,
): node is HeadingLikeNode & { tag: string; children: SerializedLexicalNode[] } =>
  node.type === "heading" &&
  typeof (node as HeadingLikeNode).tag === "string" &&
  Array.isArray((node as HeadingLikeNode).children);

const textFromNode = (node: SerializedLexicalNode): string => {
  if ("text" in node && typeof (node as { text?: unknown }).text === "string") {
    return (node as { text: string }).text;
  }
  const children = (node as { children?: SerializedLexicalNode[] }).children;
  if (Array.isArray(children)) {
    return children.map(textFromNode).join("");
  }
  return "";
};

/**
 * Walks a Lexical editor state and pulls out every heading node, deriving a
 * stable, URL-safe `id` for each one via `slugify` — the same package (and
 * Cyrillic-aware locale option) used to generate document slugs elsewhere
 * in this app, so Bulgarian headings still get readable anchors.
 *
 * IDs are de-duplicated by suffixing repeats ("overview", "overview-2", …)
 * since two headings can share the same text.
 */
export const extractHeadings = (
  data: SerializedEditorState | null | undefined,
  locale: "en" | "bg" = "en",
): RichTextHeading[] => {
  if (!data?.root?.children) return [];

  const headings: RichTextHeading[] = [];
  const seen = new Map<string, number>();

  const walk = (nodes: SerializedLexicalNode[]) => {
    for (const node of nodes) {
      if (isHeadingNode(node)) {
        const text = textFromNode(node).trim();
        const level = Number(node.tag.replace(/[^0-9]/g, "")) || 2;

        if (text) {
          const baseId = slugify(text, { lower: true, strict: true, locale });
          const count = seen.get(baseId) ?? 0;
          seen.set(baseId, count + 1);
          const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

          headings.push({ id, text, level });
        }
      }

      const children = (node as { children?: SerializedLexicalNode[] }).children;
      if (Array.isArray(children)) {
        walk(children);
      }
    }
  };

  walk(data.root.children as SerializedLexicalNode[]);

  return headings;
};
