"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { GalleryItem } from "@/lib/types";

interface GalleryProps {
  gallery: GalleryItem[];
}

export function Gallery({ gallery }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = activeIndex !== null;

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : null));
  }, [gallery.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev !== null ? (prev - 1 + gallery.length) % gallery.length : null
    );
  }, [gallery.length]);

  // Open modal and store trigger reference
  const handleOpen = (index: number, btnElement: HTMLButtonElement) => {
    triggerRef.current = btnElement;
    setActiveIndex(index);
  };

  // Keyboard controls & focus restoration
  useEffect(() => {
    if (!isOpen) {
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
      return;
    }

    // Focus close button on open
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
      } else if (e.key === "Tab") {
        // Simple focus trap within dialog
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal, showNext, showPrev]);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  const activeItem = activeIndex !== null ? gallery[activeIndex] : null;

  return (
    <section id="gallery" className="scroll-mt-20 py-8 border-t border-border">
      <div className="pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Photo Gallery
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Take a visual journey through the rooms, common spaces, and surroundings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => handleOpen(idx, e.currentTarget)}
            aria-label={`View enlarged photo: ${item.alt}`}
            className="group relative h-56 sm:h-64 w-full overflow-hidden rounded-lg border border-border bg-muted cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 text-foreground px-3 py-1.5 text-xs font-medium shadow-md">
                <Eye className="h-3.5 w-3.5" />
                <span>Enlarge</span>
              </span>
            </div>
            {item.category && (
              <span className="absolute bottom-2 left-2 rounded-md bg-black/70 backdrop-blur-xs px-2 py-1 text-[11px] font-medium text-white">
                {item.category}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      {isOpen && activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo Gallery Lightbox"
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6"
        >
          <div className="relative max-w-4xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeModal}
              aria-label="Close photo lightbox"
              className="absolute top-0 right-0 sm:-top-10 sm:-right-4 text-white hover:text-white/80 p-2 rounded-full bg-black/50 sm:bg-transparent focus-visible:outline-2 focus-visible:outline-white cursor-pointer z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main Image View */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] flex items-center justify-center">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>

            {/* Navigation Buttons */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous photo"
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 text-white hover:text-white/80 p-2 rounded-full bg-black/60 focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photo"
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 text-white hover:text-white/80 p-2 rounded-full bg-black/60 focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Caption & Counter */}
            <div className="mt-3 text-center text-white/90 text-sm max-w-xl">
              <p className="font-medium">{activeItem.alt}</p>
              <p className="text-xs text-white/60 mt-0.5">
                {activeIndex + 1} of {gallery.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
