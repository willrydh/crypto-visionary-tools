
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

// Format time until an event with more precision
export const formatTimeUntil = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  
  if (diffMinutes < 0) {
    // If the event is in the past
    return formatDistanceToNow(date, { addSuffix: true })
      .replace('about ', '')
      .replace('less than a minute ago', 'just now');
  }
  
  // For times less than 60 minutes away, show minutes with more precision
  if (diffMinutes >= 0 && diffMinutes < 60) {
    return `in ${diffMinutes}m`;
  }
  
  // For times less than 24 hours, show hours and minutes
  if (diffMinutes >= 60 && diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    // Format depending on whether we have both hours and minutes or just hours
    if (minutes === 0) {
      return `in ${hours}h`;
    }
    return `in ${hours}h ${minutes}m`;
  }
  
  // For times more than 24 hours, show days and hours
  if (diffMinutes >= 24 * 60) {
    const days = Math.floor(diffMinutes / (24 * 60));
    const remainingMinutes = diffMinutes % (24 * 60);
    const hours = Math.floor(remainingMinutes / 60);
    
    if (hours === 0) {
      return `in ${days}d`;
    }
    return `in ${days}d ${hours}h`;
  }
  
  // Fallback to date-fns formatting but clean up the output
  const formatted = formatDistanceToNow(date, { addSuffix: true });
  
  return formatted
    .replace('about ', '')
    .replace('in in', 'in')
    .replace('about about', 'about');
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

// Convert UTC time to local time correctly
export const utcToLocal = (date: Date): Date => {
  const localDate = new Date(date.toISOString());
  return localDate;
};

// Convert local time to UTC correctly
export const localToUtc = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
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

// Get a user-friendly time string that accounts for the specific hour
export const getTimeDisplay = (hour: number, minute: number = 0): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} UTC`;
};

// Create a new UTC date for a specific hour and minute
export const createUtcDate = (hour: number, minute: number = 0): Date => {
  const date = new Date();
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

// Get the next occurrence of a specific time in UTC
export const getNextOccurrence = (hour: number, minute: number = 0, skipWeekends: boolean = true): Date => {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setUTCHours(hour, minute, 0, 0);
  
  // If the target time has already passed today, set it for tomorrow
  if (targetDate <= now) {
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
  }
  
  // If skipWeekends is true and the day is a weekend, adjust to the next weekday
  if (skipWeekends) {
    const dayOfWeek = targetDate.getUTCDay();
    if (dayOfWeek === 0) { // Sunday
      targetDate.setUTCDate(targetDate.getUTCDate() + 1);
    } else if (dayOfWeek === 6) { // Saturday
      targetDate.setUTCDate(targetDate.getUTCDate() + 2);
    }
  }
  
  return targetDate;
};

// Get timezone offset hours (positive for east of UTC, negative for west)
export const getTimezoneOffsetHours = (): number => {
  // JavaScript's getTimezoneOffset is in minutes and has opposite sign of standard timezone notation
  return -(new Date().getTimezoneOffset() / 60);
};

// Adjust UTC hour to user's local timezone
export const adjustHourToLocalTimezone = (utcHour: number): number => {
  const offsetHours = getTimezoneOffsetHours();
  let localHour = (utcHour + offsetHours) % 24;
  return localHour >= 0 ? localHour : localHour + 24; // Handle negative hours
};

// Convert a UTC hour:minute to local time display
export const getLocalTimeDisplay = (utcHour: number, utcMinute: number = 0): string => {
  const localHour = adjustHourToLocalTimezone(utcHour);
  return `${localHour.toString().padStart(2, '0')}:${utcMinute.toString().padStart(2, '0')} ${getTimezoneAbbreviation()}`;
};

// Get the timezone abbreviation
export const getTimezoneAbbreviation = (): string => {
  const options: Intl.DateTimeFormatOptions = { timeZoneName: 'short' };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date());
  const timeZonePart = parts.find(part => part.type === 'timeZoneName');
  return timeZonePart?.value || '';
};

// Get precise UTC time for market open/close calculations
export const getPreciseMarketTime = (utcHour: number, utcMinute: number = 0): Date => {
  const now = new Date();
  const targetDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    utcHour,
    utcMinute,
    0,
    0
  ));
  
  // If the target time has already passed today, set it for tomorrow
  if (targetDate <= now) {
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
  }
  
  // Skip weekends for market times
  const dayOfWeek = targetDate.getUTCDay();
  if (dayOfWeek === 0) { // Sunday
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
  } else if (dayOfWeek === 6) { // Saturday
    targetDate.setUTCDate(targetDate.getUTCDate() + 2);
  }
  
  return targetDate;
};

// Calculate exact time remaining until market event with consistent formatting
export const getMarketTimeRemaining = (targetTime: Date): string => {
  const now = new Date();
  
  // If the target time is in the past
  if (targetTime < now) {
    return "passed";
  }
  
  const diffMs = targetTime.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  
  // Format based on time remaining
  if (diffMinutes < 60) {
    return `in ${diffMinutes}m`;
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `in ${hours}h ${minutes}m` : `in ${hours}h`;
  } else {
    const days = Math.floor(diffMinutes / (24 * 60));
    const remainingHours = Math.floor((diffMinutes % (24 * 60)) / 60);
    return remainingHours > 0 ? `in ${days}d ${remainingHours}h` : `in ${days}d`;
  }
};
