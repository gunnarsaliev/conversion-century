import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

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
 * Flattens a Lexical editor state (Payload richText field value) into plain
 * text, joining block-level nodes (paragraphs, headings, …) with a single
 * space. Used where only the quote/copy is needed, not formatting — e.g.
 * pulling a client's `testimonial` richText into a plain-text carousel card.
 */
export const richTextToPlainText = (
  data: SerializedEditorState | null | undefined,
): string => {
  if (!data?.root?.children) return "";

  return (data.root.children as SerializedLexicalNode[])
    .map(textFromNode)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};
