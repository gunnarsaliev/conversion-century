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
// Services count chart
// ---------------------------------------------------------------------------
//
// Gauge-style radial chart (based on chart-radial-text.tsx) showing the
// number of services a client has, colored distinctly from
// ChecklistProgressChart since it's a plain count rather than a
// done/remaining split.

const chartConfig = {
  services: {
    label: "Services",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

type ServicesCountChartProps = {
  count: number;
};

const ServicesCountChart = ({ count }: ServicesCountChartProps) => {
  const chartData = [{ item: "services", services: count }];

  return (
    <ChartContainer
      className="mx-auto aspect-square max-h-[200px] w-full max-w-[200px]"
      config={chartConfig}
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={250}
        innerRadius={65}
        outerRadius={90}
      >
        <PolarGrid
          className="first:fill-muted last:fill-background"
          gridType="circle"
          polarRadius={[70, 60]}
          radialLines={false}
          stroke="none"
        />
        <RadialBar
          background
          cornerRadius={10}
          dataKey="services"
          fill="var(--color-services)"
        />
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
                      className="fill-foreground text-3xl font-bold"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      {count}
                    </tspan>
                    <tspan
                      className="fill-muted-foreground"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                    >
                      Services
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

export { ServicesCountChart };
