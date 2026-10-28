"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ClampedQuoteProps {
  children: React.ReactNode;
  moreLabel: string;
  className?: string;
}

// A quote cut to a fixed height (so cards line up) with a fade and a
// "read more" link when it overflows. The full text opens on hover, or on
// tap where there's no hover.
export function ClampedQuote({ children, moreLabel, className }: ClampedQuoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div ref={ref} className={cn("relative h-42 overflow-hidden", className)}>
        {children}
        {overflowing && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent dark:from-card" />
        )}
      </div>
      {overflowing && (
        <Popover>
          <PopoverTrigger
            openOnHover
            delay={150}
            className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {moreLabel}
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="max-h-[60vh] w-[min(90vw,32rem)] overflow-y-auto p-4 text-base text-muted-foreground italic"
          >
            {children}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
