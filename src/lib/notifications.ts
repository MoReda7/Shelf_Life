import { toast } from 'sonner';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { FoodItem } from '../types';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const checkExpiringItems = (items: FoodItem[]) => {
  const tomorrow = startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);

  const expiringTomorrow = items.filter(item => {
    const itemDate = startOfDay(parseISO(item.expiryDate));
    return differenceInDays(itemDate, startOfDay(new Date())) === 1;
  });

  if (expiringTomorrow.length > 0) {
    const message = expiringTomorrow.length === 1 
      ? `Don't forget to eat your ${expiringTomorrow[0].name}! It expires tomorrow.`
      : `You have ${expiringTomorrow.length} items expiring tomorrow!`;

    // Local toast
    toast.warning("Expiring Soon", {
      description: message,
    });

    // Browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification("Shelf Life Reminder", {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }
};
