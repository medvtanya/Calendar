'use client';

import { FC } from 'react';
import { eachDayOfInterval, isSameDay, isWithinInterval, format } from 'date-fns';
import { Day } from '@/entities/Day';
import { DayInfo } from '@/shared/lib/date';

type WeekViewProps = {
  week: {
    start: Date;
    end: Date;
  };
  range: {
    start: Date | null;
    end: Date | null;
  };
  onDayClick: (date: Date) => void;
};

export const WeekView: FC<WeekViewProps> = ({ week, range, onDayClick }) => {
  const days = eachDayOfInterval({ start: week.start, end: week.end });
  const { start: startDate, end: endDate } = range;

  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getDayInfo = (date: Date): Omit<DayInfo, 'date'> => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const dayMonth = date.getMonth();

    return {
      isCurrentMonth: dayMonth === currentMonth,
      isPreviousMonth: dayMonth < currentMonth,
      isNextMonth: dayMonth > currentMonth,
    };
  };

  return (
    <div className="p-4 h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold text-center mb-4">
          {format(week.start, 'MMMM yyyy')}
        </h2>
        <div className="grid grid-cols-7 gap-x-2 text-center text-sm text-gray-500 mb-2">
          {weekdays.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day, dayIdx) => {
            const dayInfo = getDayInfo(day);
            return (
              <Day
                key={dayIdx}
                date={day}
                isCurrentMonth={dayInfo.isCurrentMonth}
                isPreviousMonth={dayInfo.isPreviousMonth}
                isNextMonth={dayInfo.isNextMonth}
                isSelected={
                  (isSameDay(day, startDate!) && !!startDate) ||
                  (isSameDay(day, endDate!) && !!endDate)
                }
                isInRange={
                  !!startDate &&
                  !!endDate &&
                  isWithinInterval(day, { start: startDate, end: endDate })
                }
                isRangeStart={!!startDate && isSameDay(day, startDate)}
                isRangeEnd={!!endDate && isSameDay(day, endDate)}
                onClick={onDayClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
