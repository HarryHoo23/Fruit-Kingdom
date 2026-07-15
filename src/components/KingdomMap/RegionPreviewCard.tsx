type RegionPreviewCardProps = {
  name: string;
  description: string;
  stateLabel: string;
};

export const RegionPreviewCard = ({ name, description, stateLabel }: RegionPreviewCardProps) => (
  <span className="pointer-events-none invisible absolute bottom-[calc(100%+10px)] left-1/2 hidden w-52 -translate-x-1/2 translate-y-1 rounded-fruit border border-fruit-cardBorder bg-fruit-cream p-3 text-left opacity-0 shadow-fruit-lg transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100 min-[881px]:block">
    <span className="block text-[10px] font-black uppercase tracking-[0.05em] text-fruit-primary">
      {stateLabel}
    </span>
    <span className="mt-0.5 block text-sm font-black text-fruit-text">{name}</span>
    <span className="mt-1 block text-xs font-bold leading-snug text-fruit-soft">{description}</span>
  </span>
);
