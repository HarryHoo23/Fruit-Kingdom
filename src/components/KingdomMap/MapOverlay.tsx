import { regions } from "../../features/regions/regionData";
import type { RegionId } from "../../types/domain";
import { HaileyMarker } from "../map/HaileyMarker";
import { RegionMarker } from "./RegionMarker";

type MapOverlayProps = {
  currentRegionId: RegionId;
};

export const MapOverlay = ({ currentRegionId }: MapOverlayProps) => (
  <div className="absolute inset-0">
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1000 667"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M225 150 C270 205 300 232 345 265"
        fill="none"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        className="text-fruit-parchment/70 [filter:drop-shadow(0_2px_1px_theme(colors.fruit.shadowPath))]"
      />
      <path
        d="M225 150 C270 205 300 232 345 265"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="4 12"
        className="animate-adventure-route text-fruit-primary motion-reduce:animate-none"
      />
    </svg>
    {regions.map((region, index) => (
      <RegionMarker
        key={region.id}
        region={region}
        selected={region.id === currentRegionId}
        animationDelay={index * 90}
      />
    ))}
    <HaileyMarker status={{ currentRegionId }} />
  </div>
);
