// mammoth ships no TypeScript declarations. This covers only the small
// subset of its browser API (`convertToHtml` with an ArrayBuffer input)
// used by src/app/(tools)/tools/docx-html.
declare module 'mammoth' {
  export interface MammothMessage {
    type: 'warning' | 'error'
    message: string
  }

  export interface MammothResult {
    value: string
    messages: MammothMessage[]
  }

  export interface MammothOptions {
    styleMap?: string | string[]
    includeEmbeddedStyleMap?: boolean
    includeDefaultStyleMap?: boolean
    ignoreEmptyParagraphs?: boolean
    idPrefix?: string
  }

  export function convertToHtml(
    input: { arrayBuffer: ArrayBuffer },
    options?: MammothOptions,
  ): Promise<MammothResult>
}
