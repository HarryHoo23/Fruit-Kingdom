import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import HTMLFlipBook from "react-pageflip";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import type { Memory, MemoryDirectoryEntry, MemoryDirectorySort } from "../types";
import { regions } from "../../regions/regionData";
import { toTranslationKey } from "../../../i18n/keys";
import { useMemoryBook } from "../hooks/useMemoryBook";
import { BookCover } from "./BookCover";
import { MemoryPage } from "./MemoryPage";
import { MemoryContents } from "./MemoryContents";
import { HaileyIntroPage } from "./HaileyIntroPage";
import { useAuth } from "../../auth/useAuth";
import { createAuthorSnapshot } from "../../auth/utils";
import { cleanupMemoryFiles } from "../services/memoryStorageService";
import { memoryService } from "../services/memoryService";

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
  const { profile } = useAuth();
  const bookRef = useRef<FlipBookRef | null>(null);
  const [sortMode, setSortMode] = useState<MemoryDirectorySort>("tag");
  const orderedMemories = useMemo(() => {
    const regionOrder = new Map<string, number>(regions.map((region, index) => [region.id, index]));
    const firstTag = (memory: Memory) => memory.tags[0]?.toLocaleLowerCase() || "untagged";
    const categoryName = (memory: Memory) => memory.milestoneId?.trim().toLocaleLowerCase() || "uncategorised";
    return [...memories].sort((left, right) => {
      if (sortMode === "map") {
        const difference = (regionOrder.get(left.regionId ?? "") ?? 999) - (regionOrder.get(right.regionId ?? "") ?? 999);
        if (difference !== 0) return difference;
      }
      if (sortMode === "tag") {
        const difference = firstTag(left).localeCompare(firstTag(right));
        if (difference !== 0) return difference;
      }
      if (sortMode === "category") {
        const difference = categoryName(left).localeCompare(categoryName(right));
        if (difference !== 0) return difference;
      }
      return left.capturedAt.getTime() - right.capturedAt.getTime();
    });
  }, [memories, sortMode]);
  const categories = useMemo<MemoryDirectoryEntry[]>(() => {
    const groups = new Map<string, { label: string; indexes: number[] }>();
    orderedMemories.forEach((memory, index) => {
      const keys = sortMode === "map"
        ? [{ id: memory.regionId ?? "uncategorised", label: memory.regionId ?? "Uncategorised" }]
        : sortMode === "tag"
          ? (memory.tags.length > 0
              ? memory.tags.map((tag) => ({ id: tag.toLocaleLowerCase(), label: tag }))
              : [{ id: "untagged", label: "Untagged" }])
          : sortMode === "category"
            ? [{ id: memory.milestoneId?.trim() || "uncategorised", label: memory.milestoneId?.trim() || "Uncategorised" }]
            : [{ id: String(memory.capturedAt.getFullYear()), label: String(memory.capturedAt.getFullYear()) }];
      keys.forEach(({ id, label }) => {
        const group = groups.get(id) ?? { label, indexes: [] };
        group.indexes.push(index);
        groups.set(id, group);
      });
    });
    return [...groups.entries()].map(([id, group]) => {
      const firstIndex = Math.min(...group.indexes);
      const lastIndex = Math.max(...group.indexes);
      const region = regions.find((item) => item.id === id);
      return {
        id,
        label: sortMode === "map" && region
          ? t(`regions.${toTranslationKey(region.id)}.name`)
          : group.label,
        emoji: sortMode === "map" ? region?.emoji ?? "📍" : sortMode === "tag" ? "🏷️" : sortMode === "time" ? "📅" : "🗂️",
        memoryCount: group.indexes.length,
        startPage: 3 + firstIndex * 2,
        endPage: 4 + lastIndex * 2,
        targetPageIndex: 3 + firstIndex * 2,
      };
    });
  }, [orderedMemories, sortMode, t]);
  const { currentPage, currentMemory, setCurrentPage, atStart, atEnd } = useMemoryBook(
    orderedMemories.length,
  );
  const deleteMutation = useMutation({
    mutationFn: async (memory: Memory) => {
      if (!profile?.active) throw new Error("An active parent profile is required");
      await memoryService.deleteMemory(memory.id, createAuthorSnapshot(profile));
      await cleanupMemoryFiles([
        memory.original.storagePath,
        memory.displayImage.storagePath,
        memory.thumbnail.storagePath,
      ]);
    },
  });

  const previous = () => bookRef.current?.pageFlip().flipPrev();
  const next = () => bookRef.current?.pageFlip().flipNext();
  const goToCategory = (page: number) => bookRef.current?.pageFlip().flip(page);
  const returnToContents = () => bookRef.current?.pageFlip().flip(1);
  const deleteMemory = (memory: Memory) => {
    if (!window.confirm(t("memories.deleteConfirm"))) return;
    deleteMutation.mutate(memory, {
      onError: () => window.alert(t("memories.deleteError")),
    });
  };

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
          <MemoryContents
            categories={categories}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            onSelectCategory={goToCategory}
          />
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
              onDeleteMemory={deleteMemory}
              deleting={deleteMutation.isPending && deleteMutation.variables?.id === memory.id}
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
