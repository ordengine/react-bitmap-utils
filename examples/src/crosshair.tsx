import { Line, Scale } from '@bitmapland/react-bitmap-utils';
import React, { memo } from 'react';

// This is just for demonstration purposes, so we can see where the center of the screen is

export const Crosshair = memo(({ scale }: { scale: number }) => {
  return (
    <Scale x={1 / scale} y={1 / scale}>
      <Line
        startX={0}
        startY={-10}
        endX={0}
        endY={10}
        strokeWidth={1}
        stroke="cyan"
      />
      <Line
        startX={-10}
        startY={0}
        endX={10}
        endY={0}
        strokeWidth={1}
        stroke="cyan"
      />
    </Scale>
  );
});

Crosshair.displayName = 'Crosshair';
