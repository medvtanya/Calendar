'use client';
import { FC } from 'react';
import { format } from 'date-fns';
import { ZoomIn } from 'lucide-react';

type SelectedRangeDisplayProps = {
  range: {
    start: Date | null;
    end: Date | null;
  };
  onReset: () => void;
  onZoom: () => void;
  isMobile: boolean;
};

export const SelectedRangeDisplay: FC<SelectedRangeDisplayProps> = ({
  range,
  onReset,
  onZoom,
  isMobile,
}) => {
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
      <div className="flex items-center space-x-2">
        {range.start && range.end && !isMobile && (
          <button
            type="button"
            onClick={onZoom}
            className="p-2 rounded-full transition-colors footer-button-background footer-button-text"
            aria-label="Zoom to week"
          >
            <ZoomIn size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-md transition-colors footer-button-text footer-button-background"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
