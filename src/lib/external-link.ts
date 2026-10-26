// Every link that leaves the site carries this rel, so it passes no ranking
// signal to the target and the opened page can't reach back via window.opener.
export const EXTERNAL_LINK_REL = "nofollow noopener noreferrer";

const OWN_HOSTS = new Set(["conversion-century.com", "www.conversion-century.com"]);

// Absolute http(s) or protocol-relative URLs pointing at another host. Relative
// paths, anchors, mailto: and tel: links stay internal.
export function isExternalHref(href: string | null | undefined): boolean {
  if (!href || !/^(https?:)?\/\//i.test(href)) return false;
  try {
    return !OWN_HOSTS.has(new URL(href, "https://conversion-century.com").hostname);
  } catch {
    return false;
  }
}
