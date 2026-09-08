import fs from 'fs/promises'
import path from 'path'
import type { CollectionAfterChangeHook } from 'payload'

// The import/export plugin's `imports` and `exports` collections are plain
// Payload upload collections, so every CSV a user imports or exports gets
// written to local disk (the collection's staticDir, which defaults to
// `./imports` / `./exports`) and kept there indefinitely. We only need the
// file for the duration of the import/export job itself — the resulting
// summary (for imports) or the doc metadata (for exports) is what's worth
// keeping, not the raw file. This hook deletes the file from disk right
// after the operation that needed it has run, then clears the doc's file
// fields so the admin UI doesn't show a broken/missing file.
export const clearUploadedFileAfterProcessing = (
  staticDir: string,
): CollectionAfterChangeHook => {
  return async ({ doc, collection, req, operation }) => {
    if (operation !== 'update' || !doc.filename) return doc

    const filePath = path.resolve(staticDir, doc.filename as string)

    try {
      await fs.unlink(filePath)
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        req.payload.logger.error({
          err,
          msg: `Failed to delete uploaded file for ${collection.slug} doc ${doc.id}`,
        })
      }
    }

    try {
      await req.payload.update({
        id: doc.id,
        collection: collection.slug,
        data: {
          filename: null,
          mimeType: null,
          filesize: null,
        },
        overrideAccess: true,
        req,
      })
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `Failed to clear file fields on ${collection.slug} doc ${doc.id}`,
      })
    }

    return doc
  }
}
