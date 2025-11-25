'use client';

import { FC } from 'react';
import { format } from 'date-fns';
import { Day } from '@/entities/Day';
import { getMonthDays, DayInfo } from '@/shared/lib/date';
import { isSameDay, isWithinInterval } from 'date-fns';

type MonthProps = {
  year: number;
  month: number;
  range: {
    start: Date | null;
    end: Date | null;
  };
  onDayClick: (date: Date) => void;
};

export const Month: FC<MonthProps> = ({ year, month, range, onDayClick }) => {
  const { days, monthName, year: currentYear } = getMonthDays(year, month);
  const { start: startDate, end: endDate } = range;

  const handleDayClick = (date: Date) => {
    onDayClick(date);
  };

  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-center mb-4">
        {monthName} {currentYear}
      </h2>
      <div className="grid grid-cols-7 gap-x-2 text-center text-sm text-gray-500 mb-2">
        {weekdays.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day: DayInfo, dayIdx) => (
          <Day
            key={dayIdx}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isPreviousMonth={day.isPreviousMonth}
            isNextMonth={day.isNextMonth}
            isSelected={
              (isSameDay(day.date, startDate!) && !!startDate) ||
              (isSameDay(day.date, endDate!) && !!endDate)
            }
            isInRange={!!startDate && !!endDate && isWithinInterval(day.date, {
              start: startDate,
              end: endDate,
            })}
            isRangeStart={!!startDate && isSameDay(day.date, startDate)}
            isRangeEnd={!!endDate && isSameDay(day.date, endDate)}
            onClick={handleDayClick}
          />
        ))}
      </div>
    </div>
  );
};
