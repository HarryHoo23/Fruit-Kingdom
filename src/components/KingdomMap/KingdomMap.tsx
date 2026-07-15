import { useTranslation } from "react-i18next";
import type { RegionId } from "../../types/domain";
import { IllustratedMapLayer } from "./IllustratedMapLayer";
import { MapControls } from "./MapControls";
import { MapOverlay } from "./MapOverlay";

type KingdomMapProps = {
  bedtime: boolean;
  currentRegionId: RegionId;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

export const KingdomMap = ({
  bedtime,
  currentRegionId,
  fullscreen,
  onToggleFullscreen,
}: KingdomMapProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`relative ${fullscreen ? "flex size-full items-center justify-center overflow-auto" : "w-full overflow-visible rounded-fruit-xl"}`}
    >
      <div
        className={`relative isolate aspect-[3/2] shrink-0 overflow-visible rounded-fruit-xl border-[clamp(4px,1cqw,10px)] border-fruit-parchment/80 bg-map-land shadow-map-soft [container-type:inline-size] ${fullscreen ? "h-full w-auto max-w-full" : "w-full"}`}
        aria-label={t("map.exploreKingdom")}
      >
        <IllustratedMapLayer alt={t("map.illustrationAlt")} bedtime={bedtime} />
        <MapOverlay currentRegionId={currentRegionId} />
        <MapControls fullscreen={fullscreen} onToggleFullscreen={onToggleFullscreen} />
      </div>
    </div>
  );
};
