import type { EditorThemeClasses } from 'lexical'

// Purely cosmetic classes for the on-screen editor. None of this leaks into
// exported HTML that matters — cleanHtml() strips all class attributes.
export const theme: EditorThemeClasses = {
  paragraph: 'mb-2',
  heading: {
    h1: 'text-3xl font-bold mb-3 mt-4',
    h2: 'text-2xl font-bold mb-2 mt-4',
    h3: 'text-xl font-bold mb-2 mt-3',
  },
  quote: 'border-l-4 border-slate-300 pl-4 italic text-slate-600 dark:text-slate-400',
  list: {
    ul: 'list-disc list-inside mb-2',
    ol: 'list-decimal list-inside mb-2',
    listitem: 'ml-2',
  },
  link: 'text-blue-600 underline dark:text-blue-400',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
}
