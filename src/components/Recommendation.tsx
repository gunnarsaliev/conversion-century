'use client'

import { isValidElement, useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'

function getTextContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return ''
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children)
  }

  return ''
}

export function Recommendation({
  children,
}: {
  children: React.ReactNode
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = getTextContent(children).trim()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="group relative my-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="pr-12 prose prose-slate dark:prose-invert">
        {children}
      </div>
      <button
        onClick={handleCopy}
        className={clsx(
          'absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium transition-colors',
          copied
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
        )}
        aria-label={copied ? 'Copied!' : 'Copy recommendation'}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
