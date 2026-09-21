import {
  HandHeart,
  Handshake,
  Medal,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
interface Feature104Props {
  className?: string;
}

const Feature104 = ({ className }: Feature104Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm"
          >
            <Medal className="h-auto w-4" />
            Highlights
          </Badge>
          <h2 className="text-center text-3xl font-semibold lg:text-4xl">
            WHY CONVERSION CENTURY
          </h2>
          <p className="text-center text-muted-foreground lg:text-lg">
        Small Enough to Care Deeply. Experienced Enough to Deliver.
          </p>
        </div>
        <div className="gap mt-14 grid gap-2.5 lg:grid-cols-3">
          <div className="flex flex-col gap-2.5">
            <div className="gap flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Users className="h-auto w-6" />
                </span>
                <h3 className="font-medium">
                  Work Directly With Senior Specialists
                </h3>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                You work directly with the agency Owner, Head of Copywriting
                and Specialists responsible for the strategy and results.
                Important decisions are not passed through layers of account
                management.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <UserCheck className="h-auto w-6" />
                </span>
                <h3 className="font-medium">
                  An Honest Assessment Before We Begin
                </h3>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                We do not accept every enquiry. We first evaluate your
                website, objectives and market to determine whether SEO is
                the right investment and whether we are the right team. If
                another channel would serve your business better, we will
                tell you.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <HandHeart className="h-auto w-6" />
                </span>
                <h3 className="font-medium">
                  Personally Invested in Your Success
                </h3>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                We treat your goals with the care and responsibility they
                deserve. Our role is not to complete a task list, it is to
                understand what your business needs next and help move it
                forward.
              </p>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1590098563176-07884b06d7f7"
            alt="placeholder"
            className="hidden h-full rounded-lg object-cover lg:block"
          />
          <div className="flex flex-col gap-2.5">
            <div className="gap flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <ShieldCheck className="h-auto w-6" />
                </span>
                <h3 className="font-medium">Sustainable, Evidence-Led SEO</h3>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                We use tested white-hat strategies designed to build lasting
                organic value. We do not gamble with client websites through
                black-hat methods or unvalidated tactics that could damage
                performance for years.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Sparkles className="h-auto w-6" />
                </span>
                <h3 className="font-medium">
                  Experience That Continues to Evolve
                </h3>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                Our work is grounded in developed know-how, international
                experience and continuous professional education. We follow
                world-class industry training, contribute to research and
                keep improving how we work as search evolves.
              </p>
            </div>
            <div className="gap flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                  <Handshake className="h-auto w-6" />
                </span>
                <h3 className="font-medium">Collaboration Without Ego</h3>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                Strong results often require several teams. We work
                constructively with your employees, developers, designers,
                paid-media specialists and other agencies, focusing on the
                shared outcome rather than ownership of the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature104 };
