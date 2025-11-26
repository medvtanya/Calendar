'use client';

import { useGesture } from '@use-gesture/react';
import { RefObject } from 'react';

type ZoomGestureOptions = {
  target: RefObject<HTMLElement>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomThreshold?: number;
};

export const useZoomGesture = ({
  target,
  onZoomIn,
  onZoomOut,
  zoomThreshold = 0.5,
}: ZoomGestureOptions) => {
  useGesture(
    {
      onPinch: (state) => {
        const {
          offset, // [distance, angle] - Replaces 'da' / 'movement'
          velocity, // [velocity] - Replaces 'vdva' / 'velocities'
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
