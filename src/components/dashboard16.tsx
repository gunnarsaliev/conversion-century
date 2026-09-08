"use client";

import { useMotionValueEvent, useSpring } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BedDouble,
  Bell,
  Box,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  ConciergeBell,
  CreditCard,
  DoorOpen,
  Download,
  Globe,
  HelpCircle,
  KeyRound,
  Lamp,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Monitor,
  Package,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
} from "lucide-react";
import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Schedule types
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

type DateCell = {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
};

// ---------------------------------------------------------------------------
// Schedule mock data
// ---------------------------------------------------------------------------

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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ---------------------------------------------------------------------------
// Schedule helpers
// ---------------------------------------------------------------------------

function generateMonthGrid(
  year: number,
  month: number,
  selectedDate: number,
): DateCell[] {
  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: DateCell[] = [];
  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDayOfMonth + 1;

    let cellDate = dayNumber;
    let cellMonth = month;
    let cellYear = year;
    let isCurrentMonth = true;

    if (dayNumber <= 0) {
      cellDate = prevMonthDays + dayNumber;
      cellMonth = month === 0 ? 11 : month - 1;
      cellYear = month === 0 ? year - 1 : year;
      isCurrentMonth = false;
    } else if (dayNumber > daysInMonth) {
      cellDate = dayNumber - daysInMonth;
      cellMonth = month === 11 ? 0 : month + 1;
      cellYear = month === 11 ? year + 1 : year;
      isCurrentMonth = false;
    }

    cells.push({
      date: cellDate,
      month: cellMonth,
      year: cellYear,
      isCurrentMonth,
      isSelected: isCurrentMonth && cellDate === selectedDate,
      isToday:
        cellDate === today.getDate() &&
        cellMonth === today.getMonth() &&
        cellYear === today.getFullYear(),
    });
  }

  return cells;
}

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
// Schedule sub-components
// ---------------------------------------------------------------------------

function MonthNavigation({
  month,
  year,
  onPrev,
  onNext,
}: {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-center rounded-xl bg-muted/60 px-2 py-2">
        <button
          onClick={onPrev}
          aria-label="Previous month"
          className="flex size-6 items-center justify-center rounded-md border border-border/80 bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <span className="flex-1 text-center text-sm font-medium text-foreground/85">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          onClick={onNext}
          aria-label="Next month"
          className="flex size-6 items-center justify-center rounded-md border border-border/80 bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function MiniMonthCalendar({
  cells,
  onSelect,
}: {
  cells: DateCell[];
  onSelect: (cell: DateCell) => void;
}) {
  return (
    <div className="px-4 pb-4">
      <div className="space-y-2">
        <div className="grid grid-cols-7 text-center text-[10px] font-medium text-muted-foreground">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="py-1">
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => (
            <button
              key={`${cell.year}-${cell.month}-${cell.date}`}
              type="button"
              onClick={() => onSelect(cell)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-md text-xs font-medium transition-colors",
                cell.isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                !cell.isSelected &&
                  cell.isCurrentMonth &&
                  "text-foreground hover:bg-muted",
                !cell.isSelected &&
                  !cell.isCurrentMonth &&
                  "text-muted-foreground/50 hover:bg-muted/60",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full",
                  cell.isToday &&
                    !cell.isSelected &&
                    "text-primary ring-1 ring-primary/40",
                )}
              >
                {cell.date}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
// Schedule panel (card-less variant for activity sidebar)
// ---------------------------------------------------------------------------

function SchedulePanel() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = React.useState(today.getDate());

  const calendarCells = React.useMemo(
    () => generateMonthGrid(currentYear, currentMonth, selectedDate),
    [currentYear, currentMonth, selectedDate],
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(1);
  };

  const handleDateSelect = (cell: DateCell) => {
    if (cell.month !== currentMonth || cell.year !== currentYear) {
      setCurrentMonth(cell.month);
      setCurrentYear(cell.year);
    }
    setSelectedDate(cell.date);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 pt-4">
        <MonthNavigation
          month={currentMonth}
          year={currentYear}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />
        <MiniMonthCalendar cells={calendarCells} onSelect={handleDateSelect} />
      </div>

      <div className="min-h-0 flex-1 px-4 pb-4">
        <Tabs defaultValue="arrivals" className="flex h-full flex-col">
          <TabsList className="mb-4 w-full shrink-0">
            <TabsTrigger value="arrivals" className="flex-1 gap-1.5">
              <DoorOpen className="size-3.5" />
              Arrivals
            </TabsTrigger>
            <TabsTrigger value="in-house" className="flex-1 gap-1.5">
              <BedDouble className="size-3.5" />
              In-House
            </TabsTrigger>
            <TabsTrigger value="departures" className="flex-1 gap-1.5">
              <KeyRound className="size-3.5" />
              Departures
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="min-h-0 flex-1">
            <TabsContent value="arrivals" className="mt-0">
              <BookingList bookings={ARRIVALS} />
            </TabsContent>
            <TabsContent value="in-house" className="mt-0">
              <BookingList bookings={IN_HOUSE} />
            </TabsContent>
            <TabsContent value="departures" className="mt-0">
              <BookingList bookings={DEPARTURES} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard16 types & data
// ---------------------------------------------------------------------------

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

type UserData = {
  name: string;
  email: string;
  avatar: string;
};

type SidebarData = {
  logo: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  navGroups: NavGroup[];
  footerGroup: NavGroup;
  user?: UserData;
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

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: OrderStatus;
};

type FulfillmentItem = {
  order: string;
  shipped: Date;
  progress: number;
  segments: number[];
};

type ActivityPeriod = "today" | "yesterday" | "week";
type ActivityTone = "indigo" | "emerald" | "violet" | "amber";

type UpdateActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  period: ActivityPeriod;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: ActivityTone;
};

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
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
const dashboardRangeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const dashboardRangeStart = new Date(2025, 0, 1);
const dashboardRangeEnd = new Date(2025, 0, 31);
const dashboardDateRangeLabel =
  typeof dashboardRangeFormatter.formatRange === "function"
    ? dashboardRangeFormatter.formatRange(
        dashboardRangeStart,
        dashboardRangeEnd,
      )
    : `${dashboardRangeFormatter.format(
        dashboardRangeStart,
      )} – ${dashboardRangeFormatter.format(dashboardRangeEnd)}`;

const shippedDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
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

const sidebarData: SidebarData = {
  logo: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg",
    alt: "Grandview",
    title: "Grandview",
    description: "Hospitality Suite",
  },
  navGroups: [
    {
      title: "Front Office",
      defaultOpen: true,
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "#",
          isActive: true,
        },
        { label: "Reservations", icon: CalendarRange, href: "#" },
        { label: "Check-in / Check-out", icon: DoorOpen, href: "#" },
        {
          label: "Guest Profiles",
          icon: Users,
          href: "#",
          children: [
            { label: "All Guests", icon: Users, href: "#" },
            { label: "Loyalty Members", icon: Users, href: "#" },
            { label: "Corporate Accounts", icon: Users, href: "#" },
          ],
        },
      ],
    },
    {
      title: "Property",
      defaultOpen: true,
      items: [
        {
          label: "Rooms & Suites",
          icon: BedDouble,
          href: "#",
          children: [
            { label: "Floor Plan", icon: BedDouble, href: "#" },
            { label: "Room Types", icon: BedDouble, href: "#" },
            { label: "Availability", icon: BedDouble, href: "#" },
          ],
        },
        { label: "Housekeeping", icon: Sparkles, href: "#" },
        { label: "Dining & Events", icon: UtensilsCrossed, href: "#" },
      ],
    },
    {
      title: "Revenue",
      defaultOpen: false,
      items: [
        { label: "Rate Manager", icon: CreditCard, href: "#" },
        { label: "Billing & Invoices", icon: Wallet, href: "#" },
        { label: "Channel Distribution", icon: Globe, href: "#" },
      ],
    },
    {
      title: "Administration",
      defaultOpen: false,
      items: [
        { label: "Staff & Roles", icon: ShieldCheck, href: "#" },
        { label: "Maintenance Logs", icon: Wrench, href: "#" },
        { label: "Security & Access", icon: KeyRound, href: "#" },
      ],
    },
  ],
  footerGroup: {
    title: "Settings",
    items: [{ label: "Settings", icon: Settings, href: "#" }],
  },
  user: {
    name: "Robert Austin",
    email: "robert@grandview.hotel",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar22.jpg",
  },
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

const monthLabel = (monthIndex: number) =>
  monthFormatter.format(new Date(2025, monthIndex, 1));

const salesPipelineData: Record<
  string,
  { week: string; month: string; orders: number; sales: number }[]
> = {
  q1: [
    { week: "W1", month: monthLabel(0), orders: 220, sales: 5100 },
    { week: "W2", month: monthLabel(0), orders: 480, sales: 11200 },
    { week: "W3", month: monthLabel(0), orders: 390, sales: 9400 },
    { week: "W4", month: monthLabel(0), orders: 150, sales: 3600 },
    { week: "W5", month: monthLabel(1), orders: 310, sales: 7400 },
    { week: "W6", month: monthLabel(1), orders: 540, sales: 13100 },
    { week: "W7", month: monthLabel(1), orders: 460, sales: 10800 },
    { week: "W8", month: monthLabel(1), orders: 200, sales: 4700 },
    { week: "W9", month: monthLabel(2), orders: 130, sales: 3100 },
    { week: "W10", month: monthLabel(2), orders: 420, sales: 10200 },
    { week: "W11", month: monthLabel(2), orders: 510, sales: 12400 },
    { week: "W12", month: monthLabel(2), orders: 350, sales: 8500 },
  ],
  q2: [
    { week: "W1", month: monthLabel(3), orders: 410, sales: 9800 },
    { week: "W2", month: monthLabel(3), orders: 280, sales: 6700 },
    { week: "W3", month: monthLabel(3), orders: 120, sales: 2900 },
    { week: "W4", month: monthLabel(3), orders: 350, sales: 8400 },
    { week: "W5", month: monthLabel(4), orders: 520, sales: 12600 },
    { week: "W6", month: monthLabel(4), orders: 470, sales: 11300 },
    { week: "W7", month: monthLabel(4), orders: 190, sales: 4500 },
    { week: "W8", month: monthLabel(4), orders: 100, sales: 2400 },
    { week: "W9", month: monthLabel(5), orders: 330, sales: 7900 },
    { week: "W10", month: monthLabel(5), orders: 490, sales: 11800 },
    { week: "W11", month: monthLabel(5), orders: 540, sales: 13000 },
    { week: "W12", month: monthLabel(5), orders: 260, sales: 6200 },
  ],
  q3: [
    { week: "W1", month: monthLabel(6), orders: 180, sales: 4200 },
    { week: "W2", month: monthLabel(6), orders: 520, sales: 12800 },
    { week: "W3", month: monthLabel(6), orders: 480, sales: 11500 },
    { week: "W4", month: monthLabel(6), orders: 120, sales: 2800 },
    { week: "W5", month: monthLabel(7), orders: 90, sales: 2100 },
    { week: "W6", month: monthLabel(7), orders: 450, sales: 10500 },
    { week: "W7", month: monthLabel(7), orders: 510, sales: 12200 },
    { week: "W8", month: monthLabel(7), orders: 480, sales: 11000 },
    { week: "W9", month: monthLabel(8), orders: 200, sales: 4800 },
    { week: "W10", month: monthLabel(8), orders: 150, sales: 3500 },
    { week: "W11", month: monthLabel(8), orders: 380, sales: 9200 },
    { week: "W12", month: monthLabel(8), orders: 420, sales: 10100 },
  ],
  q4: [
    { week: "W1", month: monthLabel(9), orders: 300, sales: 7200 },
    { week: "W2", month: monthLabel(9), orders: 160, sales: 3800 },
    { week: "W3", month: monthLabel(9), orders: 440, sales: 10600 },
    { week: "W4", month: monthLabel(9), orders: 530, sales: 12900 },
    { week: "W5", month: monthLabel(10), orders: 380, sales: 9100 },
    { week: "W6", month: monthLabel(10), orders: 140, sales: 3400 },
    { week: "W7", month: monthLabel(10), orders: 250, sales: 6000 },
    { week: "W8", month: monthLabel(10), orders: 500, sales: 12100 },
    { week: "W9", month: monthLabel(11), orders: 550, sales: 13300 },
    { week: "W10", month: monthLabel(11), orders: 470, sales: 11400 },
    { week: "W11", month: monthLabel(11), orders: 210, sales: 5000 },
    { week: "W12", month: monthLabel(11), orders: 340, sales: 8200 },
  ],
};

const fullYearData = [
  { monthIndex: 0, thisYear: 42000, prevYear: 38000 },
  { monthIndex: 1, thisYear: 38000, prevYear: 45000 },
  { monthIndex: 2, thisYear: 52000, prevYear: 41000 },
  { monthIndex: 3, thisYear: 45000, prevYear: 48000 },
  { monthIndex: 4, thisYear: 58000, prevYear: 44000 },
  { monthIndex: 5, thisYear: 41000, prevYear: 52000 },
  { monthIndex: 6, thisYear: 55000, prevYear: 47000 },
  { monthIndex: 7, thisYear: 48000, prevYear: 53000 },
  { monthIndex: 8, thisYear: 62000, prevYear: 49000 },
  { monthIndex: 9, thisYear: 54000, prevYear: 58000 },
  { monthIndex: 10, thisYear: 67000, prevYear: 52000 },
  { monthIndex: 11, thisYear: 71000, prevYear: 61000 },
].map(({ monthIndex, ...entry }) => ({
  month: monthLabel(monthIndex),
  ...entry,
}));

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

type TimePeriod = "6months" | "year";

const activityPeriodLabels: Record<ActivityPeriod, string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This week",
};

const activityToneClasses: Record<ActivityTone, string> = {
  indigo: "border-indigo-200/60 bg-indigo-50/60 text-indigo-600",
  emerald: "border-emerald-200/60 bg-emerald-50/60 text-emerald-600",
  violet: "border-violet-200/60 bg-violet-50/60 text-violet-600",
  amber: "border-amber-200/60 bg-amber-50/60 text-amber-600",
};

const latestUpdates: UpdateActivity[] = [
  {
    id: "act-1",
    title: "Ticket Updated",
    description: "Ticket #2319 SLA updated",
    time: "11:20 AM",
    period: "today",
    icon: ClipboardList,
    tone: "indigo",
  },
  {
    id: "act-2",
    title: "New Client Added",
    description: "PT. Alpha Indonesia registered",
    time: "11:15 AM",
    period: "today",
    icon: User,
    tone: "emerald",
  },
  {
    id: "act-3",
    title: "Agent Reassigned",
    description: "Ticket #2322 moved to Michael Wong",
    time: "11:00 AM",
    period: "today",
    icon: ConciergeBell,
    tone: "violet",
  },
  {
    id: "act-4",
    title: "SLA Breach Risk",
    description: 'Ticket #2320 "Login issue"',
    time: "10:45 AM",
    period: "today",
    icon: Bell,
    tone: "amber",
  },
  {
    id: "act-5",
    title: "Knowledge Base",
    description: "New article published",
    time: "10:30 AM",
    period: "today",
    icon: Box,
    tone: "indigo",
  },
  {
    id: "act-6",
    title: "Customer Feedback",
    description: "Great support response from front desk",
    time: "10:10 AM",
    period: "today",
    icon: Star,
    tone: "amber",
  },
  {
    id: "act-7",
    title: "Late Arrival Alert",
    description: "Airport transfer delayed by 20 mins",
    time: "8:45 PM",
    period: "yesterday",
    icon: Truck,
    tone: "indigo",
  },
  {
    id: "act-8",
    title: "Suite Upgrade Accepted",
    description: "Room 412 moved to Presidential Suite",
    time: "7:30 PM",
    period: "yesterday",
    icon: Sparkles,
    tone: "emerald",
  },
  {
    id: "act-9",
    title: "Group Booking Confirmed",
    description: "Corporate group check-in for Friday",
    time: "Mon",
    period: "week",
    icon: Users,
    tone: "violet",
  },
  {
    id: "act-10",
    title: "Maintenance Completed",
    description: "HVAC issue resolved in Room 205",
    time: "Sun",
    period: "week",
    icon: Wrench,
    tone: "emerald",
  },
];

const periodLabels: Record<TimePeriod, string> = {
  "6months": "Last 6 Months",
  year: "Last Year",
};

function getDataForPeriod(period: TimePeriod) {
  if (period === "6months") {
    return fullYearData.slice(0, 6);
  }
  return fullYearData;
}

const orderStatuses: OrderStatus[] = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  Processing:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-400/20",
  Shipped:
    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20",
  Delivered:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-400/20",
  Cancelled:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20",
};

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: "Sarah Johnson",
    status: "Delivered",
    total: 2499.0,
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: "Michael Chen",
    status: "Shipped",
    total: 1348.0,
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: "Emma Wilson",
    status: "Processing",
    total: 1198.0,
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customer: "James Rodriguez",
    status: "Delivered",
    total: 799.0,
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customer: "Lisa Park",
    status: "Cancelled",
    total: 599.0,
  },
  {
    id: "6",
    orderNumber: "ORD-2024-006",
    customer: "David Kim",
    status: "Shipped",
    total: 5498.0,
  },
  {
    id: "7",
    orderNumber: "ORD-2024-007",
    customer: "Anna Martinez",
    status: "Delivered",
    total: 1199.0,
  },
  {
    id: "8",
    orderNumber: "ORD-2024-008",
    customer: "Robert Taylor",
    status: "Processing",
    total: 1128.0,
  },
  {
    id: "9",
    orderNumber: "ORD-2024-009",
    customer: "Jennifer Lee",
    status: "Shipped",
    total: 449.0,
  },
  {
    id: "10",
    orderNumber: "ORD-2024-010",
    customer: "William Brown",
    status: "Delivered",
    total: 2199.0,
  },
  {
    id: "11",
    orderNumber: "ORD-2024-011",
    customer: "Sophia Davis",
    status: "Cancelled",
    total: 349.0,
  },
  {
    id: "12",
    orderNumber: "ORD-2024-012",
    customer: "Daniel Garcia",
    status: "Processing",
    total: 899.0,
  },
];

const fulfillmentData: FulfillmentItem[] = [
  {
    order: "ORD-4821",
    shipped: new Date(2025, 0, 27),
    progress: 92,
    segments: [
      0.9, 0.7, 1.0, 0.8, 0.6, 0.9, 1.0, 0.7, 0.5, 0.8, 0.9, 1.0, 0.6, 0.7, 0.8,
      0.9, 1.0, 0.5, 0.7, 0.8, 0.9, 0.6, 1.0, 0.8, 0.7, 0.3, 0.2, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4819",
    shipped: new Date(2025, 0, 26),
    progress: 78,
    segments: [
      0.8, 0.6, 0.9, 0.7, 1.0, 0.5, 0.8, 0.9, 0.6, 0.7, 1.0, 0.8, 0.5, 0.9, 0.7,
      0.6, 0.8, 1.0, 0.7, 0.5, 0.2, 0.1, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
      0.1,
    ],
  },
  {
    order: "ORD-4815",
    shipped: new Date(2025, 0, 25),
    progress: 100,
    segments: [
      1.0, 0.9, 0.8, 1.0, 0.7, 0.9, 1.0, 0.8, 0.6, 0.9, 1.0, 0.7, 0.8, 0.9, 1.0,
      0.6, 0.8, 0.9, 1.0, 0.7, 0.9, 0.8, 1.0, 0.6, 0.9, 0.7, 1.0, 0.8, 0.9, 1.0,
    ],
  },
  {
    order: "ORD-4812",
    shipped: new Date(2025, 0, 24),
    progress: 65,
    segments: [
      0.9, 1.0, 0.7, 0.8, 0.6, 0.9, 0.5, 0.8, 1.0, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7,
      1.0, 0.6, 0.9, 0.8, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4808",
    shipped: new Date(2025, 0, 23),
    progress: 43,
    segments: [
      0.8, 0.7, 1.0, 0.6, 0.9, 0.8, 0.5, 0.7, 1.0, 0.9, 0.6, 0.8, 0.7, 0.1, 0.1,
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4805",
    shipped: new Date(2025, 0, 22),
    progress: 100,
    segments: [
      0.9, 0.8, 1.0, 0.7, 0.9, 0.6, 1.0, 0.8, 0.7, 0.9, 1.0, 0.8, 0.6, 0.9, 0.7,
      1.0, 0.8, 0.9, 0.7, 1.0, 0.8, 0.9, 0.6, 1.0, 0.7, 0.8, 0.9, 1.0, 0.8, 0.9,
    ],
  },
  {
    order: "ORD-4801",
    shipped: new Date(2025, 0, 21),
    progress: 88,
    segments: [
      1.0, 0.8, 0.7, 0.9, 0.6, 1.0, 0.8, 0.5, 0.9, 0.7, 1.0, 0.8, 0.6, 0.9, 0.7,
      0.8, 1.0, 0.6, 0.5, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4798",
    shipped: new Date(2025, 0, 20),
    progress: 55,
    segments: [
      0.7, 0.9, 1.0, 0.6, 0.8, 0.9, 0.7, 1.0, 0.5, 0.8, 0.6, 0.9, 0.1, 0.1, 0.1,
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4794",
    shipped: new Date(2025, 0, 19),
    progress: 100,
    segments: [
      0.8, 1.0, 0.9, 0.7, 0.8, 1.0, 0.6, 0.9, 0.8, 1.0, 0.7, 0.9, 0.8, 1.0, 0.6,
      0.9, 0.7, 1.0, 0.8, 0.9, 0.7, 1.0, 0.8, 0.6, 0.9, 1.0, 0.7, 0.8, 0.9, 1.0,
    ],
  },
  {
    order: "ORD-4790",
    shipped: new Date(2025, 0, 18),
    progress: 71,
    segments: [
      0.9, 0.6, 0.8, 1.0, 0.7, 0.9, 0.5, 0.8, 1.0, 0.6, 0.9, 0.7, 0.8, 0.5, 0.3,
      0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4786",
    shipped: new Date(2025, 0, 17),
    progress: 35,
    segments: [
      1.0, 0.8, 0.9, 0.7, 0.6, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ],
  },
  {
    order: "ORD-4782",
    shipped: new Date(2025, 0, 16),
    progress: 96,
    segments: [
      0.8, 0.9, 1.0, 0.7, 0.8, 0.9, 1.0, 0.6, 0.8, 0.9, 1.0, 0.7, 0.9, 0.8, 1.0,
      0.6, 0.9, 0.7, 1.0, 0.8, 0.9, 0.6, 1.0, 0.8, 0.7, 0.9, 1.0, 0.8, 0.3, 0.1,
    ],
  },
];

const ordersBarConfig = {
  orders: { label: "Orders", color: palette.primary },
} satisfies ChartConfig;

const salesBarConfig = {
  sales: { label: "Sales", theme: palette.secondary },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: palette.secondary.light,
  },
} satisfies ChartConfig;

const createHighlightBarShape = (fill: string) => (props: unknown) => {
  const { x, y, width, height, index } = props as {
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
  };
  const isHighlight = index === 5;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      opacity={isHighlight ? 1 : 0.45}
      rx={4}
      ry={4}
    />
  );
};

const revenueFlowChartConfig = {
  thisYear: { label: "This Year", color: palette.primary },
  prevYear: { label: "Previous Year", theme: palette.secondary },
} satisfies ChartConfig;

const tableHeadClass = "text-xs font-medium text-muted-foreground sm:text-sm";

const SidebarLogo = ({ logo }: { logo: SidebarData["logo"] }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" tooltip={logo.title}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">
            <img
              src={logo.src}
              alt={logo.alt}
              width={24}
              height={24}
              className="size-6 text-primary-foreground invert dark:invert-0"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">{logo.title}</span>
            <span className="text-xs text-muted-foreground">
              {logo.description}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={item.isActive} tooltip={item.label} render={<a href={item.href} />}><Icon className="size-4" aria-hidden="true" /><span>{item.label}</span></SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}><CollapsibleTrigger render={<SidebarMenuButton isActive={item.isActive} tooltip={item.label} />}><Icon className="size-4" aria-hidden="true" /><span>{item.label}</span><ChevronRight
                                  className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                  aria-hidden="true"
                                /></CollapsibleTrigger><CollapsibleContent>
                <SidebarMenuSub>
                  {item.children!.map((child) => (
                    <SidebarMenuSubItem key={child.label}>
                      <SidebarMenuSubButton isActive={child.isActive} render={<a href={child.href} />}>{child.label}</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent></Collapsible>
  );
};

const NavUser = ({ user }: { user: UserData }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" />}><Avatar className="size-8 rounded-lg">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="rounded-lg">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar><div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-medium">{user.name}</span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div><ChevronsUpDown className="ml-auto size-4" aria-hidden="true" /></DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 size-4" aria-hidden="true" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 size-4" aria-hidden="true" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col">
          <SidebarLogo logo={sidebarData.logo} />
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:ml-0" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          {sidebarData.navGroups.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <NavMenuItem key={item.label} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {sidebarData.user && <NavUser user={sidebarData.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const DashboardIntro = () => {
  const userName = sidebarData.user?.name ?? "Robert Austin";
  const firstName = userName.trim().split(/\s+/)[0] || "Robert";

  return (
    <section className="pb-4 sm:pb-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>Overview</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Search"
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Notifications"
          >
            <Bell className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            aria-label="Last 7 days"
          >
            Last 7 days
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            aria-label="Date range"
          >
            <CalendarRange className="size-3.5" aria-hidden="true" />
            Feb 04 - Feb 11, 2024
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Hello, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is today&apos;s snapshot of arrivals, revenue, and operations.
          </p>
        </div>
        <Button className="h-9 gap-1.5 px-3 text-sm">
          <Plus className="size-3.5" aria-hidden="true" />
          New Reservation
        </Button>
      </div>
    </section>
  );
};

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

function RevenueBarTooltip({
  active,
  payload,
  label,
  metricLabel,
}: TooltipProps<number, string> & { metricLabel: string }) {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value || 0;

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
}

const OccupancyChart = () => {
  const [metric, setMetric] = React.useState<SalesMetricKey>("netRevenue");
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined,
  );
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

  React.useEffect(() => {
    setActiveIndex(undefined);
  }, [metric]);

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
                content={
                  <RevenueBarTooltip metricLabel={selectedMetric.label} />
                }
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

function PipelineTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: TooltipProps<number, string> & {
  valueFormatter: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {valueFormatter(Number(entry.value))}
      </p>
    </div>
  );
}

const SalesPipelineChart = () => {
  const [searchParams, setSearchParams] = React.useState(
    () =>
      new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      ),
  );

  const quarter = searchParams.get("quarter") ?? "q1";

  const handleQuarterChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("quarter", value);
    setSearchParams(next);
    window.history.replaceState(null, "", `?${next.toString()}`);
  };

  const data = salesPipelineData[quarter] ?? salesPipelineData.q1;
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-xl border bg-card">
      <div className="flex h-14 items-center justify-between border-b px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            className="size-7 sm:size-8"
            aria-label="Sales Pipeline"
          >
            <BarChart3
              className="size-4 text-muted-foreground sm:size-[18px]"
              aria-hidden="true"
            />
          </Button>
          <h2 className="text-sm font-medium text-pretty sm:text-base">
            Sales Pipeline
          </h2>
        </div>

        <Select value={quarter} onValueChange={handleQuarterChange}>
          <SelectTrigger
            className="h-7 w-[120px] text-xs"
            aria-label="Select quarter"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="q1">Quarter 1</SelectItem>
            <SelectItem value="q2">Quarter 2</SelectItem>
            <SelectItem value="q3">Quarter 3</SelectItem>
            <SelectItem value="q4">Quarter 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto_1fr] sm:p-5">
        <div className="flex min-h-0 min-w-0 flex-col gap-3 overflow-hidden">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              {numberFormatter.format(totalOrders)}
            </p>
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Total Orders
            </p>
          </div>
          <div className="min-h-0 w-full min-w-0 flex-1">
            <ChartContainer config={ordersBarConfig} className="h-full w-full">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  dx={-5}
                  width={40}
                />
                <Tooltip
                  cursor={{ fillOpacity: 0.05 }}
                  content={
                    <PipelineTooltip
                      valueFormatter={(v) => numberFormatter.format(v)}
                    />
                  }
                />
                <Bar
                  dataKey="orders"
                  radius={[4, 4, 0, 0]}
                  fill="var(--color-orders)"
                  shape={createHighlightBarShape("var(--color-orders)")}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-border sm:block" />

        <div className="flex min-h-0 min-w-0 flex-col gap-3 overflow-hidden">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              {compactCurrencyFormatter.format(totalSales)}
            </p>
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Total Sales
            </p>
          </div>
          <div className="min-h-0 w-full min-w-0 flex-1">
            <ChartContainer config={salesBarConfig} className="h-full w-full">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  dx={-5}
                  width={40}
                />
                <Tooltip
                  cursor={{ fillOpacity: 0.05 }}
                  content={
                    <PipelineTooltip
                      valueFormatter={(v) => currencyFormatter.format(v)}
                    />
                  }
                />
                <Bar
                  dataKey="sales"
                  radius={[4, 4, 0, 0]}
                  fill="var(--color-sales)"
                  shape={createHighlightBarShape("var(--color-sales)")}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function CustomTooltip({
  active,
  payload,
  label,
  colors,
}: TooltipProps<number, string> & {
  colors: { primary: string; secondary: string };
}) {
  if (!active || !payload?.length) return null;

  const thisYear = payload.find((p) => p.dataKey === "thisYear")?.value || 0;
  const prevYear = payload.find((p) => p.dataKey === "prevYear")?.value || 0;
  const diff = Number(thisYear) - Number(prevYear);
  const percentage = prevYear ? Math.round((diff / Number(prevYear)) * 100) : 0;
  const currentYear = new Date().getFullYear();

  return (
    <div className="rounded-lg border border-border bg-popover p-2 shadow-lg sm:p-3">
      <p className="mb-1.5 text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
        {label}, {currentYear}
      </p>
      <div className="space-y-1 sm:space-y-1.5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className="size-2 rounded-full sm:size-2.5"
            style={{ backgroundColor: colors.primary }}
          />
          <span className="text-[10px] text-muted-foreground sm:text-sm">
            This Year:
          </span>
          <span className="text-[10px] font-medium text-foreground sm:text-sm">
            {currencyFormatter.format(Number(thisYear))}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className="size-2 rounded-full sm:size-2.5"
            style={{ backgroundColor: colors.secondary }}
          />
          <span className="text-[10px] text-muted-foreground sm:text-sm">
            Prev Year:
          </span>
          <span className="text-[10px] font-medium text-foreground sm:text-sm">
            {currencyFormatter.format(Number(prevYear))}
          </span>
        </div>
        <div className="mt-1 border-t border-border pt-1">
          <span
            className={cn(
              "text-[10px] font-medium sm:text-xs",
              diff >= 0 ? "text-emerald-500" : "text-red-500",
            )}
          >
            {diff >= 0 ? "+" : ""}
            {percentage}% vs last year
          </span>
        </div>
      </div>
    </div>
  );
}

const RevenueFlowChart = () => {
  const [period, setPeriod] = React.useState<TimePeriod>("year");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const nextPeriod = params.get("period");
    if (nextPeriod === "6months" || nextPeriod === "year") {
      setPeriod(nextPeriod);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (period !== "year") {
      params.set("period", period);
    } else {
      params.delete("period");
    }
    const nextQuery = params.toString();
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [period]);

  const chartData = getDataForPeriod(period);
  const totalRevenue = chartData.reduce((acc, item) => acc + item.thisYear, 0);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border bg-card p-4 sm:gap-6 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xl leading-tight font-semibold tracking-tight sm:text-2xl">
            {currencyFormatter.format(totalRevenue)}
          </p>
          <p className="text-xs text-muted-foreground">
            Total Revenue ({periodLabels[period]})
          </p>
        </div>
        <div className="hidden items-center gap-3 sm:flex sm:gap-5">
          <div className="flex items-center gap-1.5">
            <div
              className="size-2.5 rounded-full sm:size-3"
              style={{ backgroundColor: palette.primary }}
            />
            <span className="text-[10px] text-muted-foreground sm:text-xs">
              This Year
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="size-2.5 rounded-full sm:size-3"
              style={{ backgroundColor: palette.secondary.light }}
            />
            <span className="text-[10px] text-muted-foreground sm:text-xs">
              Prev Year
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 sm:size-8" aria-label="Select time period" />}><MoreHorizontal className="size-4" aria-hidden="true" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Time Period</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(periodLabels) as TimePeriod[]).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={period === key}
                onCheckedChange={() => setPeriod(key)}
              >
                {periodLabels[key]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-[200px] w-full min-w-0 sm:h-[240px] lg:h-[280px]">
        <ChartContainer
          config={revenueFlowChartConfig}
          className="h-full w-full"
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              dx={-5}
              tickFormatter={(value) => compactCurrencyFormatter.format(value)}
              width={40}
            />
            <Tooltip
              content={
                <CustomTooltip
                  colors={{
                    primary: "var(--color-thisYear)",
                    secondary: "var(--color-prevYear)",
                  }}
                />
              }
              cursor={{ strokeOpacity: 0.2 }}
            />
            <Line
              type="linear"
              dataKey="thisYear"
              stroke="var(--color-thisYear)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{ fill: "var(--color-thisYear)", strokeWidth: 0, r: 2 }}
              activeDot={{ r: 3.5, fill: "var(--color-thisYear)" }}
            />
            <Line
              type="linear"
              dataKey="prevYear"
              stroke="var(--color-prevYear)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.5}
              dot={{
                fill: "var(--color-prevYear)",
                fillOpacity: 0.5,
                strokeWidth: 0,
                r: 2,
              }}
              activeDot={{
                r: 3.5,
                fill: "var(--color-prevYear)",
                fillOpacity: 0.5,
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

const RecentOrdersTable = () => {
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const pageSize = 6;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const nextStatus = params.get("status");
    if (
      nextStatus &&
      (nextStatus === "all" ||
        orderStatuses.includes(nextStatus as OrderStatus))
    ) {
      setStatusFilter(nextStatus as OrderStatus | "all");
    }
    const nextPage = Number(params.get("page"));
    if (!Number.isNaN(nextPage) && nextPage > 0) {
      setCurrentPage(nextPage);
    }
    setIsHydrated(true);
  }, []);

  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  React.useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }
    if (currentPage > 1) {
      params.set("page", String(currentPage));
    } else {
      params.delete("page");
    }
    const nextQuery = params.toString();
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [statusFilter, currentPage, isHydrated]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const startRow = filteredOrders.length ? (currentPage - 1) * pageSize + 1 : 0;
  const endRow = Math.min(currentPage * pageSize, filteredOrders.length);

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-pretty sm:text-base">
            Recent Orders
          </h2>
          <span className="ml-1 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset sm:text-xs dark:bg-gray-800/50 dark:text-gray-400 dark:ring-gray-400/20">
            {filteredOrders.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 gap-1.5 sm:h-9 sm:gap-2" />}><span className="text-xs sm:text-sm">
                                  {statusFilter === "all" ? "All" : statusFilter}
                                </span></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={statusFilter === "all"}
              onCheckedChange={() => setStatusFilter("all")}
            >
              All Statuses
            </DropdownMenuCheckboxItem>
            {orderStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter === status}
                onCheckedChange={() => setStatusFilter(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 pt-3 pb-4 sm:px-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className={tableHeadClass}>Order Ref</TableHead>
              <TableHead className={tableHeadClass}>Buyer</TableHead>
              <TableHead className={tableHeadClass}>Total</TableHead>
              <TableHead className={tableHeadClass}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground sm:text-sm">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-xs text-foreground tabular-nums sm:text-sm">
                    {currencyFormatter.format(order.total)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium sm:text-xs",
                        statusStyles[order.status],
                      )}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t px-4 py-3 text-[10px] text-muted-foreground sm:px-6 sm:text-xs">
        <span>
          {startRow}-{endRow} of {filteredOrders.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const FulfillmentPanel = () => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-pretty">Order Fulfillment</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Refresh"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7" aria-label="Options" />}><MoreHorizontal className="size-3.5" aria-hidden="true" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export CSV</DropdownMenuItem>
              <DropdownMenuItem>View All Orders</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
        <div className="flex items-center border-b pr-3 pb-2 text-[10px] text-muted-foreground">
          <span className="w-20 shrink-0">Order</span>
          <span className="flex-1">Status</span>
          <span className="w-8 shrink-0 text-right">Del[%]</span>
        </div>
        <ScrollArea className="h-[280px]">
          <div className="divide-y pr-3">
            {fulfillmentData.map((row) => (
              <div
                key={row.order}
                className="flex items-center gap-2 py-2.5 text-xs"
              >
                <span className="w-20 shrink-0 font-medium">{row.order}</span>
                <div className="flex min-w-0 flex-1 items-center gap-px overflow-hidden">
                  {row.segments.slice(0, 15).map((opacity, i) => {
                    const filled = i < Math.round((row.progress / 100) * 15);
                    return (
                      <div
                        key={i}
                        className="h-2.5 w-2 shrink-0 rounded-[1px]"
                        style={{
                          backgroundColor: filled
                            ? palette.primary
                            : "var(--muted)",
                          opacity: filled ? opacity : 0.2,
                        }}
                      />
                    );
                  })}
                </div>
                <span className="w-8 shrink-0 text-right font-medium">
                  {row.progress}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  return (
    <main
      id="dashboard-main"
      tabIndex={-1}
      className="w-full flex-1 space-y-4 bg-background p-3 sm:space-y-6 sm:p-4 md:p-6"
    >
      <HotelStatsCards />
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
        <SalesPipelineChart />
        <RevenueFlowChart />
      </div>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
        <RecentOrdersTable />
        <FulfillmentPanel />
      </div>
    </main>
  );
};

const Dashboard16 = ({ className }: { className?: string }) => {
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
    <SidebarProvider className={cn("bg-sidebar", className)}>
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <AppSidebar />
      <div className="h-svh w-full overflow-hidden lg:p-2">
        <div className="flex h-full w-full flex-col bg-background lg:rounded-xl lg:border">
          <div className="min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6">
                <DashboardIntro />
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
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
                      isDesktop && topRowHeight
                        ? { height: topRowHeight }
                        : undefined
                    }
                  >
                    <LatestUpdatesPanel />
                  </div>
                </div>
                <RecentArrivalsTableCard />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export { Dashboard16 };
