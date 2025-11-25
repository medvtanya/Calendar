'use client';
import { FC } from 'react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

type SelectedRangeDisplayProps = {
  range: {
    start: Date | null;
    end: Date | null;
  };
  onReset: () => void;
};

export const SelectedRangeDisplay: FC<SelectedRangeDisplayProps> = ({ range, onReset }) => {
  const t = useTranslations('SelectedRangeDisplay');

  if (!range.start) {
    return null;
  }

  const formattedStart = format(range.start, 'd MMM yyyy');
  const formattedEnd = range.end ? format(range.end, 'd MMM yyyy') : '...';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-between items-center">
      <div className="text-left">
        <p className="text-lg font-semibold">
          {formattedStart} - {formattedEnd}
        </p>
        <p className="text-sm text-gray-500">{t('title')}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        {t('reset')}
      </button>
    </div>
  );
};
