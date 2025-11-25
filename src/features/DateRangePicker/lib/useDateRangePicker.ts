import { useState } from 'react';
import { isAfter } from 'date-fns';

export const useDateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDayClick = (date: Date) => {
    if (startDate && !endDate) {
      if (isAfter(date, startDate)) {
        setEndDate(date);
      } else {
        setStartDate(date);
      }
    } else if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setStartDate(date);
    }
  };

  const range = {
    start: startDate,
    end: endDate,
  };

  return {
    range,
    handleDayClick,
  };
};
