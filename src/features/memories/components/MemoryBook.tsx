import { useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import HTMLFlipBook from "react-pageflip";
import { useTranslation } from "react-i18next";
import type { Memory } from "../types";
import { regions } from "../../regions/regionData";
import { useMemoryBook } from "../hooks/useMemoryBook";
import { BookCover } from "./BookCover";
import { MemoryPage } from "./MemoryPage";
import { MemoryContents } from "./MemoryContents";
import { HaileyIntroPage } from "./HaileyIntroPage";

type PageFlipController = {
  flip: (page: number) => void;
  flipNext: () => void;
  flipPrev: () => void;
};

type FlipBookRef = {
  pageFlip: () => PageFlipController;
};

type MemoryBookProps = {
  memories: Memory[];
  focusMemoryId?: string | null;
};

export const MemoryBook = ({ memories, focusMemoryId }: MemoryBookProps) => {
  const { t } = useTranslation();
  const bookRef = useRef<FlipBookRef | null>(null);
  const orderedMemories = memories;
  const categories = useMemo(() => {
    return regions.flatMap((region) => {
      const indexes = orderedMemories.flatMap((memory, index) =>
        memory.regionId === region.id ? [index] : [],
      );
      if (indexes.length === 0) return [];
      const firstIndex = indexes[0];
      const lastIndex = indexes[indexes.length - 1];
      // Cover, contents, and Hailey's introduction occupy indexes 0, 1, and 2.
      // Every photo then lands on an odd page, followed by its even description page.
      const targetPageIndex = 3 + firstIndex * 2;
      const startPage = targetPageIndex;
      const endPage = 4 + lastIndex * 2;

      return [
        {
          regionId: region.id,
          emoji: region.emoji,
          memoryCount: indexes.length,
          startPage,
          endPage,
          targetPageIndex,
        },
      ];
    });
  }, [orderedMemories]);
  const { currentPage, currentMemory, setCurrentPage, atStart, atEnd } = useMemoryBook(
    orderedMemories.length,
  );

  const previous = () => bookRef.current?.pageFlip().flipPrev();
  const next = () => bookRef.current?.pageFlip().flipNext();
  const goToCategory = (page: number) => bookRef.current?.pageFlip().flip(page);
  const returnToContents = () => bookRef.current?.pageFlip().flip(1);

  useEffect(() => {
    if (!focusMemoryId) return;
    const memoryIndex = orderedMemories.findIndex((memory) => memory.id === focusMemoryId);
    if (memoryIndex < 0) return;
    const timeoutId = window.setTimeout(
      () => bookRef.current?.pageFlip().flip(3 + memoryIndex * 2),
      100,
    );
    return () => window.clearTimeout(timeoutId);
  }, [focusMemoryId, orderedMemories]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  return (
    <div
      className="memory-book-shell"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={t("memories.bookLabel")}
    >
      <div className="memory-book-stage">
        <HTMLFlipBook
          ref={bookRef}
          className="memory-flip-book"
          style={{}}
          width={460}
          height={600}
          minWidth={270}
          maxWidth={520}
          minHeight={380}
          maxHeight={680}
          size="stretch"
          startPage={0}
          drawShadow
          flippingTime={950}
          usePortrait
          startZIndex={10}
          autoSize
          maxShadowOpacity={0.32}
          showCover
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={24}
          showPageCorners
          disableFlipByClick={false}
          onFlip={(event: { data: number }) => setCurrentPage(event.data)}
        >
          <BookCover title={t("memories.bookTitle")} subtitle={t("memories.bookSubtitle")} />
          <MemoryContents categories={categories} onSelectCategory={goToCategory} />
          <HaileyIntroPage />
          {orderedMemories.flatMap((memory, index) => [
            <MemoryPage
              key={`${memory.id}-left`}
              memory={memory}
              side="left"
              pageNumber={index * 2 + 3}
              onReturnToContents={returnToContents}
            />,
            <MemoryPage
              key={`${memory.id}-right`}
              memory={memory}
              side="right"
              pageNumber={index * 2 + 4}
              onReturnToContents={returnToContents}
            />,
          ])}
          <BookCover title="" subtitle="" back backMessage={t("memories.backCover")} />
        </HTMLFlipBook>
      </div>

      <div className="memory-book-navigation">
        <button
          type="button"
          onClick={previous}
          disabled={atStart}
          className="memory-book-nav-button"
          aria-label={t("memories.previous")}
        >
          <span aria-hidden="true">←</span> {t("memories.previous")}
        </button>
        <p
          className="min-w-[132px] text-center text-sm font-black text-fruit-text"
          aria-live="polite"
        >
          {currentPage === 0
            ? t("memories.cover")
            : currentPage === 1
              ? t("memories.contentsTitle")
              : currentPage === 2
                ? t("memories.haileyIntroTitle")
                : t("memories.indicator", {
                    current: currentMemory,
                    total: orderedMemories.length,
                  })}
        </p>
        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          className="memory-book-nav-button"
          aria-label={t("memories.next")}
        >
          {t("memories.next")} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
};
