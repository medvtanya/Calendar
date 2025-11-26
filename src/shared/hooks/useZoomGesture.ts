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
        const {
          movement, // Replaces 'da'
          velocities, // Replaces 'vdva'
          memo,
          first,
          last,
        } = state;

        if (!movement || !velocities) {
          return memo;
        }

        const [distance] = movement;
        const [velocity] = velocities;

        if (first) {
          return distance;
        }
        if (memo === undefined) return distance;

        const pinchVelocity = velocity;
        const isZoomingIn = distance > memo && pinchVelocity > zoomThreshold;
        const isZoomingOut = distance < memo && pinchVelocity < -zoomThreshold;

        if (last) {
          if (isZoomingIn) {
            onZoomIn();
          } else if (isZoomingOut) {
            onZoomOut();
          }
        }

        return distance;
      },
    },
    {
      target,
      pinch: {
        from: [1, 1],
      },
    }
  );
};
