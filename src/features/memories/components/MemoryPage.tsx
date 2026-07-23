import { forwardRef, useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { regions } from "../../regions/regionData";
import { toTranslationKey } from "../../../i18n/keys";
import type { Memory } from "../types";
import { formatAge } from "../../../config/childProfile";
import { MemoryMetadata } from "./MemoryMetadata";
import { MemoryPhoto } from "./MemoryPhoto";

type MemoryPageProps = {
  memory: Memory;
  side: "left" | "right";
  pageNumber: number;
  onReturnToContents: () => void;
  onDeleteMemory?: (memory: Memory) => void;
  onChangeCapturedAt?: (memory: Memory, capturedAt: Date) => void;
  deleting?: boolean;
  changingDate?: boolean;
};

export const MemoryPage = forwardRef<HTMLDivElement, MemoryPageProps>(
  ({ memory, side, pageNumber, onReturnToContents, onDeleteMemory, onChangeCapturedAt, deleting = false, changingDate = false }, ref) => {
    const { i18n, t } = useTranslation();
    const language = i18n.resolvedLanguage?.startsWith("zh") ? "zh" : "en";
    const region = regions.find((item) => item.id === memory.regionId);
    const regionName = region
      ? t(`regions.${toTranslationKey(region.id)}.name`)
      : t("memories.noRegion");
    const author =
      memory.createdBy.displayName || t(`memories.author.${memory.createdBy.familyRole}`);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [dateValue, setDateValue] = useState(() => memory.capturedAt.toISOString().slice(0, 10));

    useEffect(() => {
      setDateValue(memory.capturedAt.toISOString().slice(0, 10));
    }, [memory.capturedAt]);

    const handleDateChange = (value: string) => {
      setDateValue(value);
      if (value) onChangeCapturedAt?.(memory, new Date(`${value}T12:00:00`));
    };
    const stopPageFlip = (event: SyntheticEvent) => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation?.();
    };
    const stopPageFlipClick = (event: SyntheticEvent) => {
      event.preventDefault();
      stopPageFlip(event);
    };

    return (
      <div ref={ref} className={`memory-book-page memory-book-paper memory-book-page-${side}`}>
        <div
          className={`memory-page-content${side === "right" ? " memory-page-with-toolbar" : ""}`}
        >
          {side === "right" && (
            <>
              <button
                type="button"
                className="memory-return-contents"
                onClick={(event) => {
                  event.stopPropagation();
                  onReturnToContents();
                }}
                aria-label={t("memories.returnToContents")}
              >
                <span aria-hidden="true">⌂</span>
                <span>{t("memories.contentsShort")}</span>
              </button>
              <div className="memory-page-actions">
                <button
                  type="button"
                  className="memory-delete-memory"
                  disabled={deleting || changingDate}
                  onPointerDownCapture={stopPageFlip}
                  onMouseDownCapture={stopPageFlip}
                  onTouchStartCapture={stopPageFlip}
                  onClick={(event) => {
                    stopPageFlipClick(event);
                    onDeleteMemory?.(memory);
                  }}
                  aria-label={t("memories.deleteMemory")}
                >
                  <span aria-hidden="true">🗑</span>
                  <span>{deleting ? t("memories.deletingMemory") : t("memories.deleteMemory")}</span>
                </button>
                <button
                  type="button"
                  className="memory-change-date"
                  disabled={deleting || changingDate}
                  onPointerDownCapture={stopPageFlip}
                  onMouseDownCapture={stopPageFlip}
                  onTouchStartCapture={stopPageFlip}
                  onClick={(event) => {
                    stopPageFlipClick(event);
                    const input = dateInputRef.current;
                    if (input?.showPicker) input.showPicker();
                    else input?.click();
                  }}
                  aria-label={t("memories.changeDate")}
                >
                  <span aria-hidden="true">📅</span>
                  <span>{changingDate ? t("memories.changingDate") : t("memories.changeDate")}</span>
                </button>
                <input
                  ref={dateInputRef}
                  className="sr-only"
                  type="date"
                  value={dateValue}
                  max={new Date().toISOString().slice(0, 10)}
                  onPointerDownCapture={stopPageFlip}
                  onMouseDownCapture={stopPageFlip}
                  onTouchStartCapture={stopPageFlip}
                  onClick={stopPageFlipClick}
                  onChange={(event) => handleDateChange(event.target.value)}
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </>
          )}
          {side === "left" ? (
            <>
              <MemoryPhoto
                src={memory.displayImage.downloadUrl}
                alt={t("memories.photoAlt", { title: memory.title })}
                fallbackLabel={t("memories.photoUnavailable")}
              />
              <MemoryMetadata
                date={memory.capturedAt}
                age={formatAge(memory.ageInMonths, language)}
                regionEmoji={region?.emoji ?? "📷"}
                regionName={regionName}
                locale={language === "zh" ? "zh-CN" : "en-AU"}
              />
            </>
          ) : (
            <div className="flex h-full flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-fruit-primary">
                {t("memories.chapter")}
              </p>
              <h2 className="mt-2 text-[clamp(25px,3.5vw,42px)] font-black leading-[1.02] text-fruit-text">
                {memory.title}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm font-black text-fruit-muted">
                <span aria-hidden="true">{region?.emoji ?? "📷"}</span>
                {regionName}
              </p>

              {memory.location && (
                <p className="mt-1 text-[11px] font-bold text-fruit-soft">
                  {[memory.location.name, memory.location.city, memory.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {memory.description && (
                <>
                  <div className="my-[clamp(10px,2vh,18px)] h-px bg-fruit-cardDashed" />
                  <section>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.08em] text-fruit-primary">
                      {t("memories.realMemory")}
                    </h3>
                    <p className="mt-1.5 text-[clamp(11px,1.35vw,14px)] font-bold leading-relaxed text-fruit-muted">
                      {memory.description}
                    </p>
                  </section>
                </>
              )}

              <div className="mt-auto pt-[clamp(10px,2vh,18px)]">
                <p className="text-right text-sm font-black text-fruit-text">
                  {t("memories.from", { author })}
                </p>
              </div>
            </div>
          )}
        </div>
        <span className="memory-page-number" aria-hidden="true">
          {pageNumber}
        </span>
      </div>
    );
  },
);

MemoryPage.displayName = "MemoryPage";
