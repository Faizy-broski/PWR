"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { WinnerCard, type Winner } from "./winners-card";

import "swiper/css";
import "swiper/css/navigation";

export function MoreWinnersSection({
  winners,
  title = "More Winners",
}: {
  winners: Winner[];
  title?: string;
}) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateEdges = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="bg-white py-16 sm:py-20 overflow-hidden">
      <div className="container">
        <Reveal duration={0.5}>
          <div className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 className="text-lg font-extrabold tracking-wide text-[#0D0C0C] uppercase sm:text-xl">
                {title}
              </h2>
              <span className="mt-2 block h-0.5 w-8 bg-brand-gold-dark" />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                ref={prevRef}
                type="button"
                aria-label="Previous winner"
                disabled={isBeginning}
                className="flex size-9 items-center justify-center rounded-full border border-black/10 text-black/50 transition-colors hover:border-brand-gold-dark hover:text-brand-gold-dark disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                ref={nextRef}
                type="button"
                aria-label="Next winner"
                disabled={isEnd}
                className="flex size-9 items-center justify-center rounded-full border border-black/10 text-black/50 transition-colors hover:border-brand-gold-dark hover:text-brand-gold-dark disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.15}
            onBeforeInit={(swiper) => {
              const nav = swiper.params.navigation;
              if (nav && typeof nav !== "boolean") {
                nav.prevEl = prevRef.current;
                nav.nextEl = nextRef.current;
              }
            }}
            onSwiper={updateEdges}
            onSlideChange={updateEdges}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="!overflow-visible"
          >
            {winners.map((winner) => (
              <SwiperSlide key={winner.id}>
                <WinnerCard winner={winner} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </div>
    </section>
  );
}