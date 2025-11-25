'use client';
import { FC } from 'react';
import { format } from 'date-fns';

type SelectedRangeDisplayProps = {
  range: {
    start: Date | null;
    end: Date | null;
  };
};

export const SelectedRangeDisplay: FC<SelectedRangeDisplayProps> = ({ range }) => {
  if (!range.start) {
    return null;
  }

  const formattedStart = format(range.start, 'd MMM yyyy');
  const formattedEnd = range.end ? format(range.end, 'd MMM yyyy') : '...';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-center items-center">
      <div className="text-center">
        <p className="text-lg font-semibold">
          {formattedStart} - {formattedEnd}
        </p>
        <p className="text-sm text-gray-500">Selected date range</p>
      </div>
    </div>
  );
};
