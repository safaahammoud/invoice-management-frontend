import { useDate } from "vuetify";

export const formatDate = (date: Date | null, format = 'fullDateWithWeekday'): string => {
    const dateComp = useDate();
    const formattedDate = dateComp.format(date, format);
  
    return formattedDate || '';
  };