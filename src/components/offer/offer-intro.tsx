import type { OfferStatic } from "@/types/offer";

// Agency introduction shown right below the offer hero.
export function OfferIntro({ brand }: { brand: OfferStatic["brand"] }) {
  return (
    <section aria-labelledby="intro-heading" className="py-16 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
        <h2
          id="intro-heading"
          className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {brand.introHeader}
        </h2>
        <div className="flex flex-col gap-6 text-lg text-pretty text-muted-foreground">
          {brand.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
