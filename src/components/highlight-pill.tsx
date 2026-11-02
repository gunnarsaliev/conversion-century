import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "cn";

// Rounded tinted pill with a check mark, as used under the home page hero.
export function HighlightPill({
  children,
  size = "default",
  className,
}: {
  children: ReactNode;
  size?: "default" | "sm";
  className?: string;
}) {
  const small = size === "sm";
  return (
    <div
      className={cn(
        "flex items-center rounded-full bg-primary/10",
        small ? "gap-1.5 px-2.5 py-1" : "gap-2 px-3.5 py-1.5",
        className,
      )}
    >
      <Check
        className={cn(
          "shrink-0 stroke-3 text-primary",
          small ? "size-3" : "size-4",
        )}
      />
      <p
        className={cn(
          "font-medium text-foreground",
          small ? "text-xs" : "text-sm",
        )}
      >
        {children}
      </p>
    </div>
  );
}
