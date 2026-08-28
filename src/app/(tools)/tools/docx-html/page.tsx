import type { Metadata } from 'next'

import DocxHtmlTool from './DocxHtmlTool'

export const metadata: Metadata = {
  title: 'DOCX to HTML Tool',
}

export default function DocxHtmlToolPage() {
  return <DocxHtmlTool />
}
