import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

const STEP_KEYS = ["tell", "review", "consult", "nextSteps"] as const

export function SeoCta() {
  const t = useTranslations("SeoCta")

  return (
    <section className=" p-8 sm:p-12 lg:p-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div>
          <h2 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-[#12271c] sm:text-5xl">
            {t("heading")}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
          <Button
            size="lg"
            className="mt-8 h-auto rounded-full bg-[#2f6b46] px-8 py-4 text-base font-semibold text-white hover:bg-[#265739]"
          >
            {t("cta")}
          </Button>
        </div>

        {/* Right column */}
        <div className="rounded-[2rem] bg-[#e8efe9] p-8 sm:p-10">
          <h3 className="text-2xl font-bold text-[#12271c] sm:text-3xl">
            {t("stepsHeading")}
          </h3>
          <ol className="mt-6 space-y-6">
            {STEP_KEYS.map((key, i) => (
              <li key={key} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#12271c] text-sm font-semibold text-white"
                >
                  {i + 1}
                </span>
                <p className="text-lg leading-relaxed text-[#233d30]">{t(`steps.${key}`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
