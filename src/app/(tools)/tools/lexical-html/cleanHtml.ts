/**
 * Strips presentational/internal attributes (style, id, class, dir,
 * spellcheck, data-*) from an HTML string, keeping semantic tags and
 * content-bearing attributes (href, src, alt, etc.) intact. Also unwraps
 * <span> tags entirely, since they carry no meaning once their attributes
 * are gone — replaced by their children in place. <strong>/<b> tags are
 * unwrapped too, but only inside headings (h1-h6) — a bold whole heading is
 * redundant since headings are already visually emphasized, but <strong>
 * elsewhere (body text) is meaningful and kept. Non-breaking spaces
 * (&nbsp; / U+00A0) in text content are replaced with regular spaces.
 *
 * Pure function — no pretty-printing, just attribute stripping, tag
 * unwrapping, and nbsp normalization. Meant to turn Lexical's exported HTML
 * (full of theme classes, data-lexical-* bookkeeping attributes, formatting
 * spans, and nbsp padding) into plain, portable HTML.
 */

const ATTRS_TO_STRIP = new Set(['style', 'id', 'class', 'dir', 'spellcheck'])

/** Replaces every `selector` match under `root` with its own children. */
function unwrap(root: ParentNode, selector: string): void {
  let matches = root.querySelectorAll(selector)
  while (matches.length > 0) {
    matches.forEach((el) => {
      const parent = el.parentNode
      if (!parent) return
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el)
      }
      parent.removeChild(el)
    })
    matches = root.querySelectorAll(selector)
  }
}

export function cleanHtml(html: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    throw new Error('cleanHtml() requires a browser DOMParser and can only run client-side')
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const elements = doc.body.querySelectorAll('*')
  elements.forEach((el) => {
    // Copy attribute names first — removeAttribute while iterating
    // el.attributes live would skip entries.
    const attrNames = Array.from(el.attributes).map((attr) => attr.name)

    for (const name of attrNames) {
      if (ATTRS_TO_STRIP.has(name) || name.startsWith('data-')) {
        el.removeAttribute(name)
      }
    }
  })

  // Unwrap every <span>, replacing it with its own children so the text
  // content survives but the wrapper tag doesn't.
  unwrap(doc.body, 'span')

  // Unwrap <strong>/<b> only inside headings — bolding an entire heading
  // is redundant, but <strong>/<b> elsewhere (body text) is meaningful.
  doc.body.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    unwrap(heading, 'strong, b')
  })

  // Replace non-breaking spaces (U+00A0, i.e. &nbsp;) with regular spaces
  // in all text content.
  const NBSP = '\u00A0'
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let textNode: Node | null
  while ((textNode = walker.nextNode())) {
    if (textNode.nodeValue?.includes(NBSP)) {
      textNode.nodeValue = textNode.nodeValue.split(NBSP).join(' ')
    }
  }

  return doc.body.innerHTML
}
