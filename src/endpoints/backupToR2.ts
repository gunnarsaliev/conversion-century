import { timingSafeEqual } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Endpoint } from 'payload'
import { buildExportZip } from './exportAll'

// GET /api/backup-to-r2 — weekly backup of all data. It builds the same ZIP
// as GET /api/export-all and stores it under `backups/` in the private
// R2_BACKUP_BUCKET. Backups are never deleted.
//
// Called by the Vercel Cron in vercel.json. Vercel sends
// `Authorization: Bearer <CRON_SECRET>`, and that secret is the only way in.
//
// The backup runs every Wednesday at 21:00 Bulgarian time. Vercel crons are
// UTC-only and Sofia is UTC+2 in winter and UTC+3 in summer, so the cron
// fires at both 18:00 and 19:00 UTC. Only the call that lands on 21:00 in
// Europe/Sofia does the work. `?force=1` skips that check for a manual run.

const TIME_ZONE = 'Europe/Sofia'
const BACKUP_HOUR = 21

const sofiaHour = () =>
  Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIME_ZONE,
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(new Date()),
  )

function isAuthorized(header: string | null) {
  const secret = process.env.CRON_SECRET
  if (!secret || !header) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual = Buffer.from(header)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export const backupToR2: Endpoint = {
  path: '/backup-to-r2',
  method: 'get',
  handler: async (req) => {
    if (!isAuthorized(req.headers.get('authorization'))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bucket = process.env.R2_BACKUP_BUCKET
    if (!bucket) {
      return Response.json({ error: 'R2_BACKUP_BUCKET is not set.' }, { status: 500 })
    }

    const force = req.searchParams?.get('force') === '1'
    if (!force && sofiaHour() !== BACKUP_HOUR) {
      return Response.json({ ok: true, skipped: true, reason: `Not ${BACKUP_HOUR}:00 in ${TIME_ZONE}` })
    }

    const { zip, exportedAt, counts } = await buildExportZip(req)
    const key = `backups/conversion-century-export-${exportedAt.replace(/:/g, '-')}.zip`

    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      region: process.env.R2_REGION || 'auto',
      endpoint: process.env.R2_ENDPOINT,
      forcePathStyle: true,
    })

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: zip,
        ContentType: 'application/zip',
      }),
    )

    req.payload.logger.info(`Backup stored in R2: ${bucket}/${key} (${zip.byteLength} bytes)`)

    return Response.json({ ok: true, key, bytes: zip.byteLength, counts })
  },
}
