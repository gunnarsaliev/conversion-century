/**
 * Microsoft Word's clipboard HTML represents headings as plain paragraphs
 * styled to look like a heading — e.g.
 *   <p class="MsoHeading1" style="mso-style-name:&quot;Heading 1&quot;">...</p>
 * — rather than semantic <h1>-<h6> tags. Lexical's HeadingNode.importDOM()
 * only recognizes literal heading tag names, so pasting from Word silently
 * turns headings into plain paragraphs.
 *
 * This rewrites any such Word "fake heading" paragraph into a real <hN>
 * element (in place, on a parsed DOM) before Lexical's own DOM-to-node
 * conversion runs, so headings survive the paste.
 */

const MSO_CLASS_HEADING = /^MsoHeading([1-6])$/i
const MSO_STYLE_NAME_HEADING = /mso-style-name\s*:\s*["']?heading\s*([1-6])["']?/i

function detectWordHeadingLevel(el: Element): number | null {
  const className = el.getAttribute('class')
  if (className) {
    for (const cls of className.split(/\s+/)) {
      const match = cls.match(MSO_CLASS_HEADING)
      if (match) return Number(match[1])
    }
  }

  const style = el.getAttribute('style')
  if (style) {
    const match = style.match(MSO_STYLE_NAME_HEADING)
    if (match) return Number(match[1])
  }

  return null
}

/**
 * Mutates `doc` in place, replacing Word "fake heading" paragraphs with
 * real <hN> elements carrying the same children/attributes (minus the
 * Word-specific class, which callers strip later anyway).
 */
export function fixWordHeadings(doc: Document): void {
  const paragraphs = doc.body.querySelectorAll('p')
  paragraphs.forEach((p) => {
    const level = detectWordHeadingLevel(p)
    if (level === null) return

    const heading = doc.createElement(`h${level}`)
    while (p.firstChild) {
      heading.appendChild(p.firstChild)
    }
    p.replaceWith(heading)
  })
}
