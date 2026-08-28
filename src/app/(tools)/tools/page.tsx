import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tools',
}

const tools = [
  {
    href: '/tools/lexical-html',
    name: 'Lexical HTML Tool',
    description:
      'Write rich text, toggle between rich text and raw HTML, and export clean HTML.',
  },
  {
    href: '/tools/docx-html',
    name: 'DOCX to HTML Tool',
    description: 'Upload a .docx file and export it as clean HTML.',
  },
]

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-1 text-2xl font-bold">Tools</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Internal utilities for working with rich text and HTML.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="block h-full rounded border border-slate-300 p-4 transition-colors hover:border-blue-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-blue-400 dark:hover:bg-slate-800"
            >
              <h2 className="mb-1 font-semibold">{tool.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {tool.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
