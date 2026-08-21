function getYouTubeId(idOrUrl: string): string {
  try {
    const url = new URL(idOrUrl)
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1)
    }
    if (url.searchParams.has('v')) {
      return url.searchParams.get('v') as string
    }
    const embedMatch = url.pathname.match(/\/embed\/([^/]+)/)
    if (embedMatch) {
      return embedMatch[1]
    }
  } catch {
    // Not a URL — assume it's already a bare video ID.
  }
  return idOrUrl
}

export function YouTube({
  id,
  title = 'YouTube video',
}: {
  id: string
  title?: string
}) {
  const videoId = getYouTubeId(id)

  return (
    <div className="not-prose my-8 aspect-video overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
