import React, {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { isArray, isKeyOf } from '../utils';
import CanvasReconcilerPublic, { CanvasChild, TextChild } from './reconciler';
import { RENDERERS } from './renderers';
import { Dimensions } from './types';

export interface CanvasProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, 'onResize'> {
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  children?: ReactElement | readonly ReactElement[];
  ref?: ForwardedRef<HTMLCanvasElement>;
  onResize?: (dimensions: Dimensions) => void;
}

const getDimensions = (
  pixelRatio: number,
  width: number | undefined,
  height: number | undefined,
  canvas: HTMLCanvasElement | null | undefined
) => {
  return {
    width:
      typeof width === 'number'
        ? width * pixelRatio
        : (canvas?.clientWidth ?? 0) * pixelRatio,
    height:
      typeof height === 'number'
        ? height * pixelRatio
        : (canvas?.clientHeight ?? 0) * pixelRatio,
  };
};

export const Canvas = memo(
  forwardRef(
    (
      {
        width,
        height,
        pixelRatio = 1,
        onResize,
        backgroundColor,
        children,
        ...props
      }: CanvasProps,
      ref
    ) => {
      const [canvasCtx, setCanvasCtx] = useState<{
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
      } | null>(null);
      const [dimensions, setDimensions] = useState(
        getDimensions(pixelRatio, width, height, canvasCtx?.canvas)
      );

      const rootContainerRef = useRef<null | ReturnType<
        typeof CanvasReconcilerPublic.render
      >>(null);

      useEffect(() => {
        if (!canvasCtx) {
          rootContainerRef.current?.unmount();
          rootContainerRef.current = null;
          return;
        }

        if (!rootContainerRef.current) {
          rootContainerRef.current = CanvasReconcilerPublic.render(
            <>{children}</>,
            canvasCtx
          );
        } else {
          rootContainerRef.current.update(<>{children}</>);
        }

        const {
          container: { containerInfo },
        } = rootContainerRef.current;

        const { canvas, ctx } = canvasCtx;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        }

        ctx.scale(pixelRatio, pixelRatio);

        const drawChild = (child: CanvasChild | TextChild) => {
          if (!isKeyOf(RENDERERS, child.type)) {
            return;
          }

          const renderer = RENDERERS[child.type];

          if (child.props?.restore) {
            ctx.save();
          }

          renderer.drawBeforeChildren?.(
            { ...canvasCtx, drawChild },
            child.props
          );

          if (isArray(child.rendered)) {
            child.rendered.forEach(drawChild);
          }

          renderer.drawAfterChildren?.(
            { ...canvasCtx, drawChild },
            child.props
          );

          if (child.props?.restore) {
            ctx.restore();
          }
        };

        containerInfo.rendered.forEach(drawChild);

        const resizeObserver = new ResizeObserver(() => {
          setDimensions(
            getDimensions(pixelRatio, width, height, canvasCtx.canvas)
          );
        });

        resizeObserver.observe(canvas);

        return () => {
          resizeObserver.disconnect();
        };
      }, [
        canvasCtx,
        children,
        dimensions.height,
        dimensions.width,
        pixelRatio,
        backgroundColor,
        width,
        height,
      ]);

      const refWrapper = useCallback(
        (canvas: HTMLCanvasElement | null) => {
          setCanvasCtx(() => {
            if (!canvas) {
              return null;
            }

            return {
              canvas,
              ctx: canvas.getContext('2d')!,
            };
          });
          setDimensions(getDimensions(pixelRatio, width, height, canvas));

          if (ref) {
            if (typeof ref === 'object') {
              ref.current = canvas;
            } else if (typeof ref === 'function') {
              ref(canvas);
            }
          }
        },
        [height, pixelRatio, ref, width]
      );

      useEffect(() => {
        onResize?.({
          width: dimensions.width / pixelRatio,
          height: dimensions.height / pixelRatio,
        });
      }, [dimensions.width, dimensions.height, onResize, pixelRatio]);

      return (
        <canvas
          width={dimensions.width}
          height={dimensions.height}
          {...props}
          ref={refWrapper}
        ></canvas>
      );
    }
  )
);

Canvas.displayName = 'Canvas';
