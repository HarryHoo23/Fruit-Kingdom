import { useEffect, useState } from "react";
import type { CSSProperties, FocusEvent, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Maximize2, X } from "lucide-react";
import { AnimalCard } from "../AnimalCard";
import { regions } from "../../features/regions/regionData";
import { useMemories } from "../../features/memories/hooks/useMemories";
import { toTranslationKey } from "../../i18n/keys";

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

export const KingdomPhotoCarousel = () => {
  const { t } = useTranslation();
  const { memories, loading, error } = useMemories();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, memories.length - 1)));
  }, [memories.length]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (manualPaused || interactionPaused || reducedMotion || memories.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % memories.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [interactionPaused, manualPaused, memories.length, reducedMotion]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + memories.length) % memories.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % memories.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreen, activeIndex, memories.length]);

  const selectSlide = (index: number) => {
    if (memories.length === 0) return;
    setActiveIndex((index + memories.length) % memories.length);
  };
  const previous = () => selectSlide(activeIndex - 1);
  const next = () => selectSlide(activeIndex + 1);

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > memories.length / 2) offset -= memories.length;
    if (offset < -memories.length / 2) offset += memories.length;
    return offset;
  };

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

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false);
  };

  if (loading) {
    return <AnimalCard className="mx-auto max-w-xl text-center font-black text-fruit-soft">{t("photos.loading")}</AnimalCard>;
  }
  if (error) {
    return <AnimalCard className="mx-auto max-w-xl text-center font-black text-fruit-danger">{t("photos.loadError")}</AnimalCard>;
  }
  if (memories.length === 0) {
    return <AnimalCard className="mx-auto max-w-xl text-center font-black text-fruit-soft">{t("photos.empty")}</AnimalCard>;
  }

  const activeMemory = memories[activeIndex];

  return (
    <div
      className="relative mx-auto max-w-[1280px]"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div
        className="relative h-[clamp(360px,47vw,610px)] overflow-hidden rounded-fruit-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/40"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("photos.carouselLabel")}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="pointer-events-none absolute inset-x-[10%] bottom-[6%] h-20 rounded-[50%] bg-fruit-transparentInk/25 blur-2xl" aria-hidden="true" />
        {memories.map((memory, index) => {
          const offset = getOffset(index);
          const distance = Math.abs(offset);
          const visible = distance <= 2;
          const region = regions.find((item) => item.id === memory.regionId);
          const location = memory.location
            ? [memory.location.name, memory.location.city, memory.location.country].filter(Boolean).join(", ")
            : region
              ? t(`regions.${toTranslationKey(region.id)}.name`)
              : t("photos.location");

          return (
            <article
              key={memory.id}
              className="kingdom-carousel-card absolute left-1/2 top-1/2 overflow-hidden rounded-[clamp(24px,4vw,46px)] border-[clamp(5px,0.7vw,9px)] border-fruit-parchment bg-fruit-card shadow-map-soft"
              style={{
                "--slide-offset": offset,
                "--slide-distance": distance,
                "--slide-translate": `${offset * 72}%`,
                "--slide-translate-mobile": `${offset * 86}%`,
                "--slide-scale": 1 - distance * 0.13,
                "--slide-scale-mobile": 1 - distance * 0.16,
                "--slide-rotate": `${offset * 1.5}deg`,
                "--slide-brightness": 1 - distance * 0.16,
                "--slide-saturation": 1 - distance * 0.12,
                zIndex: 20 - distance,
                opacity: visible ? 1 : 0,
                pointerEvents: offset === 0 ? "auto" : "none",
              } as CSSProperties}
              aria-hidden={offset !== 0}
              aria-label={`${index + 1} / ${memories.length}: ${memory.title}`}
            >
              <img
                src={memory.displayImage.downloadUrl}
                alt={memory.title}
                width={memory.displayImage.width}
                height={memory.displayImage.height}
                draggable="false"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fruit-transparentInk/85 via-transparent to-white/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(18px,3vw,34px)] text-fruit-parchment">
                <div>
                  <p className="mb-1 text-[clamp(12px,1.5vw,15px)] font-black uppercase tracking-[0.08em] text-fruit-banana">
                    {region?.emoji ?? "📷"} {location}
                  </p>
                  <h2 className="text-[clamp(25px,4vw,48px)] font-black leading-none text-shadow-fruit">{memory.title}</h2>
                  {memory.description && (
                    <p className="mt-2 max-w-xl text-[clamp(12px,1.6vw,16px)] font-bold leading-relaxed text-fruit-parchment/90 max-[640px]:line-clamp-2">
                      {memory.description}
                    </p>
                  )}
                </div>
                <Link
                  to={`/memories?memory=${encodeURIComponent(memory.id)}`}
                  tabIndex={offset === 0 ? 0 : -1}
                  className="shrink-0 cursor-pointer rounded-full border-2 border-fruit-parchment/80 bg-fruit-parchment/95 px-4 py-2 text-sm font-black text-fruit-text shadow-fruit transition hover:-translate-y-0.5 hover:shadow-fruit-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50 max-[640px]:hidden"
                >
                  {t("photos.viewMemory")}
                </Link>
              </div>
            </article>
          );
        })}

        <button type="button" onClick={previous} className="absolute left-[clamp(8px,2vw,24px)] top-1/2 z-40 grid size-[clamp(42px,5vw,54px)] -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card/95 text-fruit-text shadow-button-lift transition hover:-translate-y-[55%] hover:shadow-button-hover active:-translate-y-[45%] active:shadow-button-press focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50" aria-label={t("photos.previous")}>
          <ArrowIcon direction="left" />
        </button>
        <button type="button" onClick={next} className="absolute right-[clamp(8px,2vw,24px)] top-1/2 z-40 grid size-[clamp(42px,5vw,54px)] -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card/95 text-fruit-text shadow-button-lift transition hover:-translate-y-[55%] hover:shadow-button-hover active:-translate-y-[45%] active:shadow-button-press focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50" aria-label={t("photos.next")}>
          <ArrowIcon direction="right" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-fruit-cardBorder/70 bg-fruit-parchment/75 p-1.5 shadow-fruit backdrop-blur-sm">
          {memories.map((memory, index) => (
            <button key={memory.id} type="button" onClick={() => selectSlide(index)} className={`max-w-44 cursor-pointer truncate whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fruit-inputFocus ${activeIndex === index ? "bg-fruit-primary text-white shadow-fruit" : "text-fruit-soft hover:bg-fruit-paper"}`} aria-label={t("photos.showSlide", { name: memory.title })} aria-current={activeIndex === index ? "true" : undefined}>
              {memory.title}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setManualPaused((value) => !value)} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-fruit-cardBorder bg-fruit-parchment text-sm font-black text-fruit-text shadow-fruit transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50" aria-label={t(manualPaused ? "photos.play" : "photos.pause")}>
          <span aria-hidden="true">{manualPaused ? "▶" : "Ⅱ"}</span>
        </button>
        <button type="button" onClick={() => setFullscreen(true)} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-fruit-cardBorder bg-fruit-parchment text-fruit-text shadow-fruit transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50" aria-label={t("photos.fitToScreen")}>
          <Maximize2 size={17} aria-hidden="true" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {t("photos.activeSlide", { name: activeMemory.title, current: activeIndex + 1, total: memories.length })}
      </p>

      {fullscreen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-fruit-transparentInk/95 p-4" role="dialog" aria-modal="true" aria-label={t("photos.fullscreenLabel")}>
          <img
            src={activeMemory.displayImage.downloadUrl}
            alt={activeMemory.title}
            className="pointer-events-none relative z-0 block h-auto w-auto max-h-[calc(100dvh-2rem)] max-w-[calc(100dvw-2rem)] object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-20 text-center text-fruit-parchment">
            <h2 className="text-2xl font-black">{activeMemory.title}</h2>
            {activeMemory.description && <p className="mx-auto mt-2 max-w-2xl text-sm font-bold">{activeMemory.description}</p>}
          </div>
          <button type="button" onClick={() => setFullscreen(false)} className="absolute right-5 top-5 z-30 grid size-11 cursor-pointer place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card text-fruit-text shadow-fruit" aria-label={t("photos.closeFullscreen")}>
            <X size={21} aria-hidden="true" />
          </button>
          <button type="button" onClick={previous} className="absolute left-5 top-1/2 z-30 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card text-fruit-text shadow-fruit" aria-label={t("photos.previous")}>
            <ArrowIcon direction="left" />
          </button>
          <button type="button" onClick={next} className="absolute right-5 top-1/2 z-30 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card text-fruit-text shadow-fruit" aria-label={t("photos.next")}>
            <ArrowIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
};
