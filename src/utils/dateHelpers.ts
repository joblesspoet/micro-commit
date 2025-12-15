import { format, isToday as isDateToday, differenceInDays, subDays } from 'date-fns';

// Returns the ISO string for the start of the user's LOCAL day, converted to UTC.
// e.g. User +5h, Local 00:00 Dec 15 -> 返回 2025-12-14T19:00:00.000Z
export const getStartOfTodayUTC = (): string => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Local Start of Day
    return now.toISOString();
};

export const getEndOfTodayUTC = (): string => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Local End of Day
    return now.toISOString();
};

export const formatDate = (dateString: string, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(new Date(dateString), formatStr);
};



export const getDaysDifference = (dateLeft: string, dateRight: string): number => {
  return differenceInDays(new Date(dateLeft), new Date(dateRight));
};

export const getStreakDates = (streakCount: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < streakCount; i++) {
    dates.push(format(subDays(today, i), 'yyyy-MM-dd')); // this format uses local date, which is good for UI "YYYY-MM-DD" comparison if consistent
  }
  
  return dates;
};

export const isSameDate = (dateLeft: string, dateRight: string): boolean => {
  return isSameDay(new Date(dateLeft), new Date(dateRight));
};

/**
 * Get date string in YYYY-MM-DD format using local timezone
 */
export const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Check if a date is today (in local timezone)
 */
export const isToday = (date: Date | string): boolean => {
    const checkDate = typeof date === 'string' ? new Date(date) : date;
    return getLocalDateString(checkDate) === getLocalDateString(new Date());
};

/**
 * Check if two dates are the same day (in local timezone)
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    return getLocalDateString(d1) === getLocalDateString(d2);
};