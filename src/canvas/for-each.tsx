import React, { memo, ReactElement, useMemo } from 'react';

import { AnyObject } from '../types';
import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface ForEachProps extends CommonCanvasComponentProps {
  start?: number;
  step?: number;
  end: number;
  children: (
    index: number,
    start: number,
    step: number,
    end: number
  ) => ReactElement<AnyObject, CanvasElementType>;
}

export const ForEach = memo(
  ({ start = 0, step = 1, end, children }: ForEachProps) => {
    const rendered = useMemo(() => {
      const temp = [];

      for (let i = start; i < end; i += step) {
        temp.push(children(i, start, step, end));
      }

      return temp;
    }, [children, end, start, step]);

    return <CanvasElementType.ForEach>{rendered}</CanvasElementType.ForEach>;
  }
);

ForEach.displayName = 'ForEach';
