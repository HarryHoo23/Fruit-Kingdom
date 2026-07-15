import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toTranslationKey } from "../../i18n/keys";
import type { Region } from "../../types/domain";
import { RegionPreviewCard } from "./RegionPreviewCard";

type RegionMarkerProps = {
  region: Region;
  selected: boolean;
  animationDelay: number;
};

export const RegionMarker = ({ region, selected, animationDelay }: RegionMarkerProps) => {
  const { t } = useTranslation();
  const translationKey = toTranslationKey(region.id);
  const name = t(`regions.${translationKey}.name`);
  const description = t(`regions.${translationKey}.description`);
  const stateLabel = t(
    region.unlocked
      ? selected
        ? "map.selectedRegion"
        : "common.unlockedRegion"
      : "map.lockedRegion",
  );

  return (
    <Link
      className="group absolute z-10 grid -translate-x-1/2 -translate-y-1/2 animate-pin justify-items-center text-fruit-text motion-reduce:animate-none"
      to={`/regions/${region.id}`}
      style={
        {
          left: `${region.mapPosition.x}%`,
          top: `${region.mapPosition.y}%`,
          animationDelay: `${animationDelay}ms`,
        } as CSSProperties
      }
      aria-label={`${name}. ${stateLabel}`}
      aria-current={selected ? "location" : undefined}
    >
      <span
        className={`relative grid size-[clamp(34px,7cqw,62px)] place-items-center rounded-[clamp(12px,2.5cqw,22px)] border-[clamp(2px,0.45cqw,3px)] ${region.theme.pinBorder} bg-fruit-cream/95 text-[clamp(19px,4cqw,34px)] shadow-pin-low transition duration-200 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-pin-high group-focus-visible:-translate-y-1 group-focus-visible:scale-105 ${selected ? "ring-[clamp(2px,0.5cqw,4px)] ring-fruit-parchment/80" : ""}`}
      >
        <span aria-hidden="true">{region.emoji}</span>
        {!region.unlocked && (
          <span
            className="absolute -right-[clamp(4px,1cqw,8px)] -top-[clamp(4px,1cqw,8px)] grid size-[clamp(20px,3.5cqw,28px)] place-items-center rounded-full border-2 border-fruit-parchment bg-fruit-card text-[clamp(10px,1.8cqw,14px)] shadow-fruit"
            aria-hidden="true"
          >
            🔒
          </span>
        )}
      </span>
      <span className="mt-[clamp(2px,0.5cqw,4px)] max-w-[clamp(76px,14cqw,112px)] rounded-lg border border-fruit-cardBorder/60 bg-fruit-parchment/95 px-[clamp(5px,1cqw,8px)] py-[clamp(2px,0.5cqw,4px)] text-center text-[clamp(8px,1.45cqw,11px)] font-black leading-tight shadow-fruit-sm">
        {name}
      </span>
      <RegionPreviewCard name={name} description={description} stateLabel={stateLabel} />
    </Link>
  );
};
