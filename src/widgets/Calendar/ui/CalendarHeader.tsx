'use client';

import { FC } from 'react';
import { format } from 'date-fns';
import { CustomSelect } from './CustomSelect';

type CalendarHeaderProps = {
  visibleDate: Date;
  onDateChange: (date: Date) => void;
};

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  visibleDate,
  onDateChange,
}) => {
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(0, i), 'MMMM'),
  }));
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => ({
    value: currentYear - 10 + i,
    label: (currentYear - 10 + i).toString(),
  }));

  const handleMonthChange = (newMonth: string | number) => {
    onDateChange(new Date(visibleDate.getFullYear(), newMonth as number, 1));
  };

  const handleYearChange = (newYear: string | number) => {
    onDateChange(new Date(newYear as number, visibleDate.getMonth(), 1));
  };

  return (
    <div className="header-background fixed top-0 left-0 right-0 z-20 p-4 flex justify-center items-center space-x-2 border-b border-gray-200 dark:border-zinc-800">
      <CustomSelect
        options={monthOptions}
        value={visibleDate.getMonth()}
        onChange={handleMonthChange}
      />
      <CustomSelect
        options={yearOptions}
        value={visibleDate.getFullYear()}
        onChange={handleYearChange}
      />
    </div>
  );
};
