import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (dateTime: Date) => {
  return format(new Date(dateTime).toISOString(), 'yyyy-MM-dd HH:mm:ss');
};

export const timeAgo = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
};
