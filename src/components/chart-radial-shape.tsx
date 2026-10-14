"use client";

import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

export const title = "A radial chart with a custom shape";

interface ChartRadialShapeProps {
  value?: number;
  /** When set, the bar is drawn as a full-circle gauge of `value / max`. */
  max?: number;
  label?: string;
  /** Maximum chart size in px; it shrinks to fit narrower containers. */
  size?: number;
  className?: string;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const ChartRadialShape = ({
  value = 1260,
  max,
  label = "Visitors",
  size = 250,
  className,
}: ChartRadialShapeProps) => {
  // Recharts' polar grid only takes pixel radii, so measure the available
  // width and scale everything down to fit it.
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const fitted = width ? Math.min(size, width) : size;
  // Radii below were designed for a 250px chart.
  const scale = fitted / 250;
  const chartData = [{ key: "value", value, fill: "var(--color-value)" }];
  // A gauge starts at 12 o'clock and runs clockwise over the full circle;
  // without `max` keep the template's fixed arc.
  const startAngle = max ? 90 : 0;
  const endAngle = max ? -270 : 100;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-xl rounded-md border bg-background p-4",
        className,
      )}
    >
      <ChartContainer
        className="mx-auto aspect-square"
        style={{ maxHeight: fitted }}
        config={chartConfig}
      >
        <RadialBarChart
          data={chartData}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={80 * scale}
          outerRadius={140 * scale}
        >
          <PolarGrid
            className="first:fill-muted last:fill-background"
            gridType="circle"
            polarRadius={[86 * scale, 74 * scale]}
            radialLines={false}
            stroke="none"
          />
          {max !== undefined && (
            <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          )}
          <RadialBar background dataKey="value" cornerRadius={max ? 10 * scale : 0} />
          <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      <tspan
                        className="fill-foreground font-bold"
                        style={{ fontSize: 36 * scale }}
                        x={viewBox.cx}
                        y={viewBox.cy}
                      >
                        {value.toLocaleString()}
                      </tspan>
                      <tspan
                        className="fill-muted-foreground"
                        style={{ fontSize: Math.max(12, 14 * scale) }}
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24 * scale}
                      >
                        {label}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};

export { ChartRadialShape };
export default ChartRadialShape;
