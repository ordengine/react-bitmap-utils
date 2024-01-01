import {
  Canvas,
  degreesToRadians,
  ForEach,
  Line,
  Rectangle,
  Rotate,
  Scale,
  Text,
  Translate,
  useAutoPixelRatio,
  useDelta,
  useFrameNow,
  useFrameRate,
} from '@bitmapland/react-bitmap-utils';
import React, { useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const pixelRatio = useAutoPixelRatio();
  const width = 500;
  const height = (width / 16) * 9;
  const now = useFrameNow();
  const frameRate = useFrameRate(100);
  const delta = useDelta();

  const scale = 1 + Math.cos(now * 0.0025) * 0.2;

  const forEach = useCallback(
    (index: number) => (
      <Rectangle
        key={index}
        x={5 * pixelRatio}
        y={(25 + index * 20) * pixelRatio}
        width={10 * pixelRatio}
        height={10 * pixelRatio}
        fill="black"
      />
    ),
    [pixelRatio]
  );

  return (
    <>
      <h1>Hello, World!</h1>
      <Canvas pixelRatio={pixelRatio} style={{ width, height }}>
        <Text
          x={5 * pixelRatio}
          y={5 * pixelRatio}
          fontSize={16 * pixelRatio}
          fill="black"
        >
          Delta: {delta}
        </Text>
        <Line
          startX={width * 0.5 * pixelRatio}
          startY={0}
          endX={width * 0.5 * pixelRatio}
          endY={height * pixelRatio}
          strokeWidth={1 * pixelRatio}
          stroke="cyan"
        />
        <ForEach end={3}>{forEach}</ForEach>
        <Translate
          x={width * 0.5 * pixelRatio}
          y={
            height * 0.5 * pixelRatio +
            Math.sin(now * 0.005) * height * 0.25 * pixelRatio
          }
        >
          <Rotate radians={degreesToRadians(Math.sin(now * 0.005) * 45)}>
            <Rectangle
              x={-50 * 0.5 * pixelRatio}
              y={-50 * 0.5 * pixelRatio}
              width={50 * pixelRatio}
              height={50 * pixelRatio}
              fill="red"
              strokeWidth={1 * pixelRatio}
              stroke="black"
            />
          </Rotate>
          <Scale x={scale} y={scale}>
            <Text
              x={0}
              y={0}
              fontSize={16 * pixelRatio}
              textAlign="center"
              verticalAlign="middle"
              fill="white"
            >
              {Math.round(frameRate)}fps
            </Text>
          </Scale>
        </Translate>
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
