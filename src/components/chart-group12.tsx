'use client'

import {
  addDays,
  differenceInDays,
  format,
  startOfDay,
  subDays,
} from 'date-fns'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from 'cn'

import { ChartRadialShape } from '@/components/chart-radial-shape'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
interface ChartGroup12Stat {
  title: string
  value: string
  /** Small muted text after the value, e.g. "от 100". */
  suffix?: string
}

interface ChartGroup12Props {
  /** Domain Rating (0–100) shown in the gauge card. */
  domainRating?: number
  /** Cards in the stats row; defaults to totals of the demo data. */
  stats?: ChartGroup12Stat[]
  className?: string
}

// Seeded random for consistent data generation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate data for any date range dynamically
const generateDataForRange = (from: Date, to: Date) => {
  const data = []
  const days = differenceInDays(to, from) + 1

  for (let i = 0; i < days; i++) {
    const date = addDays(startOfDay(from), i)
    const seed = date.getTime() / 86400000

    data.push({
      date: date,
      dateStr: format(date, 'MMM d'),
      revenue: Math.floor(seededRandom(seed) * 8000) + 3000,
      orders: Math.floor(seededRandom(seed + 1000) * 80) + 30,
      visitors: Math.floor(seededRandom(seed + 2000) * 2000) + 500,
    })
  }
  return data
}

const sourceData = [
  { name: 'Organic', value: 42 },
  { name: 'Paid', value: 28 },
  { name: 'Social', value: 18 },
  { name: 'Referral', value: 12 },
]

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig

const sourceConfig = {
  value: { label: 'Percentage', color: 'var(--chart-2)' },
} satisfies ChartConfig

const ChartGroup12 = ({
  domainRating = 24,
  stats,
  className,
}: ChartGroup12Props) => {
  // Fixed reporting window: the last 30 days.
  const filteredData = useMemo(
    () => generateDataForRange(subDays(new Date(), 30), new Date()),
    [],
  )

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0)
  const totalVisitors = filteredData.reduce(
    (sum, item) => sum + item.visitors,
    0,
  )
  const conversionRate =
    totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : '0'

  return (
    <section className={cn('py-32', className)}>
      <div className="container space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-muted-foreground">
              Track your business performance
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            stats ?? [
              {
                title: 'Total Revenue',
                value: `$${totalRevenue.toLocaleString()}`,
              },
              {
                title: 'Total Orders',
                value: totalOrders.toLocaleString(),
              },
              {
                title: 'Visitors',
                value: totalVisitors.toLocaleString(),
              },
              {
                title: 'Conversion Rate',
                value: `${conversionRate}%`,
              },
            ]
          ).map((stat: ChartGroup12Stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stat.value}
                  {stat.suffix && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {stat.suffix}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue, last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className="h-64 w-full">
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGrad12" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="dateStr"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    fontSize={12}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    fontSize={12}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    fill="url(#revGrad12)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Rating</CardTitle>
              <CardDescription>
                Авторитет на домейна от 0 до 100
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartRadialShape
                value={domainRating}
                max={100}
                label="от 100"
                size={160}
                className="max-w-none border-0 bg-transparent p-0"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={sourceConfig} className="h-40 w-full">
                <BarChart
                  data={sourceData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    width={70}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key metrics summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Order Value</span>
                <span className="font-semibold">
                  $
                  {totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orders/Day</span>
                <span className="font-semibold">
                  {filteredData.length > 0
                    ? Math.round(totalOrders / filteredData.length)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue/Day</span>
                <span className="font-semibold">
                  $
                  {filteredData.length > 0
                    ? Math.round(
                        totalRevenue / filteredData.length,
                      ).toLocaleString()
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visitors/Day</span>
                <span className="font-semibold">
                  {filteredData.length > 0
                    ? Math.round(totalVisitors / filteredData.length)
                    : 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export { ChartGroup12 }
