/**
 * Some pasted plain text (e.g. copied from a content brief or doc export
 * with no real formatting) marks headings by convention with a literal
 * "H1:"/"H2:"/etc. prefix rather than any actual styling — for example:
 *   H2: Как да комбинираме бондинг с други естетични процедури?
 *
 * This converts such plain text into an HTML string with real <h1>-<h6>
 * tags for marked lines and <p> tags for everything else, so it can be
 * run through the normal $generateNodesFromDOM pipeline. Blank lines are
 * treated as paragraph separators and produce no empty paragraph.
 */

const HEADING_MARKER = /^\s*h([1-6])\s*:\s*(.*)$/i

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function plainTextToHtmlWithHeadings(text: string): string {
  const lines = text.split(/\r\n|\r|\n/)

  const htmlLines: string[] = []
  for (const line of lines) {
    if (line.trim() === '') continue

    const match = line.match(HEADING_MARKER)
    if (match) {
      const level = match[1]
      const content = match[2].trim()
      htmlLines.push(`<h${level}>${escapeHtml(content)}</h${level}>`)
    } else {
      htmlLines.push(`<p>${escapeHtml(line.trim())}</p>`)
    }
  }

  return htmlLines.join('')
}
