import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// iOS home-screen icon (180×180), made from the favicon (src/app/icon.svg)
// on a white tile, since iOS doesn't use SVG icons. Prerendered at build.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), 'src/app/icon.svg'))
  const src = `data:image/svg+xml;base64,${svg.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <img src={src} alt="" width={88} height={126} />
      </div>
    ),
    size,
  )
}
