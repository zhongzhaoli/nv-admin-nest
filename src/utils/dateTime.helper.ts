import { format } from 'date-fns';

export const formatDate = (dateTime: Date) => {
  return format(new Date(dateTime).toISOString(), 'yyyy-MM-dd HH:mm:ss');
};
