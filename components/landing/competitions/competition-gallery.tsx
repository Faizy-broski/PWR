"use client";

import {
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import Image from "next/image";
import { Minus, Plus, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export function CompetitionGallery({
  images,
  title,
  badge,
}: {
  images: string[];
  title: string;
  /** Overlaid on the main image, e.g. a live/closed status badge. */
  badge?: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <ZoomableImage key={active} src={active} alt={title} badge={badge} />

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all",
                index === activeIndex
                  ? "border-foreground ring-2 ring-foreground/20"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Scroll/double-click to zoom, drag to pan once zoomed in — all in place,
// inside the same box the image already occupies (no separate lightbox).
function ZoomableImage({
  src,
  alt,
  badge,
}: {
  src: string;
  alt: string;
  badge?: ReactNode;
}) {
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ x: number; y: number } | null>(null);

  function zoomAt(clientX: number, clientY: number, rect: DOMRect, next: number) {
    setOrigin({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
    setScale(next);
    if (next === 1) setOffset({ x: 0, y: 0 });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const next = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, scale - event.deltaY * 0.01),
    );
    zoomAt(event.clientX, event.clientY, rect, next);
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    zoomAt(event.clientX, event.clientY, rect, scale > 1 ? 1 : 2.5);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (scale === 1) return;
    dragState.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    setOffset({
      x: event.clientX - dragState.current.x,
      y: event.clientY - dragState.current.y,
    });
  }

  function handlePointerUp() {
    dragState.current = null;
    setIsDragging(false);
  }

  function zoomOut() {
    setScale((s) => {
      const next = Math.max(MIN_ZOOM, s - 0.5);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }

  function zoomIn() {
    setScale((s) => Math.min(MAX_ZOOM, s + 0.5));
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "group relative aspect-[4/3] w-full touch-none overflow-hidden rounded-xl border border-border bg-muted select-none",
          scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          draggable={false}
          style={{
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
          }}
          className="object-cover transition-transform duration-150 ease-out"
        />
        {badge}
        {scale === 1 && (
          <span className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="size-3.5" />
            Scroll or double-click to zoom
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_ZOOM}
          aria-label="Zoom out"
          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_ZOOM}
          aria-label="Zoom in"
          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
