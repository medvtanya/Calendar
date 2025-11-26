'use client';

import { Smartphone } from 'lucide-react';

export const DesktopBlocker = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <Smartphone className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Приложение оптимизировано для мобильных устройств
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Пожалуйста, откройте эту страницу на своем телефоне.
        </p>
      </div>
    </div>
  );
};
