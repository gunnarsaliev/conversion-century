const LOOKER_STUDIO_HOSTS = new Set([
  "lookerstudio.google.com",
  "datastudio.google.com",
]);

// Turns any Looker Studio (formerly Data Studio) report link — the share
// link, the editor link (`/u/0/reporting/.../edit`) or an existing embed
// link — into its `/embed/reporting/...` form so it can be rendered in an
// iframe. Returns null for anything that isn't a Looker Studio report URL
// (e.g. short `/s/...` links, which can't be resolved without a request),
// so callers can fall back to rendering it as a plain link.
export function toLookerStudioEmbedUrl(url: string | null | undefined) {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  if (!LOOKER_STUDIO_HOSTS.has(parsed.hostname)) return null;

  const match = parsed.pathname.match(
    /\/reporting\/([\w-]+)(?:\/page\/([\w-]+))?/,
  );
  if (!match) return null;

  const [, reportId, pageId] = match;
  const pagePath = pageId ? `/page/${pageId}` : "";

  return `https://${parsed.hostname}/embed/reporting/${reportId}${pagePath}`;
}
