'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { articleToMarkdown, articleToPlainText, downloadTextFile } from '@/lib/domToText'

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'page'
  )
}

function getArticle(): HTMLElement | null {
  return document.querySelector('article')
}

function DownloadIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5" />
      <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" />
    </svg>
  )
}

function PrintIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5.5 7V3.5h9V7" />
      <rect x="3.5" y="7" width="13" height="6.5" rx="1" />
      <path d="M5.5 12.5h9V16.5h-9z" />
    </svg>
  )
}

const buttonClasses =
  'inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'

export function DocActions({ title }: { title?: string }) {
  const [status, setStatus] = useState<string | null>(null)

  const flash = (message: string) => {
    setStatus(message)
    setTimeout(() => setStatus(null), 2000)
  }

  const handleDownloadMarkdown = () => {
    const article = getArticle()
    if (!article) return
    const markdown = articleToMarkdown(article)
    downloadTextFile(`${slugify(title ?? 'page')}.md`, markdown)
    flash('Downloaded .md')
  }

  const handleDownloadTxt = () => {
    const article = getArticle()
    if (!article) return
    const text = articleToPlainText(article)
    downloadTextFile(`${slugify(title ?? 'page')}.txt`, text)
    flash('Downloaded .txt')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="not-prose print:hidden mb-6 flex flex-wrap items-center gap-2">
      <button type="button" onClick={handleDownloadMarkdown} className={buttonClasses}>
        <DownloadIcon className="h-3.5 w-3.5" />
        Markdown
      </button>
      <button type="button" onClick={handleDownloadTxt} className={buttonClasses}>
        <DownloadIcon className="h-3.5 w-3.5" />
        Text
      </button>
      <button type="button" onClick={handlePrint} className={buttonClasses}>
        <PrintIcon className="h-3.5 w-3.5" />
        Print
      </button>
      {status && (
        <span
          className={clsx(
            'text-xs font-medium text-green-700 dark:text-green-400',
          )}
        >
          {status}
        </span>
      )}
    </div>
  )
}
