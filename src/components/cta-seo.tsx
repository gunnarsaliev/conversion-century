import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

const STEP_KEYS = ["tell", "review", "consult", "nextSteps"] as const

export function SeoCta() {
  const t = useTranslations("SeoCta")

  return (
    // Same horizontal padding and max width as the footer below, so the two line up.
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div>
          <h2 className="text-balance text-3xl font-black leading-[1.08] tracking-tight text-[#12271c] sm:text-4xl lg:text-5xl lg:leading-[1.05]">
            {t("heading")}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {t("description")}
          </p>
          <Button
            size="lg"
            render={<Link href="/book-a-consultation" />}
            nativeButton={false}
            className="mt-6 h-auto w-full rounded-full bg-[#2f6b46] px-8 py-4 text-base font-semibold text-white hover:bg-[#265739] sm:mt-8 sm:w-auto"
          >
            {t("cta")}
          </Button>
        </div>

        {/* Right column */}
        <div className="rounded-3xl bg-[#e8efe9] p-6 sm:rounded-[2rem] sm:p-10">
          <h3 className="text-xl font-bold text-[#12271c] sm:text-2xl lg:text-3xl">
            {t("stepsHeading")}
          </h3>
          <ol className="mt-5 space-y-4 sm:mt-6 sm:space-y-6">
            {STEP_KEYS.map((key, i) => (
              <li key={key} className="flex gap-3 sm:gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#12271c] text-sm font-semibold text-white sm:size-8"
                >
                  {i + 1}
                </span>
                <p className="text-base leading-relaxed text-[#233d30] sm:text-lg">{t(`steps.${key}`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
