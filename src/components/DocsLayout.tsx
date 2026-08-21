import { type Node } from '@markdoc/markdoc'

import { DocActions } from '@/components/DocActions'
import { DocsHeader } from '@/components/DocsHeader'
import { PrevNextLinks } from '@/components/PrevNextLinks'
import { Prose } from '@/components/Prose'
import { TableOfContents } from '@/components/TableOfContents'
import { collectSections } from '@/lib/sections'

export function DocsLayout({
  children,
  frontmatter: { title },
  nodes,
}: {
  children: React.ReactNode
  frontmatter: { title?: string }
  nodes: Array<Node>
}) {
  let tableOfContents = collectSections(nodes)

  return (
    <>
      <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
        <article>
          <DocsHeader title={title} />
          <DocActions title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks className="print:hidden" />
      </div>
      <TableOfContents
        tableOfContents={tableOfContents}
        className="print:hidden"
      />
    </>
  )
}
