// Converts a rendered docs article's DOM into Markdown or plain text for
// export. Walks the actual rendered HTML rather than the Markdoc source so
// it always matches what the reader sees on the page.

function collapseSpaces(text: string): string {
  return text.replace(/[ \t]+/g, ' ')
}

function inlineMarkdown(node: ChildNode): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return collapseSpaces(node.textContent ?? '')
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const el = node as HTMLElement
  const inner = Array.from(el.childNodes).map(inlineMarkdown).join('')

  switch (el.tagName) {
    case 'STRONG':
    case 'B':
      return `**${inner}**`
    case 'EM':
    case 'I':
      return `*${inner}*`
    case 'CODE':
      return `\`${inner}\``
    case 'A': {
      const href = el.getAttribute('href')
      return href ? `[${inner}](${href})` : inner
    }
    case 'BR':
      return '\n'
    default:
      return inner
  }
}

function blockToMarkdown(el: HTMLElement, depth = 0): string {
  const tag = el.tagName
  const indent = '  '.repeat(depth)

  if (/^H[1-6]$/.test(tag)) {
    const level = Number(tag[1])
    return `${'#'.repeat(level)} ${inlineMarkdown(el).trim()}\n\n`
  }

  if (tag === 'P') {
    const text = Array.from(el.childNodes).map(inlineMarkdown).join('').trim()
    return text ? `${text}\n\n` : ''
  }

  if (tag === 'PRE') {
    const code = el.querySelector('code')?.textContent ?? el.textContent ?? ''
    return `\`\`\`\n${code.replace(/\n+$/, '')}\n\`\`\`\n\n`
  }

  if (tag === 'UL' || tag === 'OL') {
    const items = Array.from(el.children)
      .filter((child) => child.tagName === 'LI')
      .map((li, index) => {
        const marker = tag === 'OL' ? `${index + 1}.` : '-'
        const text = Array.from(li.childNodes).map(inlineMarkdown).join('').trim()
        return `${indent}${marker} ${text}`
      })
    return items.join('\n') + '\n\n'
  }

  if (tag === 'BLOCKQUOTE') {
    const text = childrenToMarkdown(el, depth).trim()
    return (
      text
        .split('\n')
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n') + '\n\n'
    )
  }

  if (tag === 'HR') {
    return '---\n\n'
  }

  if (tag === 'TABLE') {
    const rows = Array.from(el.querySelectorAll('tr'))
    const lines = rows.map((row) => {
      const cells = Array.from(row.children).map((cell) =>
        inlineMarkdown(cell).trim(),
      )
      return `| ${cells.join(' | ')} |`
    })
    if (rows.length > 0) {
      const columnCount = rows[0].children.length
      const separator = `| ${Array(columnCount).fill('---').join(' | ')} |`
      lines.splice(1, 0, separator)
    }
    return lines.join('\n') + '\n\n'
  }

  // Generic containers (div wrappers around callouts, recommendations, etc.)
  return childrenToMarkdown(el, depth)
}

function childrenToMarkdown(el: HTMLElement, depth = 0): string {
  return Array.from(el.children)
    .map((child) => blockToMarkdown(child as HTMLElement, depth))
    .join('')
}

export function articleToMarkdown(article: HTMLElement): string {
  const markdown = blockToMarkdown(article)
  return markdown.replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

export function articleToPlainText(article: HTMLElement): string {
  const clone = article.cloneNode(true) as HTMLElement

  // Insert blank lines around block-level elements so the text isn't one
  // giant run-on paragraph.
  clone
    .querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, hr, tr')
    .forEach((el) => {
      el.append('\n\n')
    })

  const text = clone.textContent ?? ''
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    + '\n'
}

export function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
