import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import yaml from 'js-yaml'

import { DocsLayout } from '@/components/DocsLayout'
import { Fence } from '@/components/Fence'

let documentSlugifyMap = new Map()

const nodes = {
  // DocsLayout renders the docs sidebar/TOC chrome for every Markdoc page in
  // the app — @markdoc/next.js only supports a single global schema
  // (schemaPath), so there's no per-folder override available here. Keep all
  // page.md files under src/app/**/docs/** so this assumption holds; a page.md
  // added elsewhere would incorrectly inherit this layout.
  document: {
    ...defaultNodes.document,
    render: DocsLayout,
    transform(node, config) {
      documentSlugifyMap.set(config, slugifyWithCounter())

      return new Tag(
        this.render,
        {
          frontmatter: yaml.load(node.attributes.frontmatter),
          nodes: node.children,
        },
        node.transformChildren(config),
      )
    },
  },
  heading: {
    ...defaultNodes.heading,
    transform(node, config) {
      let slugify = documentSlugifyMap.get(config)
      let attributes = node.transformAttributes(config)
      let children = node.transformChildren(config)
      let text = children.filter((child) => typeof child === 'string').join(' ')
      let id = attributes.id ?? slugify(text)

      return new Tag(
        `h${node.attributes.level}`,
        { ...attributes, id },
        children,
      )
    },
  },
  // Links to other sites open in a new tab with the same rel as the rest of
  // the site (EXTERNAL_LINK_REL in src/lib/external-link.ts).
  link: {
    ...defaultNodes.link,
    transform(node, config) {
      let attributes = node.transformAttributes(config)
      let children = node.transformChildren(config)
      let host = /^(https?:)?\/\//i.test(attributes.href ?? '')
        ? new URL(attributes.href, 'https://conversion-century.com').hostname
        : null
      let external =
        host !== null &&
        host !== 'conversion-century.com' &&
        host !== 'www.conversion-century.com'

      return new Tag(
        'a',
        external
          ? { ...attributes, target: '_blank', rel: 'nofollow noopener noreferrer' }
          : attributes,
        children,
      )
    },
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
}

export default nodes
