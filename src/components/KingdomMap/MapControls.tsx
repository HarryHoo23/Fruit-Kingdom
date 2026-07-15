import { useTranslation } from "react-i18next";

const FullscreenIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-[clamp(16px,2.5cqw,20px)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d={
        expanded
          ? "M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5"
          : "M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
      }
    />
  </svg>
);

type MapControlsProps = {
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

export const MapControls = ({ fullscreen, onToggleFullscreen }: MapControlsProps) => {
  const { t } = useTranslation();
  const label = t(fullscreen ? "common.exitFullscreenMap" : "map.fitToScreen");

  return (
    <button
      type="button"
      onClick={onToggleFullscreen}
      className="absolute right-[clamp(6px,1.5cqw,12px)] top-[clamp(6px,1.5cqw,12px)] z-40 flex min-h-[clamp(36px,6cqw,48px)] items-center gap-[clamp(4px,1cqw,8px)] rounded-xl border-2 border-fruit-parchment bg-fruit-primary px-[clamp(7px,1.5cqw,12px)] text-[clamp(9px,1.55cqw,13px)] font-black text-white shadow-button-lift transition hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-1 active:shadow-button-press focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
      aria-label={label}
      title={label}
    >
      <FullscreenIcon expanded={fullscreen} />
      <span>{label}</span>
    </button>
  );
};
