// ---------------------------------------------------------------------------
// Celebrations
// ---------------------------------------------------------------------------
//
// Is today a user's birthday or work anniversary? Users' `birthday` and
// `workBirthday` are day-only Payload dates stored as ISO timestamps, so both
// they and "today" are read as calendar days in the team's time zone —
// otherwise a date saved at local midnight would land on the previous UTC day.
// A 29 February date is celebrated on 28 February in non-leap years.

const TIME_ZONE = "Europe/Sofia";

type CalendarDay = { year: number; month: number; day: number };

function toCalendarDay(date: Date): CalendarDay {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  return { year: part("year"), month: part("month"), day: part("day") };
}

const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

function isSameDayOfYear(date: CalendarDay, today: CalendarDay) {
  if (date.month === 2 && date.day === 29 && !isLeapYear(today.year)) {
    return today.month === 2 && today.day === 28;
  }
  return date.month === today.month && date.day === today.day;
}

export type Celebration = {
  /** Unique per occurrence, e.g. "birthday-12-2026"; used as the banner's dismissKey. */
  id: string;
  kind: "birthday" | "workAnniversary";
  userId: number;
  /** First name, falling back to the last name or email. */
  name: string;
  isCurrentUser: boolean;
  years?: number;
};

type CelebrationUser = {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  birthday?: string | null;
  workBirthday?: string | null;
};

// Today's celebrations across the team, the current user's first.
export function getTeamCelebrations(
  users: CelebrationUser[],
  currentUserId: number | undefined,
  now: Date = new Date(),
): Celebration[] {
  const { year } = toCalendarDay(now);

  return users
    .flatMap((user) => {
      const { birthday, workAnniversaryYears } = getCelebrations(user, now);
      const name = user.firstName || user.lastName || user.email;
      const base = { userId: user.id, name, isCurrentUser: user.id === currentUserId };

      return [
        ...(birthday
          ? [{ ...base, id: `birthday-${user.id}-${year}`, kind: "birthday" as const }]
          : []),
        ...(workAnniversaryYears
          ? [
              {
                ...base,
                id: `workAnniversary-${user.id}-${year}`,
                kind: "workAnniversary" as const,
                years: workAnniversaryYears,
              },
            ]
          : []),
      ];
    })
    .sort((a, b) => Number(b.isCurrentUser) - Number(a.isCurrentUser));
}

export type Celebrations = {
  birthday: boolean;
  /** Completed years at the company, when today is the work anniversary. */
  workAnniversaryYears: number | null;
};

export function getCelebrations(
  user: { birthday?: string | null; workBirthday?: string | null },
  now: Date = new Date(),
): Celebrations {
  const today = toCalendarDay(now);
  const birthday = user.birthday ? toCalendarDay(new Date(user.birthday)) : null;
  const workStart = user.workBirthday ? toCalendarDay(new Date(user.workBirthday)) : null;
  const years = workStart ? today.year - workStart.year : 0;

  return {
    birthday: birthday ? isSameDayOfYear(birthday, today) : false,
    workAnniversaryYears:
      workStart && years > 0 && isSameDayOfYear(workStart, today) ? years : null,
  };
}

// Display helpers for the same dates, in the same time zone as the checks
// above. Birthdays show day and month only, not the year of birth.

const formatInTeamTimeZone = (value: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, ...options }).format(new Date(value));

export const formatBirthday = (value: string) =>
  formatInTeamTimeZone(value, { day: "numeric", month: "long" });

export const formatWorkStart = (value: string) =>
  formatInTeamTimeZone(value, { day: "numeric", month: "long", year: "numeric" });

/** Completed years since `value` (e.g. a work start date), never negative. */
export function getCompletedYears(value: string, now: Date = new Date()): number {
  const start = toCalendarDay(new Date(value));
  const today = toCalendarDay(now);
  const beforeAnniversary =
    today.month < start.month || (today.month === start.month && today.day < start.day);

  return Math.max(0, today.year - start.year - (beforeAnniversary ? 1 : 0));
}

// <input type="date"> values ("YYYY-MM-DD") ⇄ stored day-only dates. Saved at
// 12:00 UTC so the calendar day is the same in the team's time zone.

export function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  const { year, month, day } = toCalendarDay(new Date(value));
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const fromDateInputValue = (value: string): string | null =>
  DATE_INPUT_PATTERN.test(value) ? `${value}T12:00:00.000Z` : null;
