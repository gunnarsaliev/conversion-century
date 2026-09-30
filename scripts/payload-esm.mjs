// Workaround for a tsx/Node 22 ESM interop bug: `payload.config.ts` is loaded
// as CommonJS (this repo has no top-level "type": "module", which the
// Next.js build itself requires — postcss.config.js and friends are CJS).
// Payload's own dependency chain (@payloadcms/richtext-lexical) is ESM with
// top-level await, which crashes with ERR_REQUIRE_ASYNC_MODULE when required
// synchronously from a CJS-mode .ts file.
//
// Fix: temporarily set "type": "module" in package.json just for the
// `payload generate:types` subprocess, then always restore the original
// file content, even if generation fails.
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const pkgPath = new URL('../package.json', import.meta.url)
const original = readFileSync(pkgPath, 'utf8')

try {
  const pkg = JSON.parse(original)
  pkg.type = 'module'
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  const result = spawnSync('npx', ['payload', 'generate:types'], {
    stdio: 'inherit',
  })

  process.exitCode = result.status ?? 1
} finally {
  writeFileSync(pkgPath, original)
}
