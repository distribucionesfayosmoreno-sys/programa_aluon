import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MaskRect } from '../DoorVisualSimulation.types';

type Props = {
  imageUrl: string;
  disabled?: boolean;
  value: MaskRect | null;
  onChange: (value: MaskRect | null) => void;
  imageWidth: number;
  imageHeight: number;
};

type DragState =
  | { kind: 'idle' }
  | { kind: 'dragging'; startX: number; startY: number; currentX: number; currentY: number };

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const toRect = (s: DragState & { kind: 'dragging' }, maxW: number, maxH: number): MaskRect => {
  const x0 = clamp(Math.min(s.startX, s.currentX), 0, maxW);
  const y0 = clamp(Math.min(s.startY, s.currentY), 0, maxH);
  const x1 = clamp(Math.max(s.startX, s.currentX), 0, maxW);
  const y1 = clamp(Math.max(s.startY, s.currentY), 0, maxH);
  const width = Math.max(1, Math.round(x1 - x0));
  const height = Math.max(1, Math.round(y1 - y0));
  return { x: Math.round(x0), y: Math.round(y0), width, height };
};

export const MaskRectSelector = ({ imageUrl, disabled, value, onChange, imageWidth, imageHeight }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [drag, setDrag] = useState<DragState>({ kind: 'idle' });
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });

  const syncDisplaySize = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDisplaySize({ w: rect.width, h: rect.height });
    }
  }, []);

  useEffect(() => {
    syncDisplaySize();
    window.addEventListener('resize', syncDisplaySize);
    return () => window.removeEventListener('resize', syncDisplaySize);
  }, [syncDisplaySize]);

  const mapClientToImagePixels = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    const el = imgRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const relX = clamp(clientX - rect.left, 0, rect.width);
    const relY = clamp(clientY - rect.top, 0, rect.height);
    const scaleX = imageWidth / rect.width;
    const scaleY = imageHeight / rect.height;
    return { x: relX * scaleX, y: relY * scaleY };
  }, [imageHeight, imageWidth]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    const mapped = mapClientToImagePixels(e.clientX, e.clientY);
    if (!mapped) return;
    setDrag({ kind: 'dragging', startX: mapped.x, startY: mapped.y, currentX: mapped.x, currentY: mapped.y });
    onChange(null);
  }, [disabled, mapClientToImagePixels, onChange]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    setDrag(prev => {
      if (prev.kind !== 'dragging') return prev;
      const mapped = mapClientToImagePixels(e.clientX, e.clientY);
      if (!mapped) return prev;
      return { ...prev, currentX: mapped.x, currentY: mapped.y };
    });
  }, [disabled, mapClientToImagePixels]);

  const onMouseUp = useCallback(() => {
    if (disabled) return;
    setDrag(prev => {
      if (prev.kind !== 'dragging') return prev;
      const rect = toRect(prev, imageWidth, imageHeight);
      onChange(rect);
      return { kind: 'idle' };
    });
  }, [disabled, imageHeight, imageWidth, onChange]);

  const overlayRect = useMemo(() => {
    if (drag.kind === 'dragging') return toRect(drag, imageWidth, imageHeight);
    return value;
  }, [drag, imageHeight, imageWidth, value]);

  const overlayStyle = useMemo(() => {
    if (!overlayRect) return null;
    const left = (overlayRect.x / imageWidth) * displaySize.w;
    const top = (overlayRect.y / imageHeight) * displaySize.h;
    const width = (overlayRect.width / imageWidth) * displaySize.w;
    const height = (overlayRect.height / imageHeight) * displaySize.h;
    return { left, top, width, height };
  }, [displaySize.h, displaySize.w, imageHeight, imageWidth, overlayRect]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: disabled ? 'not-allowed' : 'crosshair' }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Fachada"
        className="max-w-full h-auto rounded-xl border"
        onLoad={syncDisplaySize}
      />
      {overlayStyle && (
        <div
          className="absolute rounded-md"
          style={{
            left: overlayStyle.left,
            top: overlayStyle.top,
            width: overlayStyle.width,
            height: overlayStyle.height,
            border: '2px solid rgba(37, 99, 235, 0.95)',
            background: 'rgba(37, 99, 235, 0.15)',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.12) inset',
          }}
        />
      )}
    </div>
  );
};

