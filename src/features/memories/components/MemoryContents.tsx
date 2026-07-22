import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { toTranslationKey } from "../../../i18n/keys";
import type { MemoryCategory } from "../types";

type MemoryContentsProps = {
  categories: MemoryCategory[];
  onSelectCategory: (targetPageIndex: number) => void;
};

export const MemoryContents = forwardRef<HTMLDivElement, MemoryContentsProps>(
  ({ categories, onSelectCategory }, ref) => {
    const { t } = useTranslation();

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

          <nav className="memory-contents-list" aria-label={t("memories.contentsTitle")}>
            {categories.map((category) => {
              const regionName = t(`regions.${toTranslationKey(category.regionId)}.name`);

              return (
                <button
                  key={category.regionId}
                  type="button"
                  className="memory-contents-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectCategory(category.targetPageIndex);
                  }}
                  aria-label={t("memories.openCategory", {
                    category: regionName,
                    page: category.startPage,
                  })}
                >
                  <span className="memory-contents-icon" aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate font-black text-fruit-text">{regionName}</span>
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
