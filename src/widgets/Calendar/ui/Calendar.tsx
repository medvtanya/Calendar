'use client';
import { FC, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Month } from '@/entities/Month';
import { useDateRangePicker } from '@/features/DateRangePicker';
import { useMonths } from '../lib/useMonths';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { SelectedRangeDisplay } from '@/widgets/SelectedRangeDisplay';
import { ThemeSwitcher } from '@/features/ThemeSwitcher/ui/ThemeSwitcher';
import { CalendarHeader } from './CalendarHeader';
import { startOfWeek, endOfWeek } from 'date-fns';
import { WeekView } from './WeekView';
import { ArrowLeft } from 'lucide-react';
import { useZoomGesture } from '@/shared/hooks/useZoomGesture';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

type ViewMode = 'month' | 'week';

export const Calendar: FC = () => {
  const { range, handleDayClick, resetDates } = useDateRangePicker();
  const { months, loadMoreNext, loadMorePrev, jumpToMonth } = useMonths();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [visibleDate, setVisibleDate] = useState(new Date());
  const [jumpTarget, setJumpTarget] = useState<string | null>(
    `${new Date().getFullYear()}-${new Date().getMonth()}`
  );
  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // New state for view mode
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [zoomedWeek, setZoomedWeek] = useState<{ start: Date; end: Date } | null>(
    null
  );

  const gestureRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useLayoutEffect(() => {
    if (jumpTarget && viewMode === 'month') {
      const targetElement = monthRefs.current.get(jumpTarget);
      if (targetElement) {
        targetElement.scrollIntoView({ block: 'center' });
        setJumpTarget(null);
      }
    }
  }, [jumpTarget, months, viewMode]);

  const handleDateChange = (date: Date) => {
    setVisibleDate(date);
    const targetId = `${date.getFullYear()}-${date.getMonth()}`;
    setJumpTarget(targetId);
    jumpToMonth(date);
    setViewMode('month'); // Ensure we are in month view
  };

  const handleZoomToWeek = () => {
    if (range.start) {
      const weekStart = startOfWeek(range.start, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(range.start, { weekStartsOn: 1 });
      setZoomedWeek({ start: weekStart, end: weekEnd });
      setViewMode('week');
    }
  };

  const handleBackToMonthView = () => {
    if (zoomedWeek) {
      // Jump back to the month that contains the week
      handleDateChange(zoomedWeek.start);
    }
    setViewMode('month');
  };

  const handleZoomIn = () => {
    if (viewMode === 'month' && range.start && range.end) {
      handleZoomToWeek();
    }
  };

  const handleZoomOut = () => {
    if (viewMode === 'week') {
      handleBackToMonthView();
    }
  };

  useZoomGesture({
    target: gestureRef,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
  });

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
    <div ref={gestureRef} className="touch-none">
      {viewMode === 'month' ? (
        <CalendarHeader
          visibleDate={visibleDate}
          onDateChange={handleDateChange}
        />
      ) : (
        !isMobile && (
          <div className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-black p-4 flex justify-center items-center border-b border-gray-200 dark:border-zinc-800">
            <button
              onClick={handleBackToMonthView}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white"
            >
              <ArrowLeft size={20} />
              <span>Month View</span>
            </button>
          </div>
        )
      )}

      <div className="fixed top-4 right-4 z-30">
        <ThemeSwitcher />
      </div>

      {viewMode === 'month' ? (
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
      ) : (
        zoomedWeek && (
          <WeekView
            week={zoomedWeek}
            range={range}
            onDayClick={handleDayClick}
          />
        )
      )}

      <SelectedRangeDisplay
        range={range}
        onReset={resetDates}
        onZoom={handleZoomToWeek}
        isMobile={isMobile}
      />
    </div>
  );
};
