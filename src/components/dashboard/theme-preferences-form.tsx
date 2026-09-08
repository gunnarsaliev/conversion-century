"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Theme preferences
// ---------------------------------------------------------------------------
//
// Lets the user pick Light / Dark / System, backed by next-themes (already
// wired up app-wide in providers.tsx). `theme` is undefined until mounted
// on the client, so the picker renders a neutral loading state first to
// avoid a hydration mismatch.

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

const ThemePreferencesForm = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration-safe mount pattern
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium">Theme</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how the dashboard looks on this device.
        </p>

        <div
          role="radiogroup"
          aria-label="Theme"
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = mounted && theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-lg border p-4 text-sm outline-none transition-all hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected && "border-primary bg-primary/5",
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" aria-hidden="true" />
                  </div>
                )}
                <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { ThemePreferencesForm };
