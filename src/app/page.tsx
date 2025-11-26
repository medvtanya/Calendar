'use client';

import { Calendar } from '@/widgets/Calendar';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { DesktopBlocker } from '@/shared/ui/DesktopBlocker';

export default function Home() {
  // Check if the device width is greater than a typical mobile breakpoint.
  const isDesktop = useMediaQuery('(min-width: 769px)');

  if (isDesktop) {
    return <DesktopBlocker />;
  }

  return (
    <main>
      <Calendar />
    </main>
  );
}
