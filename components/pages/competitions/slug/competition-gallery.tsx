"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const hasMultiple = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-4/3 w-full overflow-hidden rounded-xl border-2 border-amber-50 bg-muted">
        <Image
          key={active}
          src={active}
          alt={title}
          fill
          unoptimized
          className="object-contain"
        />
        {badge}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-6 gap-2.5">
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
                  ? "border-brand-gold-light ring-2 ring-brand-gold-light/30"
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
