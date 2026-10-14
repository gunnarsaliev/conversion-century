"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "cn";

import { LineShadowText } from "@/components/ui/line-shadow-text";
import { Button } from "@/components/ui/button";
interface Hero232Props {
  /** Small pill above the heading. */
  eyebrow?: React.ReactNode;
  /** Optional row under the heading, e.g. co-branded logos. */
  logos?: React.ReactNode;
  titleBefore?: string;
  /** Word(s) drawn with the line-shadow effect. */
  titleHighlight?: string;
  titleAfter?: string;
  /** One string, or several paragraphs. */
  description?: string | string[];
  /** Buttons or other content under the description. */
  actions?: React.ReactNode;
  className?: string;
}

const defaultProps: Hero232Props = {
  eyebrow: "Flexible Plan customized for you",
  titleBefore: "The only app you need to Stay",
  titleHighlight: "Productive",
  titleAfter: "ever.",
  description:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum animi, ipsam provident optio delectus neque aliquid cumque. Beatae, odio!",
  actions: (
    <>
      <Button
        variant="secondary"
        className="text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
      >
        <span>Documentation</span>
        <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
      </Button>
      <Button
        variant="default"
        className="text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
      >
        <span>Get Started</span>
        <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
      </Button>
    </>
  ),
};

const Hero232 = (props: Hero232Props) => {
  const {
    eyebrow,
    logos,
    titleBefore,
    titleHighlight,
    titleAfter,
    description,
    actions,
    className,
  } = { ...defaultProps, ...props };
  const paragraphs =
    description === undefined
      ? []
      : Array.isArray(description)
        ? description
        : [description];

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        className,
      )}
    >
      <div className="relative z-20 container mx-auto flex flex-col items-center justify-start px-6 py-12">
        <div className="relative z-10 flex w-fit flex-col items-center justify-center gap-4 pb-3 text-center">
          {eyebrow && (
            <div className="text-md flex w-fit items-center justify-center gap-3 rounded-full bg-muted/60 px-5 py-1 tracking-tight">
              <span className="size-2 rounded-full bg-foreground" />
              <span>{eyebrow}</span>
            </div>
          )}
          <div className="relative flex max-w-4xl items-center justify-center text-center text-5xl font-medium tracking-tight md:text-7xl">
            <h1 className="relative z-10 tracking-tighter">
              {titleBefore && (
                <span className="mr-3 text-muted-foreground/50">
                  {titleBefore}
                </span>
              )}
              {titleHighlight && <LineShadowText>{titleHighlight}</LineShadowText>}
              {titleAfter && (
                <span className="ml-3 text-muted-foreground/50">{titleAfter}</span>
              )}
            </h1>
          </div>
          {logos && <div className="mt-6">{logos}</div>}
          {paragraphs.length > 0 && (
            <div
              className={cn(
                "mt-5 flex flex-col gap-4 text-pretty text-muted-foreground/80",
                paragraphs.length > 1 ? "max-w-3xl" : "max-w-xl",
              )}
            >
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
          {actions && <div className="flex gap-4">{actions}</div>}
        </div>
      </div>
    </section>
  );
};

export { Hero232 };
