'use client'

import { useCallback, useRef, useState } from 'react'
import { convertToHtml, type MammothMessage } from 'mammoth'

import { cleanHtml } from '../lexical-html/cleanHtml'

type ViewMode = 'preview' | 'html-source'

export default function DocxHtmlTool() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [html, setHtml] = useState('')
  const [messages, setMessages] = useState<MammothMessage[]>([])
  const [view, setView] = useState<ViewMode>('preview')
  const [copyLabel, setCopyLabel] = useState('Copy Clean HTML')
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)

    if (!file.name.toLowerCase().endsWith('.docx')) {
      setError('Please select a .docx file.')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await convertToHtml({ arrayBuffer })
      setFileName(file.name)
      setHtml(result.value)
      setMessages(result.messages)
      setView('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert the document.')
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleCopy = useCallback(() => {
    const cleaned = cleanHtml(html)
    navigator.clipboard.writeText(cleaned).then(() => {
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy Clean HTML'), 1500)
    })
  }, [html])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-1 text-2xl font-bold">DOCX to HTML Tool</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Upload a .docx file and export clean HTML (no style/id/class/data-*
        attributes, no &lt;span&gt; tags).
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-slate-300 dark:border-slate-600'
        }`}
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {fileName ? (
            <>
              Loaded <span className="font-medium">{fileName}</span> — drop
              another .docx to replace it.
            </>
          ) : (
            'Drop a .docx file here, or click to choose one.'
          )}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {html && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-700">
            <div className="flex overflow-hidden rounded border border-slate-300 dark:border-slate-600">
              <button
                type="button"
                onClick={() => setView('preview')}
                className={`px-3 py-1 text-sm ${
                  view === 'preview'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setView('html-source')}
                className={`px-3 py-1 text-sm ${
                  view === 'html-source'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                HTML Source
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="ml-auto rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              {copyLabel}
            </button>
          </div>

          <div className="min-h-[300px] rounded border border-slate-300 dark:border-slate-600">
            {view === 'preview' ? (
              <div
                className="prose dark:prose-invert max-w-none p-4"
                // Preview only, rendered from a file the user themselves
                // uploaded — never remote/untrusted content.
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <textarea
                readOnly
                className="min-h-[300px] w-full resize-y bg-transparent p-4 font-mono text-sm outline-none"
                value={html}
                spellCheck={false}
              />
            )}
          </div>

          {messages.length > 0 && (
            <details className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              <summary className="cursor-pointer select-none">
                {messages.length} conversion message{messages.length === 1 ? '' : 's'}
              </summary>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {messages.map((m, i) => (
                  <li key={i} className={m.type === 'error' ? 'text-red-600' : ''}>
                    {m.message}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </div>
  )
}
