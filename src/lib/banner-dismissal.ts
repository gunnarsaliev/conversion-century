// ---------------------------------------------------------------------------
// Banner dismissal
// ---------------------------------------------------------------------------
//
// A closed BannerStandard with a `dismissKey` is remembered per user in the
// `dismissedBanners` field of their Users record (written by the
// dismissBanner server action), so pages can leave it out of later renders
// for that user only, on any device. Keys identify one occurrence and end in
// its year, e.g. "birthday-12-2026": next year's banner gets a new key, and
// keys from past years are pruned on the next dismissal.

export const DISMISS_KEY_PATTERN = /^[\w-]{1,80}-(\d{4})$/;

export function getDismissedBanners(value: unknown): Set<string> {
  return new Set(
    Array.isArray(value) ? value.filter((key): key is string => typeof key === "string") : [],
  );
}
