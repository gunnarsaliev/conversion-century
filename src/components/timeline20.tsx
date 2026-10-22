"use client";

import { motion } from "motion/react";
import { Cpu, FlagIcon, LocateFixed, RocketIcon } from "lucide-react";
import { cn } from "cn";

import { Separator } from "@/components/ui/separator";
interface Timeline20Props {
  className?: string;
}

const Timeline20 = ({ className }: Timeline20Props) => {
  const currentPhase = 2;
  const timelinePhases = [
    {
      id: 0,
      date: "January 15, 2024",
      title: "Phase I",
      description: "Project initialization and strategic planning begins.",
      icon: RocketIcon,
    },
    {
      id: 1,
      date: "March 10, 2024",
      title: "Phase II",
      description: "Detailed research and preliminary development stage.",
      icon: Cpu,
    },
    {
      id: 2,
      date: "June 5, 2024",
      title: "Phase III",
      description: "Core implementation and major milestones achieved.",
      icon: LocateFixed,
    },
    {
      id: 3,
      date: "September 20, 2024",
      title: "Phase IV",
      description: "Final refinements and project completion.",
      icon: FlagIcon,
    },
  ];

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Timeline
          </h1>
          <div className="relative w-full">
            <Separator
              orientation="vertical"
              className="absolute top-5 bottom-5 left-2.5"
            />
            <motion.div
              initial={{ height: 0 }}
              whileInView={{
                height: `${(currentPhase / timelinePhases.length) * 100}%`,
              }}
              transition={{ ease: "easeOut", duration: 0.5 }}
              className="absolute top-5 left-2.5 z-10 w-0.5 origin-top bg-foreground"
              style={{ maxHeight: "calc(100% - 2.5rem)" }}
            />
            <div className="flex flex-col gap-10">
              {timelinePhases.map((phase) => {
                const PhaseIcon = phase.icon;
                return (
                  <div key={phase.id} className="relative pl-13">
                    <div className="absolute top-0 -left-6 z-10 flex size-18 items-center justify-center rounded-full bg-background p-1">
                      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background p-[5px]">
                        <div className="flex size-full items-center justify-center rounded-md border border-border bg-muted">
                          <PhaseIcon size={16} />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {phase.date}
                    </p>
                    <h2 className="text-xl font-bold tracking-tighter text-foreground">
                      {phase.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {phase.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline20 };
