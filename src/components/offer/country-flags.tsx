import { cn } from "cn";

// Iconify's flag sets use ISO 3166 codes, where the UK is "gb".
const flagCode = (country: string) =>
  (country === "UK" ? "gb" : country).toLowerCase();

const countryNames = new Intl.DisplayNames(["bg"], { type: "region" });

// Row of rectangular flags; country names are kept as alt text and tooltip.
export function CountryFlags({
  countries,
  className,
}: {
  countries: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap justify-center gap-4", className)}>
      {countries.map((country) => {
        const name = countryNames.of(flagCode(country).toUpperCase()) ?? country;
        return (
          <li key={country}>
            <img
              src={`https://api.iconify.design/flag/${flagCode(country)}-4x3.svg`}
              alt={name}
              title={name}
              width={64}
              height={48}
              className="h-12 w-16 rounded-md object-cover shadow-sm ring-1 ring-border"
            />
          </li>
        );
      })}
    </ul>
  );
}
