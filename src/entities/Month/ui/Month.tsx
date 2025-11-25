import { FC } from 'react';
import { Day } from '@/entities/Day';
import { formatDate, generateMonthMatrix, getWeekdays } from '@/shared/lib/date';
import { isSameMonth } from 'date-fns';
import { useLocale } from 'next-intl';

type MonthProps = {
  year: number;
  month: number; // 0-indexed
  range: { start: Date | null; end: Date | null };
  onDayClick: (date: Date) => void;
};

export const Month: FC<MonthProps> = ({ year, month, range, onDayClick }) => {
  const locale = useLocale();
  const monthMatrix = generateMonthMatrix(year, month);
  const weekdays = getWeekdays(locale);
  const currentMonthDate = new Date(year, month);

  return (
    <section className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold mb-4">
        {formatDate(currentMonthDate, 'LLLL yyyy', locale)}
      </h2>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekdays.map((day, index) => (
          <div key={index} className="w-10 h-10 flex items-center justify-center text-sm text-gray-500">
            {day}
          </div>
        ))}
        {monthMatrix.flat().map((date, i) => {
          const isCurrentMonth = isSameMonth(date, currentMonthDate);
          const isSelected =
            (range.start && date.getTime() === range.start.getTime()) ||
            (range.end && date.getTime() === range.end.getTime()) ||
            false;
          
          const isRangeStart = (range.start && date.getTime() === range.start.getTime()) || false;
          const isRangeEnd = (range.end && date.getTime() === range.end.getTime()) || false;

          const isInRange =
            (range.start &&
              range.end &&
              date.getTime() > range.start.getTime() &&
              date.getTime() < range.end.getTime()) ||
            false;

          return (
            <Day
              key={i}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              isInRange={isInRange}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </section>
  );
};
