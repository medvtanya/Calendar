import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export type DayInfo = {
  date: Date;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
};

/**
 * Generates a matrix of dates for a given month.
 * Includes padding days from the previous and next months to fill the grid.
 * @param year - The year.
 * @param month - The month (0-indexed, 0 for January).
 * @param weekStartsOn - The index of the first day of the week (0 for Sunday).
 * @returns A 2D array of Date objects representing the month's grid.
 */
export const generateMonthMatrix = (
  year: number,
  month: number,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1 // Default to Monday
): Date[][] => {
  const date = new Date(year, month);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

/**
 * Formats a date for display.
 * @param date - The date to format.
 * @param formatStr - The format string.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};

/**
 * Generates an array of weekday names.
 * @param weekStartsOn - The index of the first day of the week (0 for Sunday).
 * @param formatStr - The format for the weekday name (e.g., 'EEEEE' for 'M').
 * @returns An array of weekday name strings.
 */
export const getWeekdays = (
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1,
  formatStr: string = 'EEEEE' // e.g., 'M' for Monday
): string[] => {
  const week: string[] = [];
  const firstDay = startOfWeek(new Date(), { weekStartsOn });
  for (let i = 0; i < 7; i++) {
    week.push(format(addDays(firstDay, i), formatStr));
  }
  return week;
};

export const getMonthDays = (
  year: number,
  month: number
): {
  days: DayInfo[];
  monthName: string;
  year: number;
} => {
  const date = new Date(year, month);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) => {
      const dayMonth = date.getMonth();
      return {
        date,
        isCurrentMonth: dayMonth === month,
        isPreviousMonth: dayMonth < month,
        isNextMonth: dayMonth > month,
      };
    }
  );

  return {
    days,
    monthName: format(date, 'MMMM'),
    year: date.getFullYear(),
  };
};
