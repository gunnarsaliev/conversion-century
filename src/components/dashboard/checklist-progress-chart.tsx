"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

// ---------------------------------------------------------------------------
// Checklist progress chart
// ---------------------------------------------------------------------------
//
// Gauge-style radial chart (based on chart-radial-shape.tsx) showing the
// share of done checklist items against a muted background track
// representing the remainder.

const chartConfig = {
  done: {
    label: "Done",
    color: "#10b981",
  },
  remaining: {
    label: "Remaining",
    color: "#eab308",
  },
} satisfies ChartConfig;

type ChecklistProgressChartProps = {
  done: number;
  remaining: number;
};

const ChecklistProgressChart = ({
  done,
  remaining,
}: ChecklistProgressChartProps) => {
  const total = done + remaining;
  const chartData = [{ item: "checklist", done, fill: "var(--color-done)" }];

  return (
    <ChartContainer
      className="aspect-[2/1.6] w-[220px] max-w-full shrink-0"
      config={chartConfig}
    >
      <RadialBarChart
        data={chartData}
        cx="50%"
        cy="60%"
        endAngle={180}
        innerRadius={55}
        outerRadius={85}
        margin={{ top: 0, right: 8, bottom: 32, left: 8 }}
      >
        <PolarGrid
          className="first:fill-muted last:fill-background"
          gridType="circle"
          polarRadius={[59, 51]}
          radialLines={false}
          stroke="none"
        />
        <RadialBar
          background={{ fill: "var(--color-remaining)" }}
          dataKey="done"
        />
        <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                    <tspan
                      className="fill-foreground text-xl font-bold"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 10}
                    >
                      {total > 0 ? `${done}/${total}` : "0/0"}
                    </tspan>
                    <tspan
                      className="fill-muted-foreground text-xs"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 8}
                    >
                      Done
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

export { ChecklistProgressChart };
