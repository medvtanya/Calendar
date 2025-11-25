'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/link';
import { FC, useTransition } from 'react';

export const LanguageSwitcher: FC = () => {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="fixed top-4 right-4 z-10 flex gap-2">
      <button
        onClick={() => handleSwitch('ru')}
        disabled={isPending}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'ru'
            ? 'bg-blue-600 text-white cursor-default'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => handleSwitch('en')}
        disabled={isPending}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white cursor-default'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};
