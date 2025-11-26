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
          offset, // [distance, angle]
          velocity, // [velocity]
          memo,
          first,
          last,
        } = state;

        if (!offset || !velocity) {
          return memo;
        }

        const [distance] = offset;
        const [pinchVelocity] = velocity;

        if (first) {
          return distance;
        }
        if (memo === undefined) return distance;

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
