"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "cn";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export interface ChartCard5Item {
  name: string;
  value: number;
  color: string;
  // Shown in the legend instead of `value`, e.g. "48%".
  displayValue?: string;
}

type DataItem = ChartCard5Item;

interface ChartCard5Props {
  title?: string;
  description?: string;
  centerValue?: string;
  centerLabel?: string;
  data?: DataItem[];
  className?: string;
}

const defaultData: DataItem[] = [
  { name: "Desktop", value: 4520, color: "var(--chart-1)" },
  { name: "Mobile", value: 3210, color: "var(--chart-2)" },
  { name: "Tablet", value: 1240, color: "var(--chart-3)" },
];

const ChartCard5 = ({
  title = "Traffic by Device",
  description = "Visitor breakdown by device type",
  centerValue = "8,970",
  centerLabel = "Total visitors",
  data = defaultData,
  className,
}: ChartCard5Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          <div className="relative size-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      style={{
                        cursor: "pointer",
                        transition: "opacity 0.4s ease-out",
                        opacity:
                          activeIndex === null || activeIndex === index
                            ? 1
                            : 0.3,
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{centerValue}</span>
              <span className="text-xs text-muted-foreground">
                {centerLabel}
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-all duration-300 ease-out",
                  activeIndex === index ? "bg-muted" : "hover:bg-muted/50",
                  activeIndex !== null && activeIndex !== index && "opacity-40",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-3 rounded-full transition-transform duration-300 ease-out",
                      activeIndex === index && "scale-125",
                    )}
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {item.displayValue ?? item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ChartCard5 };
