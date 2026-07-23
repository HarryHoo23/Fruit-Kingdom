import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MemoryDirectoryEntry, MemoryDirectorySort } from "../types";

type MemoryContentsProps = {
  categories: MemoryDirectoryEntry[];
  sortMode: MemoryDirectorySort;
  onSortModeChange: (mode: MemoryDirectorySort) => void;
  onSelectCategory: (targetPageIndex: number) => void;
};

export const MemoryContents = forwardRef<HTMLDivElement, MemoryContentsProps>(
  ({ categories, sortMode, onSortModeChange, onSelectCategory }, ref) => {
    const { t } = useTranslation();
    const [sortOpen, setSortOpen] = useState(false);
    const sortOptions = [
      ["tag", t("memories.sortTag")],
      ["time", t("memories.sortTime")],
      ["map", t("memories.sortMap")],
      ["category", t("memories.sortCategory")],
    ] as const;
    const selectedSortLabel = sortOptions.find(([value]) => value === sortMode)?.[1] ?? "";

    return (
      <div ref={ref} className="memory-book-page memory-book-paper memory-book-page-left">
        <div className="memory-page-content memory-contents-page">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-fruit-primary">
            {t("memories.contentsEyebrow")}
          </p>
          <h2 className="mt-2 text-[clamp(28px,4vw,46px)] font-black leading-none text-fruit-text">
            {t("memories.contentsTitle")}
          </h2>
          <p className="mt-3 text-[clamp(11px,1.3vw,14px)] font-bold leading-relaxed text-fruit-muted">
            {t("memories.contentsDescription")}
          </p>
          <div className="relative mt-4 grid gap-1 text-xs font-black text-fruit-text">
            {t("memories.sortLabel")}
            <button
              type="button"
              className="flex min-h-10 items-center justify-between rounded-fruit border-2 border-fruit-cardBorder bg-fruit-input px-3 text-left text-sm font-black text-fruit-text outline-none focus:border-fruit-inputFocus"
              onClick={(event) => {
                event.stopPropagation();
                setSortOpen((open) => !open);
              }}
            >
              <span>{selectedSortLabel}</span>
              <span aria-hidden="true">⌄</span>
            </button>
            {sortOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-fruit border-2 border-fruit-cardBorder bg-fruit-paper p-1 shadow-fruit">
                {sortOptions.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-black ${sortMode === value ? "bg-fruit-primary text-fruit-paper" : "text-fruit-text hover:bg-fruit-input"}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSortModeChange(value);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="memory-contents-list" aria-label={t("memories.contentsTitle")}>
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  type="button"
                  className="memory-contents-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectCategory(category.targetPageIndex);
                  }}
                  aria-label={t("memories.openCategory", {
                    category: category.label,
                    page: category.startPage,
                  })}
                >
                  <span className="memory-contents-icon" aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate font-black text-fruit-text">{category.label}</span>
                    <span className="block text-[10px] font-bold text-fruit-muted">
                      {t("memories.memoryCount", { count: category.memoryCount })}
                    </span>
                  </span>
                  <span className="memory-contents-dots" aria-hidden="true" />
                  <span className="shrink-0 text-xs font-black text-fruit-primary">
                    {category.startPage === category.endPage
                      ? category.startPage
                      : `${category.startPage}–${category.endPage}`}
                  </span>
                </button>
              );
            })}
          </nav>
          <span className="memory-page-number" aria-hidden="true">
            1
          </span>
        </div>
      </div>
    );
  },
);

MemoryContents.displayName = "MemoryContents";
