"use client";

import { Star, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type FormStarRatingOption = {
  value: string;
  label?: string;
  icon?: LucideIcon;
};

export interface FormStarRatingProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options?: FormStarRatingOption[];
  /** Cumulative star fill (default) or discrete icon buttons. */
  variant?: "stars" | "icons";
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  itemClassName?: string;
  id?: string;
  /** Visible label rendered above the control. */
  label?: React.ReactNode;
  /** Id of an external label element (e.g. FieldLabel) for aria-labelledby. */
  labelId?: string;
  /** Show the selected option label (or emptyLabel) below the control. */
  showLabel?: boolean;
  emptyLabel?: string;
  size?: "sm" | "default" | "lg";
}

const DEFAULT_STAR_OPTIONS: FormStarRatingOption[] = [
  { value: "1", label: "Very poor" },
  { value: "2", label: "Poor" },
  { value: "3", label: "Average" },
  { value: "4", label: "Good" },
  { value: "5", label: "Excellent" },
];

const sizeClass = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
} as const;

const FormStarRating = ({
  name,
  value: valueProp,
  defaultValue,
  onValueChange,
  options = DEFAULT_STAR_OPTIONS,
  variant = "stars",
  disabled = false,
  invalid = false,
  className,
  itemClassName,
  id: idProp,
  label,
  labelId: labelIdProp,
  showLabel = false,
  emptyLabel = "Select a rating",
  size = "default",
}: FormStarRatingProps) => {
  const generatedId = useId();
  const baseId = idProp ?? generatedId;
  const builtInLabelId = `${baseId}-label`;
  const labelId = labelIdProp ?? (label ? builtInLabelId : undefined);
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? "",
  );
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const value = isControlled ? (valueProp ?? "") : uncontrolledValue;
  const numericValue = Number(value) || 0;

  const handleValueChange = (next: string) => {
    if (!isControlled) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? emptyLabel;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label ? (
        <Label id={builtInLabelId} className="text-center">
          {label}
        </Label>
      ) : null}
      <RadioGroup
        name={name}
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={cn(
          "flex w-auto flex-row justify-center gap-0",
          variant === "icons" && "flex-wrap gap-2",
        )}
        aria-invalid={invalid || undefined}
        aria-labelledby={labelId}
      >
        {options.map((option) => {
          const optionValue = Number(option.value) || 0;
          const activeValue = hoveredValue ?? numericValue;
          const isFilled =
            variant === "stars" &&
            optionValue > 0 &&
            optionValue <= activeValue;
          const Icon = option.icon ?? Star;
          const itemId = `${baseId}-${option.value}`;

          return (
            <Label
              key={option.value}
              htmlFor={itemId}
              className={cn(
                "group w-fit! cursor-pointer rounded-sm border-none px-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background has-data-checked:bg-transparent dark:has-data-checked:bg-transparent",
                disabled && "pointer-events-none opacity-50",
                variant === "icons" &&
                  "rounded-md bg-primary/5 p-3 has-data-checked:bg-primary dark:has-data-checked:bg-primary",
                itemClassName,
              )}
              onMouseEnter={() => {
                if (variant === "stars") setHoveredValue(optionValue);
              }}
              onMouseLeave={() => {
                if (variant === "stars") setHoveredValue(null);
              }}
            >
              <span className="relative inline-flex">
                <Icon
                  className={cn(
                    sizeClass[size],
                    "stroke-primary transition-colors",
                    variant === "stars" &&
                      (isFilled
                        ? "fill-primary"
                        : "fill-transparent group-hover:fill-primary"),
                    variant === "icons" &&
                      "group-has-data-checked:stroke-primary-foreground",
                  )}
                />
                <RadioGroupItem
                  value={option.value}
                  id={itemId}
                  aria-invalid={invalid || undefined}
                  aria-label={option.label ?? option.value}
                  className="sr-only absolute"
                />
              </span>
            </Label>
          );
        })}
      </RadioGroup>

      {showLabel && (
        <p
          aria-live="polite"
          className="text-center text-xs text-muted-foreground"
        >
          {selectedLabel}
        </p>
      )}
    </div>
  );
};

export { FormStarRating, DEFAULT_STAR_OPTIONS };
export default FormStarRating;
