// `payload run` only forwards positional arguments (its own parser swallows
// --flags), so arguments are plain words: collection slugs, plus `apply`.
//   pnpm translations:import services blog apply
export function readArgs(argv = process.argv.slice(2)) {
  const words = argv.flatMap((arg) => arg.split(',')).filter(Boolean)
  const collections = words.filter((word) => word !== 'apply')
  return {
    collections: collections.length > 0 ? collections : undefined,
    apply: words.includes('apply'),
  }
}
