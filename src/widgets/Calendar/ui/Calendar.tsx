'use client';
import { FC, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Month } from '@/entities/Month';
import { useDateRangePicker } from '@/features/DateRangePicker';
import { useMonths } from '../lib/useMonths';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { SelectedRangeDisplay } from '@/widgets/SelectedRangeDisplay';
import { ThemeSwitcher } from '@/features/ThemeSwitcher/ui/ThemeSwitcher';
import { CalendarHeader } from './CalendarHeader';

export const Calendar: FC = () => {
  const { range, handleDayClick, resetDates } = useDateRangePicker();
  const { months, loadMoreNext, loadMorePrev, jumpToMonth } = useMonths();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [visibleDate, setVisibleDate] = useState(new Date());
  const [jumpTarget, setJumpTarget] = useState<string | null>(
    `${new Date().getFullYear()}-${new Date().getMonth()}`
  );
  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useLayoutEffect(() => {
    if (jumpTarget) {
      const targetElement = monthRefs.current.get(jumpTarget);
      if (targetElement) {
        targetElement.scrollIntoView({ block: 'center' });
        setJumpTarget(null);
      }
    }
  }, [jumpTarget, months]);

  const handleDateChange = (date: Date) => {
    setVisibleDate(date); // Immediately update the UI
    const targetId = `${date.getFullYear()}-${date.getMonth()}`;
    setJumpTarget(targetId);
    jumpToMonth(date);
  };

  const topObserverRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: loadMoreNext,
    threshold: 0.1,
  });

  const bottomObserverRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: loadMorePrev,
    threshold: 0.1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dateStr = (entry.target as HTMLElement).dataset.date;
            if (dateStr) {
              setVisibleDate(new Date(dateStr));
            }
          }
        });
      },
      { threshold: 0.75, root: scrollContainerRef.current }
    );

    monthRefs.current.forEach((node) => {
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [months]);

  return (
    <>
      <CalendarHeader visibleDate={visibleDate} onDateChange={handleDateChange} />
      <div className="fixed top-4 right-4 z-30">
        <ThemeSwitcher />
      </div>
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory pt-20"
      >
        <div ref={bottomObserverRef} className="h-1" />
        {months.map(({ year, month }) => {
          const monthIdentifier = `${year}-${month}`;
          const monthDate = new Date(year, month);
          return (
            <div
              key={monthIdentifier}
              ref={(node) => {
                if (node) {
                  monthRefs.current.set(monthIdentifier, node);
                } else {
                  monthRefs.current.delete(monthIdentifier);
                }
              }}
              data-date={monthDate.toISOString()}
              className="snap-start h-screen flex items-center justify-center"
            >
              <Month
                year={year}
                month={month}
                range={range}
                onDayClick={handleDayClick}
              />
            </div>
          );
        })}
        <div ref={topObserverRef} className="h-1" />
      </div>
      <SelectedRangeDisplay range={range} onReset={resetDates} />
    </>
  );
};
