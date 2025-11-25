'use client';
import { FC, useLayoutEffect, useRef } from 'react';
import { Month } from '@/entities/Month';
import { useDateRangePicker } from '@/features/DateRangePicker';
import { useMonths } from '../lib/useMonths';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { SelectedRangeDisplay } from '@/widgets/SelectedRangeDisplay';

export const Calendar: FC = () => {
  const { range, handleDayClick } = useDateRangePicker();
  const { months, loadMoreNext, loadMorePrev } = useMonths();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialMonthRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (initialMonthRef.current) {
      initialMonthRef.current.scrollIntoView({
        block: 'start',
      });
    }
  }, []);


  const topObserverRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: () => {
      loadMorePrev();
    },
    threshold: 0.1,
  });

  const bottomObserverRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: () => {
      loadMoreNext();
    },
    threshold: 0.1,
  });

  const today = new Date();
  const currentMonthIdentifier = `${today.getFullYear()}-${today.getMonth()}`;

  return (
    <>
      <div ref={scrollContainerRef} className="h-screen overflow-y-auto snap-y snap-mandatory">
        <div ref={topObserverRef} className="h-1" />
        {months.map(({ year, month }) => {
          const monthIdentifier = `${year}-${month}`;
          const isInitialMonth = monthIdentifier === currentMonthIdentifier;
          
          return (
            <div
              key={monthIdentifier}
              ref={isInitialMonth ? initialMonthRef : null}
              className="snap-start h-screen flex items-center justify-center"
            >
              <Month year={year} month={month} range={range} onDayClick={handleDayClick} />
            </div>
          );
        })}
        <div ref={bottomObserverRef} className="h-1" />
      </div>
      <SelectedRangeDisplay range={range} />
    </>
  );
};
