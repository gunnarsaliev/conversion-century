// ---------------------------------------------------------------------------
// Region labels
// ---------------------------------------------------------------------------
//
// Mirrors the `region` select field's options in src/collections/Clients.ts
// (flag emoji + name), keyed by the same ISO-ish codes, for rendering a
// client's region(s) in the dashboard without re-deriving the flags.

const regionLabels: Record<string, string> = {
  EU: '🇪🇺 Europe',
  AL: '🇦🇱 Albania',
  AT: '🇦🇹 Austria',
  BE: '🇧🇪 Belgium',
  BA: '🇧🇦 Bosnia and Herzegovina',
  BG: '🇧🇬 Bulgaria',
  HR: '🇭🇷 Croatia',
  CY: '🇨🇾 Cyprus',
  CZ: '🇨🇿 Czech Republic',
  DK: '🇩🇰 Denmark',
  EE: '🇪🇪 Estonia',
  FI: '🇫🇮 Finland',
  FR: '🇫🇷 France',
  DE: '🇩🇪 Germany',
  GR: '🇬🇷 Greece',
  HU: '🇭🇺 Hungary',
  IE: '🇮🇪 Ireland',
  IT: '🇮🇹 Italy',
  LV: '🇱🇻 Latvia',
  LT: '🇱🇹 Lithuania',
  LU: '🇱🇺 Luxembourg',
  MT: '🇲🇹 Malta',
  MD: '🇲🇩 Moldova',
  ME: '🇲🇪 Montenegro',
  NL: '🇳🇱 Netherlands',
  MK: '🇲🇰 North Macedonia',
  NO: '🇳🇴 Norway',
  PL: '🇵🇱 Poland',
  PT: '🇵🇹 Portugal',
  RO: '🇷🇴 Romania',
  RS: '🇷🇸 Serbia',
  SK: '🇸🇰 Slovakia',
  SI: '🇸🇮 Slovenia',
  ES: '🇪🇸 Spain',
  SE: '🇸🇪 Sweden',
  CH: '🇨🇭 Switzerland',
  TR: '🇹🇷 Turkey',
  UA: '🇺🇦 Ukraine',
  GB: '🇬🇧 United Kingdom',
  US: '🇺🇸 United States',
  OTHER: '🏳️ Other',
}

const regionLabel = (code: string) => regionLabels[code] ?? code

export { regionLabels, regionLabel }
