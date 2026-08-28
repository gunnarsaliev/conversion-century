'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  $getRoot,
  $insertNodes,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  PASTE_COMMAND,
  type LexicalEditor,
} from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text'
import { ListNode, ListItemNode, insertList } from '@lexical/list'
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $setBlocksType } from '@lexical/selection'

import { theme } from './theme'
import { cleanHtml } from './cleanHtml'
import { fixWordHeadings } from './wordPasteFix'
import { plainTextToHtmlWithHeadings } from './plainTextHeadings'

type ViewMode = 'rich-text' | 'html-source'

function onError(error: unknown) {
  console.error(error)
}

function Toolbar({
  editor,
  view,
  onToggleView,
  onCopy,
  copyLabel,
}: {
  editor: LexicalEditor
  view: ViewMode
  onToggleView: (next: ViewMode) => void
  onCopy: () => void
  copyLabel: string
}) {
  const formatHeading = (level: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level))
      }
    })
  }

  const formatList = (type: 'bullet' | 'number') => {
    insertList(editor, type)
  }

  const insertLink = () => {
    const url = window.prompt('Link URL')
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
    }
  }

  const buttonClass =
    'rounded border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800'

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-700">
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      >
        Bold
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        Italic
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        Underline
      </button>
      <button type="button" className={buttonClass} onClick={() => formatHeading('h1')}>
        H1
      </button>
      <button type="button" className={buttonClass} onClick={() => formatHeading('h2')}>
        H2
      </button>
      <button type="button" className={buttonClass} onClick={() => formatHeading('h3')}>
        H3
      </button>
      <button type="button" className={buttonClass} onClick={() => formatList('bullet')}>
        Bullet list
      </button>
      <button type="button" className={buttonClass} onClick={() => formatList('number')}>
        Numbered list
      </button>
      <button type="button" className={buttonClass} onClick={insertLink}>
        Link
      </button>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex overflow-hidden rounded border border-slate-300 dark:border-slate-600">
          <button
            type="button"
            onClick={() => onToggleView('rich-text')}
            className={`px-3 py-1 text-sm ${
              view === 'rich-text'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Rich Text
          </button>
          <button
            type="button"
            onClick={() => onToggleView('html-source')}
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
          onClick={onCopy}
          className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
        >
          {copyLabel}
        </button>
      </div>
    </div>
  )
}

function EditorBody({
  view,
  htmlSource,
  onHtmlSourceChange,
}: {
  view: ViewMode
  htmlSource: string
  onHtmlSourceChange: (value: string) => void
}) {
  return (
    <div className="relative min-h-[300px] rounded border border-slate-300 dark:border-slate-600">
      {view === 'rich-text' ? (
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[300px] p-4 outline-none"
              aria-placeholder="Start typing…"
              placeholder={
                <div className="pointer-events-none absolute top-4 left-4 text-slate-400">
                  Start typing…
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      ) : (
        <textarea
          className="min-h-[300px] w-full resize-y bg-transparent p-4 font-mono text-sm outline-none"
          value={htmlSource}
          onChange={(e) => onHtmlSourceChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  )
}

/**
 * Fixes two cases where pasted content loses its headings:
 *
 * 1. Microsoft Word's clipboard HTML represents headings as plain
 *    paragraphs with Word-specific styling (e.g. class="MsoHeading1")
 *    rather than semantic <h1>-<h6> tags, so Lexical's default paste
 *    handler imports them as plain paragraphs. Fixed by rewriting those
 *    fake headings into real heading tags before conversion.
 *
 * 2. Plain text with no formatting at all sometimes marks headings by
 *    convention with a literal "H1:"/"H2:" prefix (e.g. copied from a
 *    content brief). Fixed by detecting that prefix and converting the
 *    line to a real heading.
 *
 * Both cases are handled by intercepting paste at high priority and
 * inserting the nodes ourselves — short-circuiting Lexical's default
 * handler, which would otherwise re-process the original content.
 */
function PasteHeadingFixPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent) || !event.clipboardData) {
          return false
        }

        const selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          return false
        }

        const html = event.clipboardData.getData('text/html')
        const parser = new DOMParser()

        if (html) {
          const dom = parser.parseFromString(html, 'text/html')
          fixWordHeadings(dom)
          const nodes = $generateNodesFromDOM(editor, dom)
          $insertNodes(nodes)
          return true
        }

        const text = event.clipboardData.getData('text/plain')
        if (!text) {
          return false
        }

        const generatedHtml = plainTextToHtmlWithHeadings(text)
        const dom = parser.parseFromString(generatedHtml, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom)
        $insertNodes(nodes)
        return true
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor])

  return null
}

function ToolInner() {
  const [editor] = useLexicalComposerContext()
  const [view, setView] = useState<ViewMode>('rich-text')
  const [htmlSource, setHtmlSource] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy Clean HTML')

  const handleToggleView = useCallback(
    (next: ViewMode) => {
      if (next === view) return

      if (next === 'html-source') {
        editor.getEditorState().read(() => {
          const html = $generateHtmlFromNodes(editor, null)
          setHtmlSource(html)
        })
      } else {
        const parser = new DOMParser()
        const dom = parser.parseFromString(htmlSource, 'text/html')
        editor.update(() => {
          const nodes = $generateNodesFromDOM(editor, dom)
          const root = $getRoot()
          root.clear()
          root.select()
          $insertNodes(nodes)
        })
      }

      setView(next)
    },
    [editor, htmlSource, view],
  )

  const handleCopy = useCallback(() => {
    // Always derive from the live editor state, regardless of which tab
    // is currently focused, so a raw-HTML edit gets picked up too.
    const finish = (rawHtml: string) => {
      const cleaned = cleanHtml(rawHtml)
      navigator.clipboard.writeText(cleaned).then(() => {
        setCopyLabel('Copied!')
        setTimeout(() => setCopyLabel('Copy Clean HTML'), 1500)
      })
    }

    if (view === 'html-source') {
      finish(htmlSource)
    } else {
      editor.getEditorState().read(() => {
        finish($generateHtmlFromNodes(editor, null))
      })
    }
  }, [editor, htmlSource, view])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-1 text-2xl font-bold">Lexical HTML Tool</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Write rich text, toggle to raw HTML, and export a clean HTML string
        (no style/id/class/data-* attributes, no &lt;span&gt; tags).
      </p>

      <Toolbar
        editor={editor}
        view={view}
        onToggleView={handleToggleView}
        onCopy={handleCopy}
        copyLabel={copyLabel}
      />

      <EditorBody view={view} htmlSource={htmlSource} onHtmlSourceChange={setHtmlSource} />

      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <PasteHeadingFixPlugin />
    </div>
  )
}

export default function LexicalHtmlTool() {
  const initialConfig = {
    namespace: 'LexicalHtmlTool',
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    onError,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolInner />
    </LexicalComposer>
  )
}
