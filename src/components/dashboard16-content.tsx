"use client";

import { useMotionValueEvent, useSpring } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BedDouble,
  ChevronDown,
  DoorOpen,
  Globe,
  KeyRound,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { cn } from "@/lib/utils";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Booking types & mock data
// ---------------------------------------------------------------------------

type Guest = {
  name: string;
  avatar?: string;
  initials: string;
};

type Booking = {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  time: string;
  guests: Guest[];
  guestCount: number;
  source: "Direct" | "Booking.com" | "Expedia" | "Walk-in";
  status: string;
  statusColor: string;
  nights: number;
  specialRequests?: string;
};

const ARRIVALS: Booking[] = [
  {
    id: "arr-1",
    guestName: "James Brown",
    roomNumber: "412",
    roomType: "Suite",
    time: "2:00 PM Check-in",
    guests: [
      {
        name: "James Brown",
        avatar: "https://i.pravatar.cc/32?img=12",
        initials: "JB",
      },
      {
        name: "Maria Brown",
        avatar: "https://i.pravatar.cc/32?img=25",
        initials: "MB",
      },
    ],
    guestCount: 4,
    source: "Direct",
    status: "VIP",
    statusColor: "violet",
    nights: 3,
    specialRequests: "Late check-out, extra pillows",
  },
  {
    id: "arr-2",
    guestName: "Sarah & Tom Lee",
    roomNumber: "215",
    roomType: "Deluxe",
    time: "3:00 PM Check-in",
    guests: [
      {
        name: "Sarah Lee",
        avatar: "https://i.pravatar.cc/32?img=32",
        initials: "SL",
      },
      {
        name: "Tom Lee",
        avatar: "https://i.pravatar.cc/32?img=15",
        initials: "TL",
      },
    ],
    guestCount: 2,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 5,
  },
  {
    id: "arr-3",
    guestName: "Michael Chen",
    roomNumber: "108",
    roomType: "Standard",
    time: "4:00 PM Check-in",
    guests: [
      {
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/32?img=53",
        initials: "MC",
      },
    ],
    guestCount: 1,
    source: "Expedia",
    status: "Pending",
    statusColor: "amber",
    nights: 2,
    specialRequests: "Ground floor preferred",
  },
  {
    id: "arr-4",
    guestName: "Emily Davis",
    roomNumber: "501",
    roomType: "Penthouse",
    time: "5:30 PM Check-in",
    guests: [
      {
        name: "Emily Davis",
        avatar: "https://i.pravatar.cc/32?img=44",
        initials: "ED",
      },
      {
        name: "Ryan Davis",
        avatar: "https://i.pravatar.cc/32?img=18",
        initials: "RD",
      },
      { name: "Sophie Davis", initials: "SD" },
    ],
    guestCount: 5,
    source: "Direct",
    status: "VIP",
    statusColor: "violet",
    nights: 7,
    specialRequests: "Airport transfer, champagne on arrival",
  },
];

const RECENT_ARRIVALS_TABLE: Booking[] = [
  ...ARRIVALS,
  {
    id: "arr-5",
    guestName: "Noah Wilson",
    roomNumber: "306",
    roomType: "Deluxe",
    time: "6:00 PM Check-in",
    guests: [
      {
        name: "Noah Wilson",
        avatar: "https://i.pravatar.cc/32?img=61",
        initials: "NW",
      },
    ],
    guestCount: 2,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 4,
    specialRequests: "High floor",
  },
  {
    id: "arr-6",
    guestName: "Olivia Martin",
    roomNumber: "119",
    roomType: "Standard",
    time: "6:30 PM Check-in",
    guests: [
      {
        name: "Olivia Martin",
        avatar: "https://i.pravatar.cc/32?img=47",
        initials: "OM",
      },
    ],
    guestCount: 1,
    source: "Direct",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 2,
    specialRequests: "Near elevator",
  },
  {
    id: "arr-7",
    guestName: "Liam Thompson",
    roomNumber: "522",
    roomType: "Suite",
    time: "7:00 PM Check-in",
    guests: [
      {
        name: "Liam Thompson",
        avatar: "https://i.pravatar.cc/32?img=68",
        initials: "LT",
      },
    ],
    guestCount: 3,
    source: "Expedia",
    status: "Pending",
    statusColor: "amber",
    nights: 5,
    specialRequests: "Baby crib",
  },
  {
    id: "arr-8",
    guestName: "Ava Rodriguez",
    roomNumber: "227",
    roomType: "Deluxe",
    time: "7:20 PM Check-in",
    guests: [
      {
        name: "Ava Rodriguez",
        avatar: "https://i.pravatar.cc/32?img=36",
        initials: "AR",
      },
    ],
    guestCount: 2,
    source: "Walk-in",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 1,
    specialRequests: "Late dinner reservation",
  },
  {
    id: "arr-9",
    guestName: "Ethan Brooks",
    roomNumber: "402",
    roomType: "Suite",
    time: "8:00 PM Check-in",
    guests: [
      {
        name: "Ethan Brooks",
        avatar: "https://i.pravatar.cc/32?img=34",
        initials: "EB",
      },
      {
        name: "Lara Brooks",
        avatar: "https://i.pravatar.cc/32?img=66",
        initials: "LB",
      },
    ],
    guestCount: 4,
    source: "Direct",
    status: "VIP",
    statusColor: "violet",
    nights: 3,
    specialRequests: "Fruit basket",
  },
  {
    id: "arr-10",
    guestName: "Mia Sanchez",
    roomNumber: "143",
    roomType: "Standard",
    time: "8:20 PM Check-in",
    guests: [
      {
        name: "Mia Sanchez",
        avatar: "https://i.pravatar.cc/32?img=57",
        initials: "MS",
      },
    ],
    guestCount: 1,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 2,
    specialRequests: "Quiet room",
  },
  {
    id: "arr-11",
    guestName: "Henry Young",
    roomNumber: "333",
    roomType: "Deluxe",
    time: "8:40 PM Check-in",
    guests: [
      {
        name: "Henry Young",
        avatar: "https://i.pravatar.cc/32?img=72",
        initials: "HY",
      },
    ],
    guestCount: 2,
    source: "Expedia",
    status: "Pending",
    statusColor: "amber",
    nights: 3,
    specialRequests: "Extra towels",
  },
  {
    id: "arr-12",
    guestName: "Grace Patel",
    roomNumber: "610",
    roomType: "Penthouse",
    time: "9:10 PM Check-in",
    guests: [
      {
        name: "Grace Patel",
        avatar: "https://i.pravatar.cc/32?img=46",
        initials: "GP",
      },
    ],
    guestCount: 2,
    source: "Direct",
    status: "VIP",
    statusColor: "violet",
    nights: 6,
    specialRequests: "Private transfer",
  },
  {
    id: "arr-13",
    guestName: "Logan Turner",
    roomNumber: "208",
    roomType: "Standard",
    time: "9:25 PM Check-in",
    guests: [
      {
        name: "Logan Turner",
        avatar: "https://i.pravatar.cc/32?img=13",
        initials: "LT",
      },
    ],
    guestCount: 1,
    source: "Walk-in",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 1,
    specialRequests: "No feather pillows",
  },
  {
    id: "arr-14",
    guestName: "Amelia Scott",
    roomNumber: "439",
    roomType: "Suite",
    time: "9:45 PM Check-in",
    guests: [
      {
        name: "Amelia Scott",
        avatar: "https://i.pravatar.cc/32?img=24",
        initials: "AS",
      },
    ],
    guestCount: 2,
    source: "Booking.com",
    status: "Confirmed",
    statusColor: "emerald",
    nights: 4,
    specialRequests: "Rose petals setup",
  },
  {
    id: "arr-15",
    guestName: "Jack Parker",
    roomNumber: "256",
    roomType: "Deluxe",
    time: "10:10 PM Check-in",
    guests: [
      {
        name: "Jack Parker",
        avatar: "https://i.pravatar.cc/32?img=58",
        initials: "JP",
      },
    ],
    guestCount: 2,
    source: "Expedia",
    status: "Pending",
    statusColor: "amber",
    nights: 2,
    specialRequests: "Late checkout request",
  },
  {
    id: "arr-16",
    guestName: "Sophia Nguyen",
    roomNumber: "509",
    roomType: "Suite",
    time: "10:30 PM Check-in",
    guests: [
      {
        name: "Sophia Nguyen",
        avatar: "https://i.pravatar.cc/32?img=69",
        initials: "SN",
      },
    ],
    guestCount: 3,
    source: "Direct",
    status: "VIP",
    statusColor: "violet",
    nights: 5,
    specialRequests: "Anniversary decor",
  },
];

const IN_HOUSE: Booking[] = [
  {
    id: "inh-1",
    guestName: "Robert Garcia",
    roomNumber: "302",
    roomType: "Deluxe",
    time: "Since Feb 16",
    guests: [
      {
        name: "Robert Garcia",
        avatar: "https://i.pravatar.cc/32?img=60",
        initials: "RG",
      },
    ],
    guestCount: 1,
    source: "Walk-in",
    status: "Checked In",
    statusColor: "sky",
    nights: 4,
  },
  {
    id: "inh-2",
    guestName: "Anna & Chris Bell",
    roomNumber: "419",
    roomType: "Suite",
    time: "Since Feb 15",
    guests: [
      {
        name: "Anna Bell",
        avatar: "https://i.pravatar.cc/32?img=29",
        initials: "AB",
      },
      {
        name: "Chris Bell",
        avatar: "https://i.pravatar.cc/32?img=14",
        initials: "CB",
      },
    ],
    guestCount: 2,
    source: "Booking.com",
    status: "Checked In",
    statusColor: "sky",
    nights: 6,
    specialRequests: "Daily housekeeping at 10 AM",
  },
  {
    id: "inh-3",
    guestName: "Lisa Park",
    roomNumber: "207",
    roomType: "Standard",
    time: "Since Feb 17",
    guests: [
      {
        name: "Lisa Park",
        avatar: "https://i.pravatar.cc/32?img=38",
        initials: "LP",
      },
    ],
    guestCount: 1,
    source: "Direct",
    status: "Checked In",
    statusColor: "sky",
    nights: 2,
  },
];

const DEPARTURES: Booking[] = [
  {
    id: "dep-1",
    guestName: "David Kim",
    roomNumber: "315",
    roomType: "Deluxe",
    time: "11:00 AM Check-out",
    guests: [
      {
        name: "David Kim",
        avatar: "https://i.pravatar.cc/32?img=52",
        initials: "DK",
      },
      {
        name: "Jenny Kim",
        avatar: "https://i.pravatar.cc/32?img=41",
        initials: "JK",
      },
    ],
    guestCount: 2,
    source: "Expedia",
    status: "Checking Out",
    statusColor: "sky",
    nights: 3,
  },
  {
    id: "dep-2",
    guestName: "Rachel Green",
    roomNumber: "104",
    roomType: "Standard",
    time: "12:00 PM Check-out",
    guests: [
      {
        name: "Rachel Green",
        avatar: "https://i.pravatar.cc/32?img=23",
        initials: "RG",
      },
    ],
    guestCount: 1,
    source: "Direct",
    status: "Checking Out",
    statusColor: "sky",
    nights: 1,
  },
];

const STATUS_STYLES: Record<string, string> = {
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
};

const SOURCE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Direct: Globe,
  "Booking.com": Globe,
  Expedia: Globe,
  "Walk-in": DoorOpen,
};

// ---------------------------------------------------------------------------
// Booking list sub-components (used by Latest Updates panel)
// ---------------------------------------------------------------------------

function AvatarGroup({
  guests,
  guestCount,
}: {
  guests: Guest[];
  guestCount: number;
}) {
  if (guests.length === 0) return null;

  const overflow = guestCount - guests.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {guests.slice(0, 4).map((a) => (
          <Avatar
            key={a.name}
            className="size-7 border-2 border-background ring-0"
          >
            {a.avatar && <AvatarImage src={a.avatar} alt={a.name} />}
            <AvatarFallback className="bg-muted text-[10px] font-medium">
              {a.initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-2 text-xs font-medium text-muted-foreground">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = React.useState(false);
  const SourceIcon = SOURCE_ICONS[booking.source] || Globe;

  return (
    <div className="rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div>
            <h3 className="truncate text-sm leading-snug font-semibold">
              {booking.guestName} — {booking.roomType} {booking.roomNumber}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {booking.time}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AvatarGroup
              guests={booking.guests}
              guestCount={booking.guestCount}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SourceIcon className="size-3.5" />
              <span>via {booking.source}</span>
            </div>
            <span className="text-muted-foreground/40">·</span>
            <Badge
              variant="secondary"
              className={cn(
                "border-0 px-2 py-0 text-[11px] font-medium",
                STATUS_STYLES[booking.statusColor] || STATUS_STYLES.violet,
              )}
            >
              {booking.status}
            </Badge>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted"
        >
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Room Type:</span>{" "}
            {booking.roomType}
          </p>
          <p>
            <span className="font-medium text-foreground">Nights:</span>{" "}
            {booking.nights}
          </p>
          {booking.specialRequests && (
            <p>
              <span className="font-medium text-foreground">
                Special Requests:
              </span>{" "}
              {booking.specialRequests}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function BookingList({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <BedDouble className="mb-2 size-8 opacity-40" />
        <p className="text-sm">No bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formatters, palette & chart data
// ---------------------------------------------------------------------------

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const numberFormatter = new Intl.NumberFormat("en-US");
const capacityDeltaFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "always",
  maximumFractionDigits: 1,
});
const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
});
const mixBase = "var(--background)";

const palette = {
  primary: "var(--primary)",
  secondary: {
    light: `color-mix(in oklch, var(--primary) 75%, ${mixBase})`,
    dark: `color-mix(in oklch, var(--primary) 85%, ${mixBase})`,
  },
  tertiary: {
    light: `color-mix(in oklch, var(--primary) 55%, ${mixBase})`,
    dark: `color-mix(in oklch, var(--primary) 65%, ${mixBase})`,
  },
  quaternary: {
    light: `color-mix(in oklch, var(--primary) 40%, ${mixBase})`,
    dark: `color-mix(in oklch, var(--primary) 45%, ${mixBase})`,
  },
};

type RoomCapacityStatItem = {
  title: string;
  occupied: number;
  total: number;
  weeklyChange: number;
  tone: {
    active: string;
    soft: string;
  };
};

const KPI_CAPACITY_SEGMENTS = 24;

const roomCapacityStats: RoomCapacityStatItem[] = [
  {
    title: "Standard Rooms",
    occupied: 128,
    total: 160,
    weeklyChange: 2.8,
    tone: {
      active: palette.primary,
      soft: `color-mix(in oklch, var(--primary) 12%, ${mixBase})`,
    },
  },
  {
    title: "Deluxe Rooms",
    occupied: 67,
    total: 90,
    weeklyChange: 3.5,
    tone: {
      active: palette.secondary.light,
      soft: `color-mix(in oklch, var(--primary) 20%, ${mixBase})`,
    },
  },
  {
    title: "Suites",
    occupied: 21,
    total: 30,
    weeklyChange: -1.9,
    tone: {
      active: palette.tertiary.light,
      soft: `color-mix(in oklch, var(--primary) 26%, ${mixBase})`,
    },
  },
];

const monthlyRevenueData = [
  { month: "JAN", revenue: 72000 },
  { month: "FEB", revenue: 128000 },
  { month: "MAR", revenue: 103000 },
  { month: "APR", revenue: 176000 },
  { month: "MAY", revenue: 230000 },
  { month: "JUN", revenue: 142000 },
  { month: "JUL", revenue: 310000 },
  { month: "AUG", revenue: 640000 },
  { month: "SEP", revenue: 410000 },
  { month: "OCT", revenue: 210000 },
  { month: "NOV", revenue: 98000 },
  { month: "DEC", revenue: 260000 },
];

type SalesMetricKey = "netRevenue" | "roomRevenue" | "platformRevenue";

const roomRevenueShare = [
  0.66, 0.68, 0.67, 0.69, 0.7, 0.66, 0.72, 0.71, 0.69, 0.68, 0.7, 0.69,
];
const platformRevenueShare = [
  0.34, 0.32, 0.33, 0.31, 0.3, 0.34, 0.28, 0.29, 0.31, 0.32, 0.3, 0.31,
];

const salesMetricData: Record<
  SalesMetricKey,
  {
    label: string;
    changePercent: number;
    data: { month: string; value: number }[];
  }
> = {
  netRevenue: {
    label: "Net Revenue",
    changePercent: 8.2,
    data: monthlyRevenueData.map((entry) => ({
      month: entry.month,
      value: entry.revenue,
    })),
  },
  roomRevenue: {
    label: "Room Revenue",
    changePercent: 6.9,
    data: monthlyRevenueData.map((entry, index) => ({
      month: entry.month,
      value: Math.round(entry.revenue * roomRevenueShare[index]),
    })),
  },
  platformRevenue: {
    label: "Platform Revenue",
    changePercent: 4.7,
    data: monthlyRevenueData.map((entry, index) => ({
      month: entry.month,
      value: Math.round(entry.revenue * platformRevenueShare[index]),
    })),
  },
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: palette.secondary.light,
  },
} satisfies ChartConfig;

// ---------------------------------------------------------------------------
// Room capacity KPI cards
// ---------------------------------------------------------------------------

const HotelStatsCards = () => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {roomCapacityStats.map((stat) => {
      const isPositive = stat.weeklyChange >= 0;
      const occupancyRatio = stat.occupied / stat.total;
      const occupancyPercent = Math.round(occupancyRatio * 100);
      const filledSegments = Math.max(
        0,
        Math.min(
          KPI_CAPACITY_SEGMENTS,
          Math.round(occupancyRatio * KPI_CAPACITY_SEGMENTS),
        ),
      );
      const availableRooms = Math.max(0, stat.total - stat.occupied);

      return (
        <Card key={stat.title} className="gap-0 px-4 py-3 shadow-none">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                isPositive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
              )}
            >
              {capacityDeltaFormatter.format(stat.weeklyChange)}%
            </span>
          </div>

          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-3xl leading-none font-semibold tracking-tight tabular-nums">
              {numberFormatter.format(stat.occupied)}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              / {numberFormatter.format(stat.total)} rooms
            </p>
          </div>

          <div className="mt-3 flex items-end gap-1 overflow-hidden">
            {Array.from({ length: KPI_CAPACITY_SEGMENTS }).map((_, index) => (
              <span
                key={`${stat.title}-${index}`}
                className="h-6 w-1.5 shrink-0 rounded-[3px]"
                style={{
                  backgroundColor:
                    index < filledSegments ? stat.tone.active : stat.tone.soft,
                  opacity:
                    index < filledSegments
                      ? index % 3 === 0
                        ? 0.86
                        : 1
                      : 0.42,
                }}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {occupancyPercent}% occupied
            </span>
            <span className="font-medium text-foreground tabular-nums">
              {numberFormatter.format(availableRooms)} available
            </span>
          </div>
        </Card>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Occupancy / revenue chart
// ---------------------------------------------------------------------------

interface CustomReferenceLabelProps {
  viewBox?: { x?: number; y?: number };
  value: number;
}

const CustomReferenceLabel: React.FC<CustomReferenceLabelProps> = (props) => {
  const { viewBox, value } = props;
  const y = viewBox?.y ?? 0;

  const width = React.useMemo(() => {
    const characterWidth = 8;
    const padding = 10;
    return (
      compactCurrencyFormatter.format(value).length * characterWidth + padding
    );
  }, [value]);

  return (
    <>
      <rect
        x={0}
        y={y - 9}
        width={width}
        height={18}
        fill="var(--secondary-foreground)"
        rx={0}
      />
      <text fontWeight={600} x={6} y={y + 4} fill="var(--primary-foreground)">
        {compactCurrencyFormatter.format(value)}
      </text>
    </>
  );
};

function createRevenueBarTooltip(metricLabel: string) {
  return function RevenueBarTooltip({
    active,
    payload,
    label,
  }: TooltipContentProps<ValueType, NameType>) {
    if (!active || !payload?.length) return null;

    const value = payload[0]?.value ?? 0;

    return (
      <div className="border border-border bg-popover p-2 shadow-lg sm:p-3">
        <p className="mb-1.5 text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
          {label}
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="size-2 rounded-full bg-primary sm:size-2.5" />
          <span className="text-[10px] text-muted-foreground sm:text-sm">
            {metricLabel}:
          </span>
          <span className="text-[10px] font-medium text-foreground sm:text-sm">
            {currencyFormatter.format(Number(value))}
          </span>
        </div>
      </div>
    );
  };
}

const OccupancyChart = () => {
  const [metric, setMetric] = React.useState<SalesMetricKey>("netRevenue");
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined,
  );
  // Reset the hovered bar whenever the selected metric changes, without an
  // extra render pass: track the metric this activeIndex belongs to, and
  // clear it during render if it's stale (see "You Might Not Need an Effect").
  const [activeIndexMetric, setActiveIndexMetric] = React.useState(metric);
  if (activeIndexMetric !== metric) {
    setActiveIndexMetric(metric);
    if (activeIndex !== undefined) setActiveIndex(undefined);
  }
  const selectedMetric = salesMetricData[metric];
  const secondaryBarPatternId = React.useId();

  const maxValueData = React.useMemo(() => {
    const metricData = selectedMetric.data;
    if (activeIndex !== undefined) {
      return {
        index: activeIndex,
        value: metricData[activeIndex].value,
      };
    }
    return metricData.reduce(
      (max, data, index) =>
        data.value > max.value ? { index, value: data.value } : max,
      { index: 0, value: 0 },
    );
  }, [activeIndex, selectedMetric.data]);

  const isPositive = selectedMetric.changePercent >= 0;
  const valueSpring = useSpring(maxValueData.value, {
    stiffness: 100,
    damping: 20,
  });
  const [springyValue, setSpringyValue] = React.useState(maxValueData.value);

  useMotionValueEvent(valueSpring, "change", (latest) => {
    setSpringyValue(Number(latest.toFixed(0)));
  });

  React.useEffect(() => {
    valueSpring.set(maxValueData.value);
  }, [maxValueData.value, valueSpring]);

  const peakData = React.useMemo(
    () =>
      selectedMetric.data.reduce((peak, entry) =>
        entry.value > peak.value ? entry : peak,
      ),
    [selectedMetric.data],
  );
  const averageValue = React.useMemo(
    () =>
      Math.round(
        selectedMetric.data.reduce((sum, entry) => sum + entry.value, 0) /
          selectedMetric.data.length,
      ),
    [selectedMetric.data],
  );
  const ytdValue = React.useMemo(
    () => selectedMetric.data.reduce((sum, entry) => sum + entry.value, 0),
    [selectedMetric.data],
  );

  return (
    <div className="w-full rounded-xl border bg-card lg:flex lg:h-[470px] lg:flex-col">
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-pretty sm:text-base">
              {selectedMetric.label}
            </h2>
            <div className="flex items-end gap-3">
              <p className="text-xl leading-tight font-semibold text-foreground sm:text-2xl">
                {currencyFormatter.format(maxValueData.value)}
              </p>
              <div className="mb-0.5 flex shrink-0 items-center gap-1 text-xs whitespace-nowrap">
                {isPositive ? (
                  <ArrowUpRight
                    className="size-3 text-emerald-600"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownRight
                    className="size-3 text-red-600"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={isPositive ? "text-emerald-600" : "text-red-600"}
                >
                  {isPositive ? "+" : ""}
                  {selectedMetric.changePercent}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Select
              value={metric}
              onValueChange={(value) => setMetric(value as SalesMetricKey)}
            >
              <SelectTrigger className="h-9 w-[160px] rounded-lg text-[11px] sm:text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netRevenue">Net Revenue</SelectItem>
                <SelectItem value="roomRevenue">Room Revenue</SelectItem>
                <SelectItem value="platformRevenue">
                  Platform Revenue
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/35 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Peak Month</p>
            <p className="text-sm font-medium text-foreground">
              {peakData.month}{" "}
              <span className="text-muted-foreground">
                {compactCurrencyFormatter.format(peakData.value)}
              </span>
            </p>
          </div>
          <div className="rounded-lg bg-muted/35 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Monthly Avg</p>
            <p className="text-sm font-medium text-foreground">
              {compactCurrencyFormatter.format(averageValue)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/35 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">YTD Revenue</p>
            <p className="text-sm font-medium text-foreground">
              {compactCurrencyFormatter.format(ytdValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 pt-3 sm:p-5 sm:pt-4 lg:min-h-0 lg:flex-1">
        <div className="h-[260px] w-full min-w-0 sm:h-[300px] lg:h-full">
          <ChartContainer config={revenueChartConfig} className="h-full w-full">
            <BarChart
              data={selectedMetric.data}
              margin={{ top: 6, right: 12, left: 0, bottom: 0 }}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <defs>
                <pattern
                  id={secondaryBarPatternId}
                  patternUnits="userSpaceOnUse"
                  width={8}
                  height={8}
                  patternTransform="rotate(35)"
                >
                  <rect width={8} height={8} fill={palette.quaternary.light} />
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={8}
                    stroke={palette.tertiary.dark}
                    strokeWidth={2}
                    opacity={0.5}
                  />
                </pattern>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={10}
                interval={0}
              />
              <YAxis hide />
              <Tooltip
                content={createRevenueBarTooltip(selectedMetric.label)}
                cursor={{ fillOpacity: 0.05 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={30}>
                {selectedMetric.data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    className="duration-200"
                    opacity={index === maxValueData.index ? 1 : 0.9}
                    fill={
                      index === maxValueData.index
                        ? palette.primary
                        : `url(#${secondaryBarPatternId})`
                    }
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Bar>
              <ReferenceLine
                opacity={0.4}
                y={springyValue}
                stroke="var(--secondary-foreground)"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={<CustomReferenceLabel value={maxValueData.value} />}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Recent arrivals table
// ---------------------------------------------------------------------------

const arrivalsTableHeadClass =
  "h-9 whitespace-nowrap px-3 text-[11px] font-medium text-muted-foreground";

function parseCheckInTimeToMinutes(label: string) {
  const matched = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!matched) return Number.MAX_SAFE_INTEGER;

  const [, hourValue, minuteValue, period] = matched;
  const hour = Number(hourValue) % 12;
  const minute = Number(minuteValue);
  const isPm = period.toUpperCase() === "PM";
  return (isPm ? hour + 12 : hour) * 60 + minute;
}

const RecentArrivalsTableCard = () => {
  const arrivals = React.useMemo(
    () =>
      [...RECENT_ARRIVALS_TABLE].sort(
        (a, b) =>
          parseCheckInTimeToMinutes(a.time) - parseCheckInTimeToMinutes(b.time),
      ),
    [],
  );

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-pretty sm:text-base">
            Recent Arrivals
          </h2>
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {arrivals.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
          View all
        </Button>
      </div>

      <div className="mt-3 border-t">
        <ScrollArea className="h-[470px]">
          <div className="min-w-[940px]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/40">
                <TableRow className="border-b hover:bg-muted/40">
                  <TableHead className={cn(arrivalsTableHeadClass, "w-[76px]")}>
                    R. No
                  </TableHead>
                  <TableHead
                    className={cn(arrivalsTableHeadClass, "w-[230px]")}
                  >
                    Guest
                  </TableHead>
                  <TableHead
                    className={cn(arrivalsTableHeadClass, "w-[160px]")}
                  >
                    Room
                  </TableHead>
                  <TableHead
                    className={cn(arrivalsTableHeadClass, "w-[120px]")}
                  >
                    Check-in
                  </TableHead>
                  <TableHead className={cn(arrivalsTableHeadClass, "w-[80px]")}>
                    Nights
                  </TableHead>
                  <TableHead className={cn(arrivalsTableHeadClass, "w-[80px]")}>
                    Guests
                  </TableHead>
                  <TableHead
                    className={cn(arrivalsTableHeadClass, "w-[150px]")}
                  >
                    Source
                  </TableHead>
                  <TableHead
                    className={cn(arrivalsTableHeadClass, "w-[125px]")}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className={cn(arrivalsTableHeadClass, "w-[220px]")}
                  >
                    Special Requests
                  </TableHead>
                  <TableHead
                    className={cn(
                      arrivalsTableHeadClass,
                      "w-[72px] text-right",
                    )}
                  >
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arrivals.map((arrival, index) => {
                  const SourceIcon = SOURCE_ICONS[arrival.source] || Globe;
                  const leadGuest = arrival.guests[0];
                  return (
                    <TableRow
                      key={arrival.id}
                      className="h-12 hover:bg-muted/20"
                    >
                      <TableCell className="px-3 text-sm text-muted-foreground tabular-nums">
                        #{105 + index}
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarImage
                              src={leadGuest?.avatar}
                              alt={arrival.guestName}
                            />
                            <AvatarFallback className="text-[9px]">
                              {leadGuest?.initials ??
                                arrival.guestName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[170px] truncate text-sm font-medium text-foreground">
                            {arrival.guestName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 text-sm text-muted-foreground">
                        {arrival.roomType} {arrival.roomNumber}
                      </TableCell>
                      <TableCell className="px-3 text-sm text-muted-foreground">
                        {arrival.time.replace(" Check-in", "")}
                      </TableCell>
                      <TableCell className="px-3 text-sm text-muted-foreground tabular-nums">
                        {arrival.nights}
                      </TableCell>
                      <TableCell className="px-3 text-sm text-muted-foreground tabular-nums">
                        {arrival.guestCount}
                      </TableCell>
                      <TableCell className="px-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <SourceIcon className="size-3.5" aria-hidden="true" />
                          {arrival.source}
                        </span>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border-0 px-2 py-0 text-[11px] font-medium",
                            STATUS_STYLES[arrival.statusColor] ||
                              STATUS_STYLES.violet,
                          )}
                        >
                          {arrival.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[220px] px-3 text-sm text-muted-foreground">
                        <span
                          className="block truncate"
                          title={
                            arrival.specialRequests?.trim() ||
                            "No special requests"
                          }
                        >
                          {arrival.specialRequests?.trim() ||
                            "No special requests"}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={`More actions for ${arrival.guestName}`}
                        >
                          <MoreHorizontal
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Latest updates panel
// ---------------------------------------------------------------------------

const LatestUpdatesPanel = () => {
  const [query, setQuery] = React.useState("");

  const filterBookings = React.useCallback(
    (bookings: Booking[]) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) return bookings;
      return bookings.filter((booking) =>
        [
          booking.guestName,
          booking.roomType,
          booking.roomNumber,
          booking.source,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    },
    [query],
  );

  const filteredArrivals = React.useMemo(
    () => filterBookings(ARRIVALS),
    [filterBookings],
  );
  const filteredInHouse = React.useMemo(
    () => filterBookings(IN_HOUSE),
    [filterBookings],
  );
  const filteredDepartures = React.useMemo(
    () => filterBookings(DEPARTURES),
    [filterBookings],
  );
  const groupedBookings = React.useMemo(
    () => [
      {
        key: "arrivals",
        label: "Arrivals",
        icon: DoorOpen,
        count: filteredArrivals.length,
        bookings: filteredArrivals,
      },
      {
        key: "in-house",
        label: "In-House",
        icon: BedDouble,
        count: filteredInHouse.length,
        bookings: filteredInHouse,
      },
      {
        key: "departures",
        label: "Departures",
        icon: KeyRound,
        count: filteredDepartures.length,
        bookings: filteredDepartures,
      },
    ],
    [filteredArrivals, filteredInHouse, filteredDepartures],
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-pretty sm:text-base">
          Latest Updates
        </h2>
        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
          Last week
        </Button>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-0">
        <div className="mt-3 flex items-center gap-2 rounded-md border bg-background px-2.5 py-2">
          <Search
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guest, room, or source"
            className="h-4 w-full border-none bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search bookings"
          />
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-5 pr-1">
              {groupedBookings.map((group) => (
                <section key={group.key} className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border/70 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-md bg-muted text-foreground">
                        <group.icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-[11px] font-semibold tracking-[0.08em] text-foreground/90 uppercase">
                        {group.label}
                      </span>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground tabular-nums">
                      {group.count}
                    </span>
                  </div>
                  <BookingList bookings={group.bookings} />
                </section>
              ))}
              {groupedBookings.every(
                (group) => group.bookings.length === 0,
              ) && (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
                  No bookings found for this search.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Dashboard content — the widgets that live inside the layout shell
// ---------------------------------------------------------------------------

const Dashboard16Content = ({ userName }: { userName?: string }) => {
  const topLeftStackRef = React.useRef<HTMLDivElement>(null);
  const [topRowHeight, setTopRowHeight] = React.useState<number | null>(null);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    const element = topLeftStackRef.current;
    if (!element) return;

    const updateHeight = () => setTopRowHeight(element.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader
        section="Dashboard"
        userName={userName}
        // action={
        //   <Button className="h-9 gap-1.5 px-3 text-sm">
        //     <Plus className="size-3.5" aria-hidden="true" />
        //     New Reservation
        //   </Button>
        // }
      />
      {/* <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <div
          ref={topLeftStackRef}
          className="flex min-h-0 flex-col gap-4 sm:gap-6 lg:self-start"
        >
          <HotelStatsCards />
          <OccupancyChart />
        </div>
        <div
          className="min-h-0 lg:self-start"
          style={
            isDesktop && topRowHeight ? { height: topRowHeight } : undefined
          }
        >
          <LatestUpdatesPanel />
        </div>
      </div> */}
      {/* <RecentArrivalsTableCard /> */}
    </div>
  );
};

export { Dashboard16Content };
