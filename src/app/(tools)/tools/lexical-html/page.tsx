import { Suspense } from 'react'
import type { Metadata } from 'next'

import LexicalHtmlTool from './LexicalHtmlTool'

export const metadata: Metadata = {
  title: 'Lexical HTML Tool',
}

// The Lexical editor generates random node keys while rendering, so it
// renders per request rather than at build time.
export default function LexicalHtmlToolPage() {
  return (
    <Suspense>
      <LexicalHtmlTool />
    </Suspense>
  )
}
