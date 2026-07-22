import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { regions } from "../../regions/regionData";
import { toTranslationKey } from "../../../i18n/keys";
import type { Memory, MemoryLocale } from "../types";
import { MemoryMetadata } from "./MemoryMetadata";
import { MemoryPhoto } from "./MemoryPhoto";
import { ParentLetter } from "./ParentLetter";

type MemoryPageProps = {
  memory: Memory;
  side: "left" | "right";
  pageNumber: number;
  onReturnToContents: () => void;
};

export const MemoryPage = forwardRef<HTMLDivElement, MemoryPageProps>(
  ({ memory, side, pageNumber, onReturnToContents }, ref) => {
    const { i18n, t } = useTranslation();
    const locale: MemoryLocale = i18n.resolvedLanguage?.startsWith("zh") ? "zh" : "en";
    const region = regions.find((item) => item.id === memory.regionId)!;
    const regionName = t(`regions.${toTranslationKey(region.id)}.name`);
    const author = t(`memories.author.${memory.author.toLowerCase()}`);

    return (
      <div ref={ref} className={`memory-book-page memory-book-paper memory-book-page-${side}`}>
        <div
          className={`memory-page-content${side === "right" ? " memory-page-with-toolbar" : ""}`}
        >
          {side === "right" && (
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
          )}
          {side === "left" ? (
            <>
              <MemoryPhoto
                src={memory.photo}
                alt={t("memories.photoAlt", { title: memory.title[locale] })}
                objectPosition={memory.photoPosition}
                scale={memory.photoScale}
              />
              <MemoryMetadata
                date={memory.date}
                age={memory.ageLabel[locale]}
                regionEmoji={region.emoji}
                regionName={regionName}
                locale={locale === "zh" ? "zh-CN" : "en-AU"}
              />
            </>
          ) : (
            <div className="flex h-full flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-fruit-primary">
                {t("memories.chapter")}
              </p>
              <h2 className="mt-2 text-[clamp(25px,3.5vw,42px)] font-black leading-[1.02] text-fruit-text">
                {memory.title[locale]}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm font-black text-fruit-muted">
                <span aria-hidden="true">{region.emoji}</span>
                {regionName}
              </p>

              <div className="my-[clamp(10px,2vh,18px)] h-px bg-fruit-cardDashed" />
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.08em] text-fruit-primary">
                  {t("memories.realMemory")}
                </h3>
                <p className="mt-1.5 text-[clamp(11px,1.35vw,14px)] font-bold leading-relaxed text-fruit-muted">
                  {memory.description[locale]}
                </p>
              </section>

              <div className="my-[clamp(10px,2vh,18px)] h-px bg-fruit-cardDashed" />
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.08em] text-fruit-primary">
                  {t("memories.kingdomStory")}
                </h3>
                <p className="mt-1.5 text-[clamp(11px,1.35vw,14px)] font-bold italic leading-relaxed text-fruit-muted">
                  {memory.fruitKingdomStory[locale]}
                </p>
              </section>

              <div className="mt-auto pt-[clamp(10px,2vh,18px)]">
                <ParentLetter
                  author={author}
                  message={memory.parentMessage[locale]}
                  fromLabel={t("memories.from", { author })}
                  loveLabel={t("memories.love")}
                />
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
