import { differenceInDays, isPast, isToday, parseISO, startOfDay } from 'date-fns';
import { Status } from '../types';

export function getStatus(expiryDate: string): Status {
  const date = startOfDay(parseISO(expiryDate));
  const today = startOfDay(new Date());
  
  const daysDiff = differenceInDays(date, today);

  if (isPast(date) || isToday(date) || daysDiff <= 0) {
    return 'expired';
  }
  if (daysDiff <= 3) {
    return 'warning';
  }
  return 'safe';
}

export function getDaysRemaining(expiryDate: string): number {
  const date = startOfDay(parseISO(expiryDate));
  const today = startOfDay(new Date());
  return differenceInDays(date, today);
}
