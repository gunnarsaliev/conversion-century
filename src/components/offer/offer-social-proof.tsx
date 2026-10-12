import type { OfferStatic } from "@/types/offer";
import { Logos35 } from "@/components/logos35";
import { LogoOrName } from "./offer-ui";
import Image from "next/image";

// Iconify's flag sets use ISO 3166 codes, where the UK is "gb".
const flagCode = (country: string) =>
  (country === "UK" ? "gb" : country).toLowerCase();

const countryNames = new Intl.DisplayNames(["bg"], { type: "region" });

export function OfferSocialProof({
  socialProof,
}: {
  socialProof: OfferStatic["socialProof"];
}) {
  return (
    <section id="clients" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <Logos35
        heading={socialProof.header}
        logos={socialProof.clients.map((client) => ({
          name: client.name,
          src: client.logo,
        }))}
        className="py-0"
      />

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {socialProof.badges.map((badge) =>
          badge.logo ? (
            <Image
              key={badge.name}
              src={badge.logo}
              alt={badge.name}
              width={867}
              height={133}
              className="h-auto w-full max-w-4xl"
            />
          ) : (
            <div
              key={badge.name}
              className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2"
            >
              <LogoOrName name={badge.name} logo="" className="h-6 text-sm" />
            </div>
          ),
        )}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {socialProof.countriesHeader}
        </h3>
        <ul className="flex flex-wrap justify-center gap-4">
          {socialProof.countries.map((country) => {
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
      </div>
    </section>
  );
}
