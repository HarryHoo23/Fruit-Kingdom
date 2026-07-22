import { useState } from "react";

type MemoryPhotoProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
};

export const MemoryPhoto = ({ src, alt, fallbackLabel }: MemoryPhotoProps) => {
  const [broken, setBroken] = useState(false);

  return (
    <figure className="memory-photo relative min-h-0 flex-1 overflow-hidden rounded-fruit border-[5px] border-fruit-parchment bg-fruit-paper shadow-fruit">
      {broken ? (
        <div className="grid size-full place-items-center p-6 text-center font-black text-fruit-soft">
          {fallbackLabel}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width="1536"
          height="1024"
          draggable="false"
          className="absolute inset-0 size-full object-contain"
          onError={() => setBroken(true)}
        />
      )}
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fruit-transparentInk/20 to-transparent"
      aria-hidden="true"
    />
    </figure>
  );
};
