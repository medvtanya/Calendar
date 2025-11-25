'use client';

import { useEffect, useRef, useCallback } from 'react';

type UseIntersectionObserverCallback = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect: UseIntersectionObserverCallback;
}

export const useIntersectionObserver = <T extends HTMLElement>({
  root,
  rootMargin,
  threshold,
  onIntersect,
}: UseIntersectionObserverOptions) => {
  const targetRef = useRef<T | null>(null);

  const memoizedOnIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry, observer);
        }
      });
    },
    [onIntersect]
  );

  useEffect(() => {
    const options = { root, rootMargin, threshold };
    const observer = new IntersectionObserver(memoizedOnIntersect, options);
    const target = targetRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [root, rootMargin, threshold, memoizedOnIntersect]);

  return targetRef;
};
