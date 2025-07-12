import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'HH:mm');
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const isTaskDueToday = (dueDate: string): boolean => {
  const date = parseISO(dueDate);
  return isValid(date) && isToday(date);
};

export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const formatInputDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getToday = (): string => {
  return formatInputDate(new Date());
};