
import { format, formatDistanceToNow, formatRelative, isToday, isTomorrow, isYesterday } from 'date-fns';

// Format a date for display
export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy h:mm a');
  }
};

// Format time until an event
export const formatTimeUntil = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

// Format time for charts
export const formatChartTime = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp);
  
  switch(timeframe) {
    case '1m':
    case '5m':
    case '15m':
    case '30m':
      return format(date, 'HH:mm');
    case '1h':
    case '4h':
      return format(date, 'HH:mm, MMM d');
    case '1d':
      return format(date, 'MMM d');
    case '1w':
    case '1M':
      return format(date, 'MMM d, yyyy');
    default:
      return format(date, 'HH:mm, MMM d');
  }
};

// Format a date range for display
export const formatDateRange = (start: Date, end: Date): string => {
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  } else {
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }
};

// Convert UTC time to local time
export const utcToLocal = (date: Date): Date => {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

// Convert local time to UTC
export const localToUtc = (date: Date): Date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

// Get the current week's start and end dates
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};
