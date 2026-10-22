"use client";

import { useTranslations } from "next-intl";
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
// Gauge-style radial chart (based on chart-radial-text.tsx) showing the
// share of done checklist items against a background track representing
// the remainder.

const chartColors = {
  done: "#10b981",
  remaining: "#eab308",
};

type ChecklistProgressChartProps = {
  done: number;
  remaining: number;
};

const ChecklistProgressChart = ({
  done,
  remaining,
}: ChecklistProgressChartProps) => {
  const t = useTranslations("Clients.checklist");
  const chartConfig = {
    done: { label: t("done"), color: chartColors.done },
    remaining: { label: t("remaining"), color: chartColors.remaining },
  } satisfies ChartConfig;
  const total = done + remaining;
  const chartData = [{ item: "checklist", done }];

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
          background={{ fill: "var(--color-remaining)" }}
          cornerRadius={10}
          dataKey="done"
          fill="var(--color-done)"
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
                      {total > 0 ? `${done}/${total}` : "0/0"}
                    </tspan>
                    <tspan
                      className="fill-muted-foreground"
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                    >
                      {t("done")}
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
