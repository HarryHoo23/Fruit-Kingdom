import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import haileyAvatar from "../../assets/img/hailey-avatar.webp";
import { regions } from "../../features/regions/regionData";
import { toTranslationKey } from "../../i18n/keys";
import type { RegionId } from "../../types/domain";

export type HaileyStatus = {
  currentRegionId: RegionId;
  currentStoryId?: string;
  currentAdventureTitle?: string;
  avatar?: string;
  mood?: string;
  level?: number;
  lastPlayed?: Date;
};

type HaileyMarkerProps = {
  status: HaileyStatus;
};

export const HaileyMarker = ({ status }: HaileyMarkerProps) => {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const region = regions.find((item) => item.id === status.currentRegionId);

  useEffect(() => {
    if (!popoverOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPopoverOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popoverOpen]);

  if (!region) return null;

  const regionName = t(`regions.${toTranslationKey(region.id)}.name`);
  const markerLabel = t("haileyMarker.screenReaderLabel", { region: regionName });
  const avatarSrc = status.avatar ?? haileyAvatar;

  return (
    <div
      className="group/hailey absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={
        {
          top: `${region.haileyMarkerPosition.y}%`,
          left: `${region.haileyMarkerPosition.x}%`,
        } as CSSProperties
      }
    >
      <button
        type="button"
        onClick={() => setPopoverOpen((open) => !open)}
        className="relative grid size-[clamp(32px,5cqw,46px)] animate-hailey-float place-items-center rounded-full border-[clamp(2px,0.45cqw,3px)] border-fruit-parchment bg-fruit-strawberryLight text-[clamp(19px,3.2cqw,27px)] shadow-hailey-glow transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/60 motion-reduce:animate-none"
        aria-label={markerLabel}
        aria-expanded={popoverOpen}
        aria-haspopup="dialog"
      >
        <span
          className="pointer-events-none absolute -right-1 -top-2 animate-hailey-sparkle text-sm text-fruit-parchment motion-reduce:animate-none"
          aria-hidden="true"
        >
          ✦
        </span>
        <img
          src={avatarSrc}
          alt=""
          width="512"
          height="512"
          className="size-full animate-hailey-breathe rounded-full object-cover motion-reduce:animate-none"
          aria-hidden="true"
        />
      </button>

      {popoverOpen && (
        <div
          className="absolute left-[calc(100%+12px)] top-0 z-30 w-[min(280px,64vw)] rounded-fruit border-2 border-fruit-cardBorder bg-animal-dots bg-fruit-cream p-4 text-fruit-text shadow-fruit-lg max-[560px]:left-1/2 max-[560px]:top-[calc(100%+10px)] max-[560px]:-translate-x-1/2"
          role="dialog"
          aria-label={t("haileyMarker.popoverLabel")}
        >
          <button
            type="button"
            onClick={() => setPopoverOpen(false)}
            className="absolute right-2 top-2 grid size-8 place-items-center rounded-full text-xl font-black text-fruit-soft hover:bg-fruit-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fruit-inputFocus"
            aria-label={t("haileyMarker.close")}
          >
            ×
          </button>
          <div className="flex items-center gap-2 pr-8">
            <img
              src={avatarSrc}
              alt=""
              width="512"
              height="512"
              className="size-9 rounded-full border-2 border-fruit-parchment bg-fruit-strawberryLight object-cover shadow-fruit"
              aria-hidden="true"
            />
            <div>
              <p className="text-lg font-black">Hailey</p>
              <p className="text-xs font-black text-fruit-primary">
                {t("haileyMarker.youAreHere")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-black uppercase tracking-[0.05em] text-fruit-primary">
            {t("haileyMarker.currentRegion")}
          </p>
          <p className="font-black">{regionName}</p>
          <p className="mt-3 text-[11px] font-black uppercase tracking-[0.05em] text-fruit-primary">
            {t("haileyMarker.status")}
          </p>
          <p className="text-sm font-bold leading-snug">{t("haileyMarker.readyForAdventure")}</p>
          <div className="mt-4 grid gap-2">
            <Link
              className="rounded-xl bg-fruit-primary px-3 py-2.5 text-center text-sm font-black text-white shadow-fruit transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/40"
              to={`/regions/${region.id}`}
            >
              {t("haileyMarker.continueAdventure")}
            </Link>
            <Link
              className="rounded-xl border-2 border-fruit-border bg-fruit-card px-3 py-2 text-center text-sm font-black text-fruit-text transition hover:bg-fruit-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fruit-inputFocus/40"
              to={`/regions/${region.id}`}
            >
              {t("haileyMarker.exploreRegion")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
