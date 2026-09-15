import { Button } from "@/components/ui/button"

const steps = [
  "You tell us about your business, website and objectives.",
  "We review whether the project fits our expertise and approach.",
  "We arrange a consultation with a senior member of the team.",
  "If there is a strong mutual fit, we prepare the recommended next steps.",
]

export function SeoCta() {
  return (
    <section className=" p-8 sm:p-12 lg:p-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div>
          <h2 className="text-balance font-serif text-4xl font-black leading-[1.05] tracking-tight text-[#12271c] sm:text-5xl">
            Let&apos;s Find Out Whether SEO Is the Right Next Step
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Every potential partnership begins with an honest conversation. We
            will learn about your business, review your current position and
            explore whether organic search can support your goals.
          </p>
          <Button
            size="lg"
            className="mt-8 h-auto rounded-full bg-[#2f6b46] px-8 py-4 text-base font-semibold text-white hover:bg-[#265739]"
          >
            Book an Initial Consultation
          </Button>
        </div>

        {/* Right column */}
        <div className="rounded-[2rem] bg-[#e8efe9] p-8 sm:p-10">
          <h3 className="font-serif text-2xl font-bold text-[#12271c] sm:text-3xl">
            What happens next?
          </h3>
          <ol className="mt-6 space-y-6">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#12271c] text-sm font-semibold text-white"
                >
                  {i + 1}
                </span>
                <p className="text-lg leading-relaxed text-[#233d30]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
