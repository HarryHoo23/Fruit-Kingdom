import { regions } from "../../features/regions/regionData";
import type { RegionId } from "../../types/domain";
import { HaileyMarker } from "../map/HaileyMarker";
import { RegionMarker } from "./RegionMarker";

type MapOverlayProps = {
  currentRegionId: RegionId;
  unlockedRegionIds: RegionId[];
};

const routePathFor = (currentRegionId: RegionId) => {
  const currentIndex = regions.findIndex((region) => region.id === currentRegionId);
  const route = regions.slice(0, Math.max(1, currentIndex + 1));
  if (route.length < 2) return "";

  const points = route.map(({ mapPosition }) => ({
    x: mapPosition.x * 10,
    y: mapPosition.y * 6.67,
  }));

  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x} ${point.y}`;
    const previous = points[index - 1];
    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    const bend = Math.min(38, length * 0.14);
    const controlPoint = {
      x: (previous.x + point.x) / 2 - (dy / length) * bend,
      y: (previous.y + point.y) / 2 + (dx / length) * bend,
    };
    return `${path} Q${controlPoint.x} ${controlPoint.y} ${point.x} ${point.y}`;
  }, "");
};

export const MapOverlay = ({ currentRegionId, unlockedRegionIds }: MapOverlayProps) => {
  const routePath = routePathFor(currentRegionId);

  return (
    <div className="absolute inset-0">
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 1000 667"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {routePath && (
          <>
            <path
              d={routePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-fruit-parchment/70 [filter:drop-shadow(0_2px_1px_theme(colors.fruit.shadowPath))]"
            />
            <path
              d={routePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 12"
              className="animate-adventure-route text-fruit-primary motion-reduce:animate-none"
            />
          </>
        )}
      </svg>
    {regions.map((region, index) => (
      <RegionMarker
        key={region.id}
        region={{ ...region, unlocked: unlockedRegionIds.includes(region.id) }}
        selected={region.id === currentRegionId}
        animationDelay={index * 90}
      />
    ))}
    <HaileyMarker status={{ currentRegionId }} />
    </div>
  );
};
