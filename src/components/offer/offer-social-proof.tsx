import type { OfferStatic } from "@/types/offer";
import { ClientLogos } from "@/components/client-logos";
import { CountryFlags } from "./country-flags";
import { LogoOrName } from "./offer-ui";
import Image from "next/image";

export function OfferSocialProof({
  socialProof,
}: {
  socialProof: OfferStatic["socialProof"];
}) {
  return (
    <section id="clients" className="scroll-mt-24 border-t border-border py-16 sm:py-24">
      <ClientLogos heading={socialProof.header} className="py-0" />

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

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {socialProof.countriesHeader}
        </h3>
        <p className="max-w-3xl text-pretty text-muted-foreground">
          {socialProof.countriesDescription}
        </p>
        <CountryFlags countries={socialProof.countries} className="mt-4" />
      </div>
    </section>
  );
}
