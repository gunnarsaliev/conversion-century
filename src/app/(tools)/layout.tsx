import { Lato } from 'next/font/google'

import '@/styles/tailwind.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${lato.className} min-h-full bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  )
}
