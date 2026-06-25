import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { AnimalCard } from "../components/AnimalCard";
import { FloatingClouds } from "../components/FloatingClouds";
import { regions } from "../features/regions/regionData";
import { useBedtime } from "../hooks/useBedtime";

export const HomePage = () => {
  const { bedtime } = useBedtime();

  return (
    <section className="relative grid min-h-[calc(100vh-74px)] grid-cols-[minmax(240px,330px)_minmax(360px,1fr)] items-center gap-[clamp(24px,5vw,68px)] px-[clamp(16px,4vw,48px)] pb-[46px] pt-9 max-[880px]:grid-cols-1 max-[880px]:items-start">
      <FloatingClouds />
      <div className="relative z-[2]">
        <p className="mb-2 text-[13px] font-black uppercase tracking-[0.05em] text-fruit-primary">
          {bedtime ? "Good night Hailey 🌙" : "Welcome back, Hailey"}
        </p>
        <h1 className="mb-3 text-[clamp(44px,7vw,82px)] font-black leading-none text-fruit-parchment text-shadow-fruit">
          Fruit Kingdom
        </h1>
        <p className="text-[17px] leading-[1.7] text-fruit-muted">
          Choose a fruit region and open tonight's soft little adventure.
        </p>
      </div>

      <div
        className="relative isolate min-h-[min(72vh,650px)] overflow-hidden rounded-blob border-[10px] border-fruit-parchment/70 bg-map-land shadow-map-soft max-[880px]:min-h-[560px] max-[560px]:min-h-[520px] max-[560px]:border-[6px]"
        aria-label="Fruit Kingdom map"
      >
        <div className="pointer-events-none absolute inset-[4%] rounded-[inherit] bg-map-noise bg-[length:28px_28px,14px_14px] bg-[position:0_0,7px_7px] opacity-[0.55]" />
        <div className="absolute inset-[18%_18%_12%_47%] rotate-[18deg] rounded-river bg-map-river shadow-river-ring" />
        <div className="absolute left-[14%] top-[37%] h-[26px] w-[68%] rotate-[12deg] rounded-full bg-fruit-path/85 shadow-map-path" />
        <div className="absolute left-[22%] top-[64%] h-[26px] w-[56%] -rotate-[19deg] rounded-full bg-fruit-path/85 shadow-map-path" />
        {regions.map((region, index) => (
          <Link
            className={`group absolute z-[2] grid -translate-x-1/2 -translate-y-1/2 animate-pin justify-items-center gap-[7px] text-fruit-text ${!region.unlocked ? "opacity-[0.64]" : ""}`}
            key={region.id}
            to={`/regions/${region.id}`}
            style={
              {
                top: region.mapPosition.top,
                left: region.mapPosition.left,
                animationDelay: `${index * 90}ms`,
              } as CSSProperties
            }
            aria-label={`${region.name}${region.unlocked ? "" : " locked"}`}
          >
            <span
              className={`grid size-[clamp(58px,8vw,78px)] place-items-center rounded-[28px] border-4 ${region.theme.pinBorder} bg-fruit-cream text-[clamp(29px,4vw,42px)] shadow-pin-low transition duration-200 ease-out group-hover:-rotate-3 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-pin-high`}
            >
              {region.unlocked ? region.emoji : "🔒"}
            </span>
            <span className="max-w-[124px] rounded-xl bg-fruit-parchment/90 px-2.5 py-[5px] text-center text-[13px] font-black text-fruit-text shadow-fruit-sm max-[560px]:max-w-[92px] max-[560px]:text-[11px]">
              {region.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="col-span-full grid grid-cols-4 gap-3.5 max-[880px]:grid-cols-2 max-[560px]:grid-cols-1">
        {regions.slice(0, 4).map((region) => (
          <AnimalCard key={region.id} pattern="default" className="flex items-center gap-3">
            <span className="text-[28px]">{region.emoji}</span>
            <strong>{region.name}</strong>
          </AnimalCard>
        ))}
      </div>
    </section>
  );
};
