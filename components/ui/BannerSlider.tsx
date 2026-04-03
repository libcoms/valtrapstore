"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  title: string | null;
  subtitle: string | null;
}

export default function BannerSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (slides.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (index: number) => {
    setCurrent(index);
    startTimer(); // сбросить таймер при ручном переключении
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo((current - 1 + slides.length) % slides.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo((current + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-stone-200"
      style={{ aspectRatio: "3/1" }}
    >
      {slides.map((slide, i) => {
        const content = (
          <>
            <Image
              src={slide.imageUrl}
              alt={slide.title ?? "Баннер"}
              fill
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
              priority={i === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {(slide.title || slide.subtitle) && (
              <div
                className={`absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent
                             flex items-center px-8 md:px-14 transition-opacity duration-700
                             ${i === current ? "opacity-100" : "opacity-0"}`}
              >
                <div className="text-white max-w-md">
                  {slide.title && (
                    <h2 className="text-xl md:text-3xl font-bold leading-tight mb-1.5">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm md:text-base text-white/80">{slide.subtitle}</p>
                  )}
                  {slide.linkUrl && (
                    <span className="inline-block mt-4 text-xs md:text-sm font-semibold bg-white/20 hover:bg-white/30 transition-colors px-4 py-1.5 rounded-full backdrop-blur-sm">
                      Подробнее →
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        );

        return slide.linkUrl ? (
          <Link key={slide.id} href={slide.linkUrl} className="absolute inset-0 block">
            {content}
          </Link>
        ) : (
          <div key={slide.id} className="absolute inset-0">
            {content}
          </div>
        );
      })}

      {/* Стрелки */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                       bg-black/30 hover:bg-black/50 text-white flex items-center justify-center
                       transition-colors backdrop-blur-sm"
            aria-label="Предыдущий"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                       bg-black/30 hover:bg-black/50 text-white flex items-center justify-center
                       transition-colors backdrop-blur-sm"
            aria-label="Следующий"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Точки */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); goTo(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-5 h-1.5"
                    : "bg-white/50 hover:bg-white/80 w-1.5 h-1.5"
                }`}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
