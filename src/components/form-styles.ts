import { cn } from "@/lib/utils";

// Shared look for the site's larger, "filled" forms (the offer form and the
// consultation form): fields with a soft tint at rest that turn white with a
// ring on focus, rounded corners and 15px text. Applied as classes on the
// shadcn primitives, so the primitives themselves keep their defaults.

export const fieldClassName =
  "h-11 rounded-xl border-transparent bg-muted/60 px-3.5 text-[15px] shadow-none transition-[background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:bg-background md:text-[15px] dark:bg-input/30";

export const textareaClassName = cn(fieldClassName, "h-auto min-h-32 py-3");

export const labelClassName = "text-sm font-medium text-foreground/80";

export const legendClassName = "mb-1 text-lg font-semibold tracking-tight";

// Sections after the first are separated by a rule.
export const sectionClassName = "border-t pt-8 first:border-t-0 first:pt-0";

export const checkboxClassName = "mt-0.5 size-[18px] shrink-0 rounded accent-primary";

export const submitButtonClassName = "h-12 rounded-xl px-8 text-[15px]";
