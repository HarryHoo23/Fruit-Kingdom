import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FocusEvent, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import kingdomMap from "../../assets/map/fruit-kingdom-map.webp";
import { regions } from "../../features/regions/regionData";
import { toTranslationKey } from "../../i18n/keys";

const slideViews = [
  { regionId: "apple-forest", objectPosition: "18% 18%", scale: 1.48 },
  { regionId: "strawberry-castle", objectPosition: "62% 16%", scale: 1.5 },
  { regionId: "grape-valley", objectPosition: "82% 28%", scale: 1.55 },
  { regionId: "watermelon-lake", objectPosition: "44% 43%", scale: 1.42 },
  { regionId: "banana-beach", objectPosition: "12% 54%", scale: 1.5 },
  { regionId: "kiwi-rainforest", objectPosition: "30% 77%", scale: 1.5 },
  { regionId: "orange-volcano", objectPosition: "66% 72%", scale: 1.48 },
  { regionId: "coconut-island", objectPosition: "92% 76%", scale: 1.58 },
] as const;

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const slides = useMemo(
    () =>
      slideViews.map((view) => ({
        ...view,
        region: regions.find((region) => region.id === view.regionId)!,
      })),
    [],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (manualPaused || interactionPaused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [interactionPaused, manualPaused, reducedMotion, slides.length]);

  const selectSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);
  const previous = () => selectSlide(activeIndex - 1);
  const next = () => selectSlide(activeIndex + 1);

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > slides.length / 2) offset -= slides.length;
    if (offset < -slides.length / 2) offset += slides.length;
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

  const activeRegion = slides[activeIndex].region;
  const activeName = t(`regions.${toTranslationKey(activeRegion.id)}.name`);

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
        <div
          className="pointer-events-none absolute inset-x-[10%] bottom-[6%] h-20 rounded-[50%] bg-fruit-transparentInk/25 blur-2xl"
          aria-hidden="true"
        />

        {slides.map((slide, index) => {
          const offset = getOffset(index);
          const distance = Math.abs(offset);
          const visible = distance <= 2;
          const name = t(`regions.${toTranslationKey(slide.region.id)}.name`);
          const description = t(`regions.${toTranslationKey(slide.region.id)}.description`);

          return (
            <article
              key={slide.regionId}
              className="kingdom-carousel-card absolute left-1/2 top-1/2 overflow-hidden rounded-[clamp(24px,4vw,46px)] border-[clamp(5px,0.7vw,9px)] border-fruit-parchment bg-fruit-card shadow-map-soft"
              style={
                {
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
                } as CSSProperties
              }
              aria-hidden={offset !== 0}
              aria-label={`${index + 1} / ${slides.length}: ${name}`}
            >
              <img
                src={kingdomMap}
                alt=""
                width="1536"
                height="1024"
                draggable="false"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out"
                style={{ objectPosition: slide.objectPosition, transform: `scale(${slide.scale})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fruit-transparentInk/80 via-transparent to-white/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(18px,3vw,34px)] text-fruit-parchment">
                <div>
                  <p className="mb-1 text-[clamp(12px,1.5vw,15px)] font-black uppercase tracking-[0.08em] text-fruit-banana">
                    {slide.region.emoji} {t("photos.location")}
                  </p>
                  <h2 className="text-[clamp(25px,4vw,48px)] font-black leading-none text-shadow-fruit">
                    {name}
                  </h2>
                  <p className="mt-2 max-w-xl text-[clamp(12px,1.6vw,16px)] font-bold leading-relaxed text-fruit-parchment/90 max-[640px]:line-clamp-2">
                    {description}
                  </p>
                </div>
                <Link
                  to={`/regions/${slide.region.id}`}
                  tabIndex={offset === 0 ? 0 : -1}
                  className="shrink-0 rounded-full border-2 border-fruit-parchment/80 bg-fruit-parchment/95 px-4 py-2 text-sm font-black text-fruit-text shadow-fruit transition hover:-translate-y-0.5 hover:shadow-fruit-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50 max-[640px]:hidden"
                >
                  {t("photos.visitRegion")}
                </Link>
              </div>
            </article>
          );
        })}

        <button
          type="button"
          onClick={previous}
          className="absolute left-[clamp(8px,2vw,24px)] top-1/2 z-40 grid size-[clamp(42px,5vw,54px)] -translate-y-1/2 place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card/95 text-fruit-text shadow-button-lift transition hover:-translate-y-[55%] hover:shadow-button-hover active:-translate-y-[45%] active:shadow-button-press focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50"
          aria-label={t("photos.previous")}
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-[clamp(8px,2vw,24px)] top-1/2 z-40 grid size-[clamp(42px,5vw,54px)] -translate-y-1/2 place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card/95 text-fruit-text shadow-button-lift transition hover:-translate-y-[55%] hover:shadow-button-hover active:-translate-y-[45%] active:shadow-button-press focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50"
          aria-label={t("photos.next")}
        >
          <ArrowIcon direction="right" />
        </button>

        <div
          className="pointer-events-none absolute right-[7%] top-[10%] z-30 size-[clamp(64px,8vw,94px)] text-fruit-banana max-[640px]:hidden"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 100"
            className="size-full -rotate-90 overflow-visible drop-shadow-sm"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - ((activeIndex + 1) / slides.length) * 100}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center rotate-0 text-sm font-black text-fruit-parchment">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-fruit-cardBorder/70 bg-fruit-parchment/75 p-1.5 shadow-fruit backdrop-blur-sm">
          {slides.map((slide, index) => {
            const name = t(`regions.${toTranslationKey(slide.region.id)}.name`);
            return (
              <button
                key={slide.regionId}
                type="button"
                onClick={() => selectSlide(index)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fruit-inputFocus ${activeIndex === index ? "bg-fruit-primary text-white shadow-fruit" : "text-fruit-soft hover:bg-fruit-paper"}`}
                aria-label={t("photos.showSlide", { name })}
                aria-current={activeIndex === index ? "true" : undefined}
              >
                <span aria-hidden="true">{slide.region.emoji}</span> {name}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setManualPaused((value) => !value)}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-fruit-cardBorder bg-fruit-parchment text-sm font-black text-fruit-text shadow-fruit transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/50"
          aria-label={t(manualPaused ? "photos.play" : "photos.pause")}
        >
          <span aria-hidden="true">{manualPaused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {t("photos.activeSlide", {
          name: activeName,
          current: activeIndex + 1,
          total: slides.length,
        })}
      </p>
    </div>
  );
};
