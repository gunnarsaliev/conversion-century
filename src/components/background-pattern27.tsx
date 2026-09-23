import { cn } from "cn";

interface BackgroundPattern27Props {
  className?: string;
}

// Decorative page background: a primary-tinted glow fading down from the
// top. Absolutely positioned, so place it inside a `relative` parent.
const BackgroundPattern27 = ({ className }: BackgroundPattern27Props) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -z-10 h-svh max-h-[1200px] min-h-[600px]",
        className,
      )}
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(from var(--primary) calc(l - 0.1) c h / 0.20), transparent 70%)",
      }}
    />
  );
};

export { BackgroundPattern27 };
