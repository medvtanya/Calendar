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
    'relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ease-in-out',
    {
      // Selected state (start/end of range)
      'bg-gray-100 text-gray-900 dark:bg-gray-100 dark:text-gray-900': isSelected,

      // Text color for dates within the range (needs to be visible on the range background)
      'text-white dark:text-gray-100': isInRange && !isSelected,

      // Default text colors (from globals.css) - only apply when not in range
      'day-in-current-month': isCurrentMonth && !isSelected && !isInRange,
      'day-in-previous-month': isPreviousMonth && !isSelected && !isInRange,
      'day-in-next-month': isNextMonth && !isSelected && !isInRange,

      // Hover state (only for clickable, non-ranged days)
      'hover:bg-gray-200 dark:hover:bg-gray-700':
        isCurrentMonth && !isSelected && !isInRange,

      // Today's date indicator
      'ring-2 ring-blue-500 dark:ring-blue-400':
        isToday(date) && !isSelected,
    }
  );

  const rangeHighlightClasses = clsx('absolute inset-y-0 z-0', {
    'bg-gray-900 dark:bg-zinc-800': isInRange,
    // If it's the start of the range, the bar starts from the middle
    'left-1/2 right-0': isRangeStart && !isRangeEnd,
    // If it's the end of the range, the bar ends at the middle
    'right-1/2 left-0': isRangeEnd && !isRangeStart,
    // If it's in the middle, the bar spans the full width
    'left-0 right-0': isInRange && !isRangeStart && !isRangeEnd,
  });

  return (
    <div className="relative flex justify-center items-center">
      <div className={rangeHighlightClasses} />
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
