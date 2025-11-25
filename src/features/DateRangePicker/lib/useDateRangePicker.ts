import { useState } from 'react';
import { isAfter } from 'date-fns';

export const useDateRangePicker = () => {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const handleDayClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else {
      if (isAfter(date, range.start)) {
        setRange({ ...range, end: date });
      } else {
        setRange({ start: date, end: range.start });
      }
    }
  };

  const resetDates = () => {
    setRange({ start: null, end: null });
  };

  return {
    range,
    handleDayClick,
    resetDates,
  };
};
