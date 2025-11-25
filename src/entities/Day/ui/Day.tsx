import { FC } from 'react';
import { clsx } from 'clsx';
import { isToday } from 'date-fns';

type DayProps = {
  date: Date;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  onClick: (date: Date) => void;
};

export const Day: FC<DayProps> = ({
  date,
  isCurrentMonth,
  isPreviousMonth,
  isNextMonth,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onClick,
}) => {
  const dayNumber = date.getDate();

  const dayClasses = clsx(
    'flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ease-in-out',
    {
      'day-in-current-month': isCurrentMonth,
      'day-in-previous-month': isPreviousMonth,
      'day-in-next-month': isNextMonth,
      'bg-blue-600 text-white dark:bg-blue-500': isSelected,
      'bg-gray-200 dark:bg-gray-700': isInRange && !isSelected,
      'hover:bg-gray-200 dark:hover:bg-gray-700':
        isCurrentMonth && !isSelected && !isInRange,
      'rounded-l-full rounded-r-none': isRangeStart && !isRangeEnd,
      'rounded-r-full rounded-l-none': isRangeEnd && !isRangeStart,
      'rounded-none': isInRange && !isRangeStart && !isRangeEnd,
      'ring-2 ring-blue-500 dark:ring-blue-400':
        isToday(date) && !isSelected,
    }
  );

  return (
    <div
      className={clsx('flex justify-center items-center', {
        'bg-gray-200 dark:bg-gray-700': isInRange,
        'rounded-l-full': isRangeStart,
        'rounded-r-full': isRangeEnd,
      })}
    >
      <button
        type="button"
        className={dayClasses}
        onClick={() => onClick(date)}
      >
        {dayNumber}
      </button>
    </div>
  );
};
