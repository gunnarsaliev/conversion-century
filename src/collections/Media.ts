import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    // Files live in R2 (see s3Storage in payload.config.ts), not on local
    // disk. Without this, Payload also tries to read/write to `staticDir`
    // locally — which is empty outside of environments that uploaded there
    // directly — and admin thumbnails / the `/api/media/file/:filename`
    // route 500 with "missing on the disk".
    disableLocalStorage: true,
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    // A string here (e.g. 'thumbnail') resolves via `sizes.<name>.url` on the
    // raw doc, which our S3/R2 adapter never populates — only the top-level
    // `url` gets rewritten to R2 in `generateFileURL` above. Left as a
    // string, Payload falls back to its local `/api/media/file/:filename`
    // route, which 500s because `disableLocalStorage: true` leaves nothing
    // on disk. A function bypasses that fallback entirely.
    adminThumbnail: ({ doc }) => {
      const size = (doc as { sizes?: Record<string, { filename?: string }> }).sizes?.thumbnail
      const filename = size?.filename || (doc as { filename?: string }).filename
      const prefix = (doc as { prefix?: string }).prefix
      const key = prefix ? `${prefix}/${filename}` : filename
      return `${process.env.R2_PUBLIC_URL}/${key}`
    },
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
}
