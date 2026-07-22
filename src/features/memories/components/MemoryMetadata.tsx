type MemoryMetadataProps = {
  date: string;
  age: string;
  regionEmoji: string;
  regionName: string;
  locale: string;
};

export const MemoryMetadata = ({
  date,
  age,
  regionEmoji,
  regionName,
  locale,
}: MemoryMetadataProps) => (
  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[clamp(10px,1.2vw,13px)] font-black text-fruit-muted">
    <time dateTime={date}>
      {new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(
        new Date(`${date}T12:00:00`),
      )}
    </time>
    <span className="text-right">{age}</span>
    <span className="col-span-2 flex items-center gap-1.5 rounded-full bg-fruit-parchment/75 px-3 py-1.5 text-fruit-text">
      <span aria-hidden="true">{regionEmoji}</span> {regionName}
    </span>
  </div>
);
