// Blog categories, shared by the Payload field (src/collections/Blog.ts) and
// the site. Labels here are the English admin labels; the public site uses
// the `BlogCategories` messages instead. Order is the order shown on /blog.
export const BLOG_CATEGORY_LABELS = {
  'web-development': 'Web development',
  'seo-performance': 'SEO performance',
  'content-optimization': 'Content optimization',
  blogging: 'Blogging',
  'seo-consulting': 'SEO consulting',
  'keyword-research': 'Keyword research',
  'link-building': 'Link building',
  checklists: 'Checklists',
} as const

export type BlogCategory = keyof typeof BLOG_CATEGORY_LABELS

export const BLOG_CATEGORIES = Object.keys(BLOG_CATEGORY_LABELS) as BlogCategory[]

export const isBlogCategory = (value: unknown): value is BlogCategory =>
  typeof value === 'string' && Object.hasOwn(BLOG_CATEGORY_LABELS, value)

// Category pages share blog/[slug] with posts, so a post can't use a
// category value as its slug (enforced in src/collections/Blog.ts).
export const blogCategoryPath = (category: BlogCategory) => `/blog/${category}`
