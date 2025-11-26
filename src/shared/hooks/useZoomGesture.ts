'use client';

import { useGesture } from '@use-gesture/react';
import { RefObject } from 'react';

type ZoomGestureOptions<T extends HTMLElement> = {
  target: RefObject<T>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomThreshold?: number;
};

export const useZoomGesture = <T extends HTMLElement>({
  target,
  onZoomIn,
  onZoomOut,
  zoomThreshold = 0.5,
}: ZoomGestureOptions<T>) => {
  useGesture(
    {
      onPinch: (state) => {
        const { da, vdva, memo, first, last } = state;

        // da: [distance, angle]
        // vdva: [velocity of distance, velocity of angle]
        // Guard against the state not having distance or velocity data,
        // which can happen at the start/end of a gesture.
        if (!da || !vdva) {
          return memo;
        }

        const [distance] = da;
        const [velocity] = vdva;

        if (first) {
          return distance; // On the first event, memoize the initial distance.
        }

        // memo holds the distance from the previous event.
        // If it's not set, we can't compare, so we just update it.
        if (memo === undefined) return distance;

        const pinchVelocity = velocity;
        const isZoomingIn = distance > memo && pinchVelocity > zoomThreshold;
        const isZoomingOut = distance < memo && pinchVelocity < -zoomThreshold;

        // Only trigger the zoom action on the final event of the gesture.
        if (last) {
          if (isZoomingIn) {
            onZoomIn();
          } else if (isZoomingOut) {
            onZoomOut();
          }
        }

        return distance; // Memoize the new distance for the next event.
      },
    },
    {
      target,
      pinch: {
        from: [1, 1], // a default value
      },
    }
  );
};
