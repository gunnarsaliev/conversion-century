import type { Metadata } from 'next'

import LexicalHtmlTool from './LexicalHtmlTool'

export const metadata: Metadata = {
  title: 'Lexical HTML Tool',
}

export default function LexicalHtmlToolPage() {
  return <LexicalHtmlTool />
}
