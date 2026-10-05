import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

// Turns plain text (e.g. a form textarea) into a Lexical editor state for a
// Payload richText field — each non-empty line becomes its own paragraph.
export function plainTextToLexical(text: string): SerializedEditorState {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          textFormat: 0,
          children: [
            {
              type: "text",
              text: line,
              format: 0,
              style: "",
              mode: "normal",
              detail: 0,
              version: 1,
            },
          ],
        })),
    },
  } as unknown as SerializedEditorState;
}
