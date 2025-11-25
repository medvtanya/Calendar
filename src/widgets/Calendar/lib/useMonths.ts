import { useState, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';

const MONTHS_BUFFER = 3; // Load 3 months before and 3 after the current date

type Month = {
  year: number;
  month: number;
};

export const useMonths = () => {
  const [months, setMonths] = useState<Month[]>(() => {
    const today = new Date();
    const initialMonths: Month[] = [];
    // Start with a buffer around the current month
    for (let i = -MONTHS_BUFFER; i <= MONTHS_BUFFER; i++) {
      const date = addMonths(today, i);
      initialMonths.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    return initialMonths;
  });

  const loadMoreNext = useCallback(() => {
    setMonths((prevMonths) => {
      const lastMonth = prevMonths[prevMonths.length - 1];
      const lastMonthDate = new Date(lastMonth.year, lastMonth.month);
      const newMonths: Month[] = [];
      for (let i = 1; i <= MONTHS_BUFFER; i++) {
        const date = addMonths(lastMonthDate, i);
        newMonths.push({ year: date.getFullYear(), month: date.getMonth() });
      }
      return [...prevMonths, ...newMonths];
    });
  }, []);

  const loadMorePrev = useCallback(() => {
    setMonths((prevMonths) => {
      const firstMonth = prevMonths[0];
      const firstMonthDate = new Date(firstMonth.year, firstMonth.month);
      const newMonths: Month[] = [];
      for (let i = 1; i <= MONTHS_BUFFER; i++) {
        const date = subMonths(firstMonthDate, i);
        newMonths.unshift({ year: date.getFullYear(), month: date.getMonth() });
      }
      // Keep the DOM from getting too large by trimming the other end
      return [...newMonths, ...prevMonths.slice(0, prevMonths.length - MONTHS_BUFFER)];
    });
  }, []);

  return { months, loadMoreNext, loadMorePrev };
};
