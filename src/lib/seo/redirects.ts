// ---------------------------------------------------------------------------
// Redirects (Dashboard → SEO → Redirects)
// ---------------------------------------------------------------------------
//
// Shared by the `redirects` collection, the dashboard actions and
// src/proxy.ts, so it has no imports. `from` is matched against the request
// path with any locale prefix stripped, so one rule covers /old and /bg/old.

export const REDIRECT_STATUS_CODES = ["301", "302"] as const;
export type RedirectStatusCode = (typeof REDIRECT_STATUS_CODES)[number];

export type RedirectRule = { from: string; to: string; statusCode: RedirectStatusCode };

// Paths a redirect may never take over: the dashboard, Payload and login.
const RESERVED_PREFIXES = ["/dashboard", "/api", "/admin", "/login", "/_next"];

const LOCALE_PREFIX = /^\/(en|bg)(?=\/|$)/;

// "/Old-Page/" → "/old-page"; "old" → "/old". Query strings and hashes are
// dropped: rules match on the path only.
export function normalizeRedirectPath(value: string) {
  const path = value.trim().split(/[?#]/)[0] ?? "";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const trimmed = withSlash.replace(/\/+$/, "");
  return (trimmed || "/").toLowerCase();
}

// The request path a rule is looked up by: normalized, locale prefix removed.
export function redirectLookupPath(pathname: string) {
  return normalizeRedirectPath(pathname.replace(LOCALE_PREFIX, "") || "/");
}

export function isReservedRedirectPath(path: string) {
  const normalized = redirectLookupPath(path);
  return RESERVED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

export function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

// `to` is either an absolute http(s) URL or a site path.
export function normalizeRedirectTarget(value: string) {
  const target = value.trim();
  if (isAbsoluteUrl(target)) return target;
  return target.startsWith("/") ? target : `/${target}`;
}

// Why a rule is invalid, or null. Messages are keys under the dashboard's
// `Seo.redirects.errors` namespace (the admin panel shows the key as is).
export function redirectRuleError(from: string, to: string) {
  if (!from.trim() || from.trim() === "/") return "fromRequired";
  if (!to.trim()) return "toRequired";
  if (isReservedRedirectPath(from)) return "reserved";
  if (
    !isAbsoluteUrl(to) &&
    redirectLookupPath(normalizeRedirectTarget(to)) === redirectLookupPath(from)
  ) {
    return "loop";
  }
  return null;
}
