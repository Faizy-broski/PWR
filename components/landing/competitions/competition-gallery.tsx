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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-muted"
      >
        <Image
          src={active}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {badge}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="size-3.5" />
          Zoom
        </span>
      </button>

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

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-3 p-3 sm:max-w-4xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <ZoomableImage
            key={active}
            src={active}
            alt={title}
          />
          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  className={cn(
                    "relative size-14 shrink-0 overflow-hidden rounded-md border transition-opacity",
                    index === activeIndex
                      ? "border-foreground"
                      : "border-border opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Scroll/pinch/double-click to zoom, drag to pan once zoomed in.
function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
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
          "relative aspect-[4/3] w-full touch-none overflow-hidden rounded-lg bg-muted select-none",
          scale > 1 ? (dragState.current ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
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
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() =>
            setScale((s) => {
              const next = Math.max(MIN_ZOOM, s - 0.5);
              if (next === 1) setOffset({ x: 0, y: 0 });
              return next;
            })
          }
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
          onClick={() => setScale((s) => Math.min(MAX_ZOOM, s + 0.5))}
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
