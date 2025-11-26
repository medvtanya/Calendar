'use client';
import { FC } from 'react';
import { format } from 'date-fns';

type SelectedRangeDisplayProps = {
  range: {
    start: Date | null;
    end: Date | null;
  };
  onReset: () => void;
};

export const SelectedRangeDisplay: FC<SelectedRangeDisplayProps> = ({ range, onReset }) => {
  if (!range.start) {
    return null;
  }

  const formattedStart = format(range.start, 'd MMM yyyy');
  const formattedEnd = range.end ? format(range.end, 'd MMM yyyy') : '...';

  return (
    <div className="footer-background fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
      <div className="text-left">
        <p className="text-lg font-semibold footer-text-primary">
          {formattedStart} - {formattedEnd}
        </p>
        <p className="text-sm footer-text-secondary">Selected date range</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="px-4 py-2 rounded-md transition-colors footer-button-text footer-button-background"
      >
        Reset
      </button>
    </div>
  );
};
