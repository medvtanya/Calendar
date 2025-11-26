import { useState, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';

const generateMonths = (centerDate: Date, countBefore: number, countAfter: number) => {
  const months = [];
  for (let i = -countBefore; i <= countAfter; i++) {
    const date = addMonths(centerDate, i);
    months.push({ year: date.getFullYear(), month: date.getMonth() });
  }
  return months;
};

export const useMonths = () => {
  const [months, setMonths] = useState(() => generateMonths(new Date(), 6, 6));

  const loadMoreNext = useCallback(() => {
    setMonths((prev) => {
      if (prev.length === 0) return prev;
      const lastMonth = prev[prev.length - 1];
      const nextDate = addMonths(new Date(lastMonth.year, lastMonth.month), 1);
      return [...prev, { year: nextDate.getFullYear(), month: nextDate.getMonth() }];
    });
  }, []);

  const loadMorePrev = useCallback(() => {
    setMonths((prev) => {
      if (prev.length === 0) return prev;
      const firstMonth = prev[0];
      const prevDate = subMonths(new Date(firstMonth.year, firstMonth.month), 1);
      return [{ year: prevDate.getFullYear(), month: prevDate.getMonth() }, ...prev];
    });
  }, []);

  const jumpToMonth = useCallback((date: Date) => {
    setMonths(generateMonths(date, 6, 6));
  }, []);

  return { months, loadMoreNext, loadMorePrev, jumpToMonth };
};
