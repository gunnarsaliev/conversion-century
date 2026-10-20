import { Montserrat } from 'next/font/google'

import '@/styles/tailwind.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${montserrat.variable}`}>
      <body
        className={`${montserrat.className} min-h-full bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  )
}
