import { FC } from 'react';
import { clsx } from 'clsx';
import { isToday } from 'date-fns';

type DayProps = {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  onClick: (date: Date) => void;
};

export const Day: FC<DayProps> = ({
  date,
  isCurrentMonth,
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
      'text-gray-900': isCurrentMonth,
      'text-gray-400': !isCurrentMonth,
      'bg-blue-600 text-white': isSelected,
      'bg-blue-100 text-blue-800': isInRange && !isSelected,
      'hover:bg-gray-200': isCurrentMonth && !isSelected && !isInRange,
      'rounded-l-full rounded-r-none': isRangeStart && !isRangeEnd,
      'rounded-r-full rounded-l-none': isRangeEnd && !isRangeStart,
      'rounded-none': isInRange && !isRangeStart && !isRangeEnd,
      'ring-2 ring-blue-500': isToday(date) && !isSelected,
    }
  );

  return (
    <div
      className={clsx('flex justify-center items-center', {
        'bg-blue-100': isInRange,
        'rounded-l-full': isRangeStart,
        'rounded-r-full': isRangeEnd,
      })}
    >
      <button type="button" className={dayClasses} onClick={() => onClick(date)}>
        {dayNumber}
      </button>
    </div>
  );
};
